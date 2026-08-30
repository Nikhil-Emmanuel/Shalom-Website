"""
Redacts children's faces in the photographs the home supplied, so that images
otherwise withheld by the safeguarding policy can be published.

Design notes that matter:

* The detector is a labour-saver, NOT the safety mechanism. A missed face is a
  silent failure — the image still looks processed, so nobody re-checks it.
  Every output must be reviewed by eye before it is published, and misses are
  corrected by adding manual boxes to MANUAL_BOXES below.

* Detection therefore runs deliberately HOT: a low score threshold plus an
  upscaled second pass to catch small faces. A false positive only blurs a
  patch of background, which is cheap. A false negative exposes a child.

* Redaction is destructive, not cosmetic: the region is crushed to a few pixels
  and then blurred, so it cannot be recovered by sharpening or upscaling.

Run: python scripts/redact_faces.py
Outputs to MEDIA FILES/redacted/ for review — nothing reaches public/ until
prepare-media.mjs is told the slug is verified.
"""

import json
import os

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "MEDIA FILES")
OUT_DIR = os.path.join(SRC_DIR, "redacted")
MODEL = os.path.join(ROOT, "scripts", "models", "face_detection_yunet_2023mar.onnx")

# Source file -> slug. Mirrors the `prominent` entries in prepare-media.mjs;
# only the tractable ones are redacted (the two 30-40 person group shots are
# excluded because every face cannot be verified with confidence).
TARGETS = [
    ("founder distributing stationary to children.jpeg", "village-stationery-1"),
    ("founder distributing stationary to children - 2.jpeg", "village-stationery-2"),
    ("founder distributing stationary to children -3.jpeg", "village-stationery-3"),
    ("founder distributing stationary to children -4.jpeg", "village-stationery-4"),
    ("founder distributing stationary to children-5.jpeg", "village-stationery-5"),
    ("founder distributing stationary to childre-6n.jpeg", "village-stationery-6"),
    ("WhatsApp Image 2026-08-20 at 6.00.23 PM.jpeg", "village-stationery-7"),
    ("WhatsApp Image 2026-08-20 at 6.00.23 PM (1).jpeg", "village-stationery-8"),
    ("students boarding bus.jpeg", "school-bus-lineup"),
    ("students boarding school bus .jpeg", "school-bus-boarding"),
    ("students in bus.jpeg", "school-bus-inside"),
    ("Students eating lunch.jpeg", "lunch-together"),
    ("children eating lunch on tables.jpeg", "lunch-younger-children"),
]

# Faces the detector misses, added by eye during review.
# Normalised [x, y, w, h] in 0-1 coordinates so they survive any resize.
MANUAL_BOXES: dict[str, list[list[float]]] = {}

# Reviewed by eye and confirmed: every child's face is either redacted or not
# visible, and the picture still reads. Only these are published — see the
# REDACTED set in prepare-media.mjs, which must stay in sync.
#
# Deliberately NOT published:
#   lunch-together — faces dominate the frame, so redaction destroys the
#   composition, and two small faces at the left edge could not be confirmed.
VERIFIED = {
    "village-stationery-1",
    "village-stationery-2",
    "village-stationery-3",
    "village-stationery-4",
    "village-stationery-5",
    "village-stationery-6",
    "village-stationery-7",
    "village-stationery-8",
    "school-bus-lineup",
    "school-bus-boarding",
    "school-bus-inside",
    "lunch-younger-children",
}

MAX_WIDTH = 2000
SCORE_THRESHOLD = 0.5   # still permissive; see module docstring
PADDING = 0.35          # grow boxes to cover hair, chin and ears

# No real face in these photographs spans more than about a sixth of the frame.
# Anything larger is a false positive on a flat surface — a bus panel, a table —
# and produces a huge smear that ruins the picture. Rejecting them is safe.
MAX_FACE_WIDTH_RATIO = 0.30


