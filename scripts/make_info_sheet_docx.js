// Generate the Shalom Children's Home website info-request sheet as an editable Word (.docx) form.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, BorderStyle, ShadingType,
  AlignmentType, convertMillimetersToTwip,
} = require("docx");

const OUT = "Shalom-Childrens-Home-Website-Info-Request.docx";

// --- Warm, hopeful palette (hex without #) ---
const TEAL = "14746F";
const TEAL_DARK = "0E5A56";
const AMBER = "E0913A";
const INK = "2B2B2B";
const MUTE = "6B6B6B";
const LINE = "C9C9C9";

// A blank ruled line to write on: empty paragraph with a bottom border.
function rule(color = LINE, size = 6, before = 90, after = 50) {
  return new Paragraph({
    spacing: { before, after },
    border: { bottom: { style: BorderStyle.SINGLE, color, size, space: 1 } },
  });
}

function blanks(lines = 1) {
  return Array.from({ length: lines }, () => rule());
}

// A question with an optional star marker + writing space.
function item(text, { important = false, lines = 1 } = {}) {
  const children = [];
  if (important) children.push(new TextRun({ text: "★ ", bold: true, color: AMBER, size: 21 }));
  children.push(new TextRun({ text, color: INK, size: 21 }));
  return [
    new Paragraph({ spacing: { before: 120, after: 30 }, children }),
    ...blanks(lines),
  ];
}

// Colored full-width section band.
function section(n, title) {
  return new Paragraph({
    spacing: { before: 220, after: 90 },
    shading: { type: ShadingType.CLEAR, fill: TEAL, color: "auto" },
    children: [
      new TextRun({ text: `  ${n}.  ${title}`, bold: true, color: "FFFFFF", size: 23 }),
    ],
  });
}

function amberRule() {
  return new Paragraph({
    spacing: { before: 60, after: 140 },
    border: { bottom: { style: BorderStyle.SINGLE, color: AMBER, size: 14, space: 1 } },
  });
}

const children = [];

// Header
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 20 },
  children: [new TextRun({ text: "Shalom Children's Home", bold: true, color: TEAL_DARK, size: 40 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [new TextRun({ text: "Information for our new website", color: MUTE, size: 21 })],
}));
children.push(amberRule());

// Intro
children.push(new Paragraph({
  spacing: { after: 120 }, children: [new TextRun({
    text: "We are building a website for the home so that more people can find you, learn about your work, and support the children. Could you please help by answering the questions below?",
    color: INK, size: 21,
  })],
}));
children.push(new Paragraph({
  spacing: { after: 120 },
  children: [
    new TextRun({ text: "Please share ", color: INK, size: 21 }),
    new TextRun({ text: "whatever you can", bold: true, color: INK, size: 21 }),
    new TextRun({ text: " - even partial answers help, and we can add the rest later. Please also send ", color: INK, size: 21 }),
    new TextRun({ text: "as many photos as possible", bold: true, color: INK, size: 21 }),
    new TextRun({ text: " (see Section 5). Thank you so much!", color: INK, size: 21 }),
  ],
}));
children.push(new Paragraph({
  spacing: { after: 160 },
  children: [
    new TextRun({ text: "★ ", bold: true, color: AMBER, size: 21 }),
    new TextRun({ text: "The items marked with a star are the most important", bold: true, color: INK, size: 21 }),
    new TextRun({ text: " - please try to answer these first.", color: INK, size: 21 }),
  ],
}));

// 1. Basics
children.push(section(1, "About the home - the basics"));
children.push(...item("The full, correct name of the home (exactly as it should appear on the website):", { important: true }));
children.push(...item("Are you a registered Trust or Society? If yes, the registration number and the year the home started:"));
children.push(...item("Can donors claim income-tax exemption for donating to you (often called “80G”)?    [ ] Yes    [ ] No    [ ] Not sure"));
children.push(...item("Are you permitted to receive donations from abroad (foreign donors)?    [ ] Yes    [ ] No    [ ] Not sure"));
children.push(...item("Do you have a logo? If yes, please attach the image file. If not, we can design one for you."));
children.push(...item("Name, role, and a one or two line background of the person/people who run the home:", { lines: 2 }));

