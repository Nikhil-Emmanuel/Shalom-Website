"""Generate the Shalom Children's Home website info-request sheet as a printable, fillable PDF."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether,
)

OUT = "Shalom-Childrens-Home-Website-Info-Request.pdf"

# --- Warm, hopeful palette ---
TEAL = colors.HexColor("#14746F")
TEAL_DARK = colors.HexColor("#0E5A56")
AMBER = colors.HexColor("#E0913A")
INK = colors.HexColor("#2B2B2B")
MUTE = colors.HexColor("#6B6B6B")
LINE = colors.HexColor("#C9C9C9")

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleX", parent=styles["Title"], fontName="Helvetica-Bold",
    fontSize=20, leading=24, textColor=TEAL_DARK, spaceAfter=2, alignment=TA_CENTER,
)
subtitle_style = ParagraphStyle(
    "SubX", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, leading=14, textColor=MUTE, alignment=TA_CENTER, spaceAfter=10,
)
intro_style = ParagraphStyle(
    "Intro", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, leading=15, textColor=INK, spaceAfter=6,
)
item_style = ParagraphStyle(
    "Item", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10.5, leading=14, textColor=INK, spaceBefore=6, spaceAfter=3,
)
note_style = ParagraphStyle(
    "Note", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=9.5, leading=13, textColor=MUTE, spaceBefore=2, spaceAfter=2,
)
legend_style = ParagraphStyle(
    "Legend", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=13, textColor=INK, spaceAfter=8,
)


def star():
    return f'<font color="#E0913A"><b>*</b></font>'


def section_header(number, title):
    """A colored band with the section number + title."""
    p = Paragraph(
        f'<font color="white"><b>{number}.&nbsp;&nbsp;{title}</b></font>',
        ParagraphStyle("SH", fontName="Helvetica-Bold", fontSize=11.5,
                       leading=15, textColor=colors.white),
    )
    t = Table([[p]], colWidths=[170 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), TEAL),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return t


def blank(lines=1):
    """Ruled writing space."""
    flow = []
    for _ in range(lines):
        flow.append(Spacer(1, 5))
        flow.append(HRFlowable(width="100%", thickness=0.6, color=LINE,
                               spaceBefore=0, spaceAfter=0))
    flow.append(Spacer(1, 2))
    return flow


def item(text, important=False, lines=1):
    """A question with a marker and writing space; kept on one page."""
    prefix = star() + " " if important else ""
    block = [Paragraph(prefix + text, item_style)]
    block.extend(blank(lines))
    return KeepTogether(block)


def note(text):
    return Paragraph(text, note_style)


def build():
    doc = SimpleDocTemplate(
        OUT, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=16 * mm, bottomMargin=16 * mm,
        title="Shalom Children's Home - Website Information Request",
        author="Shalom Children's Home Website Project",
    )
    s = []

    # Header
    s.append(Paragraph("Shalom Children's Home", title_style))
    s.append(Paragraph("Information for our new website", subtitle_style))
    s.append(HRFlowable(width="100%", thickness=1.2, color=AMBER,
                        spaceBefore=0, spaceAfter=10))

    # Intro
    s.append(Paragraph(
        "We are building a website for the home so that more people can find you, "
        "learn about your work, and support the children. Could you please help by "
        "answering the questions below?", intro_style))
    s.append(Paragraph(
        "Please share <b>whatever you can</b> - even partial answers help, and we can "
        "add the rest later. Please also send <b>as many photos as possible</b> "
        "(see Section 5). Thank you so much!", intro_style))
    s.append(Paragraph(
        f'{star()} <b>The items marked with a star are the most important</b> - '
        "please try to answer these first.", legend_style))

    # 1. Basics
    s.append(section_header(1, "About the home - the basics"))
    s.append(item("The full, correct name of the home (exactly as it should appear on the website):", important=True))
    s.append(item("Are you a registered Trust or Society? If yes, the registration number and the year the home started:"))
    s.append(item("Can donors claim income-tax exemption for donating to you (often called \"80G\")?  "
                  "[ ] Yes   [ ] No   [ ] Not sure"))
    s.append(item("Are you permitted to receive donations from abroad (foreign donors)?  "
                  "[ ] Yes   [ ] No   [ ] Not sure"))
    s.append(item("Do you have a logo? If yes, please attach the image file. If not, we can design one for you."))
    s.append(item("Name, role, and a one or two line background of the person/people who run the home:", lines=2))

    # 2. Story
    s.append(Spacer(1, 6))
    s.append(section_header(2, "Your story & who you help"))
    s.append(item("In a few sentences: what does the home do, and who does it help?", important=True, lines=2))
    s.append(item("How and when did the home begin? Any story behind it:", lines=2))
    s.append(item("Do you care for boys, girls, or both - and what age range?", important=True))
    s.append(item("How many children are in your care right now?", important=True))
    s.append(item("What do you provide for the children? (for example: food, a home, schooling, medical care, other):", lines=2))

    # 3. Contact
    s.append(Spacer(1, 6))
    s.append(section_header(3, "How people can reach you"))
    s.append(item("Phone / WhatsApp number(s) for the website:", important=True))
    s.append(item("Email address for the website:", important=True))
    s.append(item("Full address, and a Google Maps link or pin if you have one:", important=True, lines=2))
    s.append(item("Any social media pages (Instagram, Facebook, YouTube)? Please share the links:"))
    s.append(item("Best days/times for visitors, and how they should arrange a visit:"))

    # 4. Help
    s.append(Spacer(1, 6))
    s.append(section_header(4, "How people can help"))
    s.append(item("How can someone donate? (bank transfer, UPI, cheque, cash, etc.)", important=True))
    s.append(item("Bank account details and/or UPI ID we can show on the website for donations:", important=True, lines=2))
    s.append(item("What does the money mostly go towards? If possible, an example cost - "
                  "e.g., \"Rs. ______ covers one child's schooling for a year\":", lines=2))
    s.append(item("Do you need physical items too? (clothes, food, books, school supplies - please list):", lines=2))
    s.append(item("Do you accept volunteers? If yes, what kind of help is useful?"))
    s.append(item("Can a supporter sponsor a particular child?   [ ] Yes   [ ] No"))

    # 5. Photos
    s.append(Spacer(1, 6))
    s.append(section_header(5, "Photos & a few words  (very important)"))
    s.append(note("Please attach these to your reply - they make the website come alive."))
    s.append(item("Photos - of the home, the children's daily activities, events, celebrations, meals, "
                  "study time, etc. Clear, recent photos work best.", important=True))
    s.append(item("Any short videos you'd like on the site?"))
    s.append(item("Two or three nice things visitors or well-wishers have said about the home:", lines=2))
    s.append(item("Photo permission: Are we allowed to show children's faces on the website? "
                  "We can also hide faces or use only first names if you prefer. "
                  "Please tell us what you are comfortable with:", important=True, lines=2))

    # 6. Website
    s.append(Spacer(1, 6))
    s.append(section_header(6, "A couple of quick website questions"))
    s.append(item("Do you already own a website address (like shalomchildrenshome.org)?   "
                  "[ ] Yes   [ ] No   [ ] Not sure"))
    s.append(item("Would you like to be able to update photos and news on the website yourselves later?   "
                  "[ ] Yes   [ ] No"))
    s.append(item("Should the website be in English only, or English and Kannada?"))

    # Footer note
    s.append(Spacer(1, 10))
    s.append(HRFlowable(width="100%", thickness=1.2, color=AMBER, spaceBefore=0, spaceAfter=8))
    s.append(Paragraph(
        "That's everything we need. Please send back whatever you have, and attach the photos and logo. "
        "Thank you for your time and for the wonderful work you do.", intro_style))

    doc.build(s)
    print("Wrote", OUT)


if __name__ == "__main__":
    build()
