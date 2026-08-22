# P.S.M World School — Report Card Generator

A fully offline tool to generate print-ready A4 report cards (Class IX & X) from an Excel sheet. No internet, no server, no installation — just open a file in a browser.

## Folder contents

```
index.html              → open this in a browser to run the app
style.css                → styling / print layout
app.js                    → app logic
template.xlsx             → blank data-entry template (given to office staff)
generate_template.py      → regenerates template.xlsx if you ever need to change columns
lib/xlsx.full.min.js      → offline copy of the Excel-reading library (SheetJS) — do not delete
assets/logo-board.png     → board/emblem logo used in the header
assets/logo-school.png    → school crest used in the header
```

Keep all files together in this folder — `index.html` loads the others by relative path.

## How the school office uses it, day to day

1. Open `template.xlsx` in Excel (or copy it — never edit the master file directly).
2. Fill one row per student. See the **Instructions** tab inside the workbook for column meanings and the grading scale. Column headers must not be renamed or reordered.
3. Save the file.
4. Open `index.html` (double-click it — it opens in your default browser).
5. Click **"Choose your filled template.xlsx"** and select the saved file.
6. All students load into the left-hand list. Search by name/admission no., or filter by Class IX / X.
7. Tick the students you want, then **Print selected** — or click **Print entire class** to load everyone at once.
8. In the print dialog, either print to your physical printer, or choose **"Save as PDF"** to generate PDF report cards for records/emailing.

Each student always prints on their own A4 page, matching the original school report card exactly.

## What's calculated automatically

- **A+B+C+D** (out of 20) = sum of the A, B, C, D columns you enter per subject.
- **Total** (out of 100) = A+B+C+D + Annual Exam.
- **Grade** for each subject is looked up automatically from the Total, using the grading scale printed at the bottom of the card (A1 91–100 … E(FAIL) 32 & below).

P1 and P2 (raw periodic test marks) are shown for record-keeping only and aren't part of the total — enter A, B, C, D as your own internal scaling already produces them, same as the paper process.

Everything else (co-scholastic grades, attendance, remarks, health stats) is entered as-is from the Excel sheet.

## Scaling this up

- **More students**: just add more rows to the Excel sheet — the list, search, and print-all features are built to handle a full school roll, not just a few names.
- **New academic year**: change the `Session` column per row (or per whole sheet); no code changes needed.
- **Editing the design** (colors, spacing, wording): all in `style.css` and the `reportCardHtml()` function in `app.js` — no build step, just edit and refresh.
- **Adding/removing a column** (e.g. a 7th subject, a new co-scholastic activity): edit the lists at the top of `app.js` (`SUBJECTS`, `CO_SCHOLASTIC`, etc.) and re-run `generate_template.py` to regenerate a matching template. Takes a few minutes, no framework/build tooling involved.
- **Multiple staff members**: since it's just files, this folder can be shared over a shared network drive, USB, or zipped and emailed — anyone with the folder can run it, fully offline.
- **If it later needs to go online** (e.g. hosted for remote staff): the same three files (`index.html`, `style.css`, `app.js`) can be pointed at a real database instead of an Excel import with minimal changes, since the rendering logic (`reportCardHtml`) is already separated from the data source.

## Notes

- Works in any modern browser (Chrome, Edge, Firefox). No install required.
- If double-clicking `index.html` shows a blank page in your specific browser due to local file security settings, right-click the folder → "Open with" a browser, or run a simple local server (e.g. `python -m http.server` inside this folder, then visit `http://localhost:8000`).
- Student Photo box is currently a placeholder — printing physical photos into that box, or wiring up a photo column, can be added on request.