// 2. Story
children.push(section(2, "Your story & who you help"));
children.push(...item("In a few sentences: what does the home do, and who does it help?", { important: true, lines: 2 }));
children.push(...item("How and when did the home begin? Any story behind it:", { lines: 2 }));
children.push(...item("Do you care for boys, girls, or both - and what age range?", { important: true }));
children.push(...item("How many children are in your care right now?", { important: true }));
children.push(...item("What do you provide for the children? (for example: food, a home, schooling, medical care, other):", { lines: 2 }));

// 3. Contact
children.push(section(3, "How people can reach you"));
children.push(...item("Phone / WhatsApp number(s) for the website:", { important: true }));
children.push(...item("Email address for the website:", { important: true }));
children.push(...item("Full address, and a Google Maps link or pin if you have one:", { important: true, lines: 2 }));
children.push(...item("Any social media pages (Instagram, Facebook, YouTube)? Please share the links:"));
children.push(...item("Best days/times for visitors, and how they should arrange a visit:"));

// 4. Help
children.push(section(4, "How people can help"));
children.push(...item("How can someone donate? (bank transfer, UPI, cheque, cash, etc.)", { important: true }));
children.push(...item("Bank account details and/or UPI ID we can show on the website for donations:", { important: true, lines: 2 }));
children.push(...item("What does the money mostly go towards? If possible, an example cost - e.g., “Rs. ______ covers one child's schooling for a year”:", { lines: 2 }));
children.push(...item("Do you need physical items too? (clothes, food, books, school supplies - please list):", { lines: 2 }));
children.push(...item("Do you accept volunteers? If yes, what kind of help is useful?"));
children.push(...item("Can a supporter sponsor a particular child?    [ ] Yes    [ ] No"));

// 5. Photos
children.push(section(5, "Photos & a few words  (very important)"));
children.push(new Paragraph({
  spacing: { after: 40 },
  children: [new TextRun({ text: "Please attach these to your reply - they make the website come alive.", italics: true, color: MUTE, size: 20 })],
}));
children.push(...item("Photos - of the home, the children's daily activities, events, celebrations, meals, study time, etc. Clear, recent photos work best.", { important: true }));
children.push(...item("Any short videos you'd like on the site?"));
children.push(...item("Two or three nice things visitors or well-wishers have said about the home:", { lines: 2 }));
children.push(...item("Photo permission: Are we allowed to show children's faces on the website? We can also hide faces or use only first names if you prefer. Please tell us what you are comfortable with:", { important: true, lines: 2 }));

// 6. Website
children.push(section(6, "A couple of quick website questions"));
children.push(...item("Do you already own a website address (like shalomchildrenshome.org)?    [ ] Yes    [ ] No    [ ] Not sure"));
children.push(...item("Would you like to be able to update photos and news on the website yourselves later?    [ ] Yes    [ ] No"));
children.push(...item("Should the website be in English only, or English and Kannada?"));

// Footer
children.push(amberRule());
children.push(new Paragraph({
  spacing: { before: 40 },
  children: [new TextRun({
    text: "That's everything we need. Please send back whatever you have, and attach the photos and logo. Thank you for your time and for the wonderful work you do.",
    color: INK, size: 21,
  })],
}));

const doc = new Document({
  creator: "Shalom Children's Home Website Project",
  title: "Shalom Children's Home - Website Information Request",
  styles: { default: { document: { run: { font: "Calibri" } } } },
  sections: [{
    properties: {
      page: {
        margin: {
          top: convertMillimetersToTwip(16), bottom: convertMillimetersToTwip(16),
          left: convertMillimetersToTwip(20), right: convertMillimetersToTwip(20),
        },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("Wrote", OUT, buf.length, "bytes");
});