def detect(image, threshold=SCORE_THRESHOLD):
    """Detect faces at native scale plus 2x, and merge. 2x catches small faces."""
    boxes = []
    for scale in (1.0, 2.0):
        h, w = image.shape[:2]
        resized = (
            image if scale == 1.0
            else cv2.resize(image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC)
        )
        rh, rw = resized.shape[:2]
        detector = cv2.FaceDetectorYN.create(MODEL, "", (rw, rh), threshold, 0.3, 5000)
        detector.setInputSize((rw, rh))
        _, faces = detector.detect(resized)
        if faces is None:
            continue
        for f in faces:
            x, y, bw, bh = f[:4] / scale
            if bw > w * MAX_FACE_WIDTH_RATIO:
                continue
            boxes.append([float(x), float(y), float(bw), float(bh)])
    return merge(boxes)


def merge(boxes, iou_threshold=0.25):
    """Collapse overlapping detections from the two scales into one box each."""
    kept: list[list[float]] = []
    for box in sorted(boxes, key=lambda b: b[2] * b[3], reverse=True):
        x1, y1, w1, h1 = box
        overlaps = False
        for k in kept:
            x2, y2, w2, h2 = k
            ix = max(0, min(x1 + w1, x2 + w2) - max(x1, x2))
            iy = max(0, min(y1 + h1, y2 + h2) - max(y1, y2))
            inter = ix * iy
            union = w1 * h1 + w2 * h2 - inter
            if union > 0 and inter / union > iou_threshold:
                overlaps = True
                break
        if not overlaps:
            kept.append(box)
    return kept


def redact(image, boxes):
    """Crush each region to a few pixels, blur it, and feather it back in."""
    h, w = image.shape[:2]
    out = image.copy()

    for x, y, bw, bh in boxes:
        px, py = bw * PADDING, bh * PADDING
        x0 = max(0, int(x - px))
        y0 = max(0, int(y - py))
        x1 = min(w, int(x + bw + px))
        y1 = min(h, int(y + bh + py))
        if x1 <= x0 or y1 <= y0:
            continue

        region = out[y0:y1, x0:x1]
        rh, rw = region.shape[:2]

        # Destroy the detail: downsample hard, then blur what is left.
        small = cv2.resize(region, (max(2, rw // 28), max(2, rh // 28)), interpolation=cv2.INTER_AREA)
        crushed = cv2.resize(small, (rw, rh), interpolation=cv2.INTER_LINEAR)
        k = max(11, (min(rw, rh) // 3) | 1)
        crushed = cv2.GaussianBlur(crushed, (k, k), 0)

        # Elliptical, feathered mask so it reads as soft rather than a sticker.
        mask = np.zeros((rh, rw), np.float32)
        cv2.ellipse(mask, (rw // 2, rh // 2), (int(rw * 0.5), int(rh * 0.5)), 0, 0, 360, 1.0, -1)
        fk = max(11, (min(rw, rh) // 4) | 1)
        mask = cv2.GaussianBlur(mask, (fk, fk), 0)[..., None]

        out[y0:y1, x0:x1] = (crushed * mask + region * (1 - mask)).astype(np.uint8)

    return out


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    report = {}

    for filename, slug in TARGETS:
        image = cv2.imread(os.path.join(SRC_DIR, filename))
        if image is None:
            raise SystemExit(f"Could not read {filename}")

        h, w = image.shape[:2]
        if w > MAX_WIDTH:
            image = cv2.resize(image, (MAX_WIDTH, int(h * MAX_WIDTH / w)), interpolation=cv2.INTER_AREA)
            h, w = image.shape[:2]

        boxes = detect(image)
        manual = [[b[0] * w, b[1] * h, b[2] * w, b[3] * h] for b in MANUAL_BOXES.get(slug, [])]
        all_boxes = boxes + manual

        cv2.imwrite(
            os.path.join(OUT_DIR, f"{slug}.jpg"),
            redact(image, all_boxes),
            [cv2.IMWRITE_JPEG_QUALITY, 92],
        )
        report[slug] = {
            "detected": len(boxes),
            "manual": len(manual),
            "verified": slug in VERIFIED,
        }
        mark = "verified" if slug in VERIFIED else "NOT published"
        print(f"  {slug:<26} {len(boxes)} detected + {len(manual)} manual  [{mark}]")

    with open(os.path.join(OUT_DIR, "_report.json"), "w") as f:
        json.dump(report, f, indent=2)
    print(f"\n{len(TARGETS)} images -> MEDIA FILES/redacted/ (review before publishing)")


if __name__ == "__main__":
    main()
