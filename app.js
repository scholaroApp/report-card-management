/* P.S.M World School - Report Card Generator
   Fully offline: reads an .xlsx file client-side (SheetJS, vendored in lib/)
   and renders print-ready A4 report cards. Supports two formats - Class IX-X
   and Class III-VIII - sharing the same header/signature/session logic, only
   one of which is shown/printed at a time via the "Class group" toggle. */

/* ---------------- Shared building blocks ---------------- */

const GRADE_SCALE_IXX = [
  [91, 100, "A1"], [81, 90, "A2"], [71, 80, "B1"], [61, 70, "B2"],
  [51, 60, "C1"], [41, 50, "C2"], [33, 40, "D"], [0, 32, "E(FAIL)"],
];
const GRADE_SCALE_III_VIII = [
  [91, 100, "A1"], [81, 90, "A2"], [71, 80, "B1"], [61, 70, "B2"],
  [51, 60, "C1"], [41, 50, "C2"], [33, 40, "D"], [0, 32, "E (Needs improvement)"],
];

function gradeFor(total, scale) {
  if (total === "" || total === null || isNaN(total)) return "";
  const t = Number(total);
  for (const [lo, hi, g] of scale) if (t >= lo && t <= hi) return g;
  return "";
}

function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* Personality / activity lists reused by both formats - only the section
   titles and which column they sit in differ between templates. */
const PERSONAL_TRAITS = [
  ["Courteousness", "Courteousness"],
  ["Confidence", "Confidence"],
  ["CareOfBelongings", "Care of belongings"],
  ["Neatness", "Neatness"],
  ["RegularityPunctuality", "Regularity & Punctuality"],
  ["RespectForOthersBelongings", "Respect for other Belongings"],
  ["DisciplineBehaviour", "Discipline & Behaviour"],
  ["AssignmentProjects", "Assignment / Projects"],
];
const WORK_ART_HEALTH = [
  ["WorkEducation", "Work Education"],
  ["ArtEducation", "Art Education (Visual & Performing Art)"],
  ["HealthPhysicalEducation", "Health & Physical Education"],
];

function miniTable(items, headerLabel) {
  const rows = items.map(([key, label]) => `
    <tr><td class="label">${escapeHtml(label)}</td>
      <td class="val">${escapeHtml("")}</td>
      <td class="val">${escapeHtml("")}</td></tr>`).join("");
  return { rows, headerLabel };
}

function miniTableForStudent(student, items, headerLabel, term1Suffix, term2Suffix) {
  const rows = items.map(([key, label]) => `
    <tr><td class="label">${escapeHtml(label)}</td>
      <td class="val">${escapeHtml(student[`${key}_${term1Suffix}`])}</td>
      <td class="val">${escapeHtml(student[`${key}_${term2Suffix}`])}</td></tr>`).join("");
  return `<table class="rc-mini">
    <tr><th class="label">${headerLabel}</th><th>TERM I</th><th>TERM II</th></tr>
    ${rows}
  </table>`;
}

/* Same header, every card, every template. */
function buildHeader(student, cls, session) {
  return `
    <div class="rc-header">
      <img class="logo-board" src="assets/logo-board.png" alt="Board logo"
        onerror="this.onerror=null;this.src='assets/logo-board.jpg';" />
      <div class="titles">
        <p class="school-name">P.S.M WORLD SCHOOL</p>
        <p class="report-title">PERFORMANCE REPORT</p>
        <p class="session-line">ACADEMIC SESSION : ${session}</p>
        <p class="class-line">CLASS : ${cls}</p>
      </div>
      <div class="right-col">
        <img class="logo-school" src="assets/logo-school.png" alt="School logo" />
      </div>
    </div>`;
}

/* Same student-info block, every card, every template. */
function buildStudentInfo(student) {
  return `
    <div class="rc-body-box">
    <div class="rc-info">
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Name of student</span><span class="val">${escapeHtml(student.Name)}</span></div>
        <div class="field"><span class="lbl">Admission No.</span><span class="val">${escapeHtml(student.AdmissionNo)}</span></div>
      </div>
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Father's Name</span><span class="val">${escapeHtml(student.FatherName)}</span></div>
        <div class="field"><span class="lbl">Date of Birth</span><span class="val">${escapeHtml(student.DOB)}</span></div>
      </div>
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Mother's Name</span><span class="val">${escapeHtml(student.MotherName)}</span></div>
        <div class="field"><span class="lbl">Phone No.</span><span class="val">${escapeHtml(student.PhoneNo)}</span></div>
      </div>
      <div class="rc-info-row address">
        <div class="field"><span class="lbl">Address</span><span class="val">${escapeHtml(student.Address)}</span></div>
      </div>
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Height</span><span class="val">${escapeHtml(student.Height)}</span></div>
        <div class="field"><span class="lbl">Weight</span><span class="val">${escapeHtml(student.Weight)}</span></div>
        <div class="field"><span class="lbl">Blood Group</span><span class="val">${escapeHtml(student.BloodGroup)}</span></div>
      </div>
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Vision</span><span class="val">${escapeHtml(student.Vision)}</span></div>
        <div class="field"><span class="lbl">Teeth</span><span class="val">${escapeHtml(student.Teeth)}</span></div>
        <div class="field"><span class="lbl">Oral Hygiene</span><span class="val">${escapeHtml(student.OralHygiene)}</span></div>
      </div>
    </div>
    <div class="rc-photo-box">Student<br/>Photo</div>
    </div>`;
}

/* Real signature images. Drop scanned/cropped signature files at these
   paths (transparent PNG works best) and they'll appear on every card,
   in either template. If a file is missing, the slot just stays blank
   instead of erroring - the "Sign." caption still prints either way. */
const SIGN_TEACHER_SRC = "assets/sign-teacher.png";
const SIGN_PRINCIPAL_SRC = "assets/sign-principal.png";

function signatureImg(src, alt) {
  return `<img class="sign-img" src="${src}" alt="${alt}" onerror="this.style.visibility='hidden'" />`;
}

function buildSignatures() {
  return `
      <div class="rc-signatures">
        <div class="sign-block">
          ${signatureImg(SIGN_TEACHER_SRC, "Class Teacher signature")}
          <span class="sign-line">Class Teacher Sign.</span>
        </div>
        <div class="sign-block">
          ${signatureImg(SIGN_PRINCIPAL_SRC, "Principal signature")}
          <span class="sign-line">Principal Sign.</span>
        </div>
        <div class="sign-block">
          <span class="sign-img"></span>
          <span class="sign-line">Parent Sign.</span>
        </div>
      </div>`;
}

/* ---------------- Class IX - X template ---------------- */

const SUBJECTS_IXX = ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer"];
const SUBJECT_FIELDS_IXX = ["P1", "A", "P2", "B", "C", "D", "AnnualExam"];

function subjectRowIXX(student, subj) {
  const key = subj.replace(" ", "");
  const vals = {};
  SUBJECT_FIELDS_IXX.forEach((f) => (vals[f] = student[`${key}_${f}`]));
  const abcdSum = num(vals.A) + num(vals.B) + num(vals.C) + num(vals.D);
  const total = abcdSum + num(vals.AnnualExam);
  const grade = gradeFor(total, GRADE_SCALE_IXX);
  return `<tr>
    <td class="subj-name">${escapeHtml(subj)}</td>
    <td>${escapeHtml(vals.P1)}</td>
    <td>${escapeHtml(vals.A)}</td>
    <td>${escapeHtml(vals.P2)}</td>
    <td>${escapeHtml(vals.B)}</td>
    <td>${escapeHtml(vals.C)}</td>
    <td>${escapeHtml(vals.D)}</td>
    <td>${abcdSum || ""}</td>
    <td>${escapeHtml(vals.AnnualExam)}</td>
    <td>${total || ""}</td>
    <td>${grade}</td>
  </tr>`;
}

function scholasticTableIXX(student) {
  const rows = SUBJECTS_IXX.map((s) => subjectRowIXX(student, s)).join("");
  return `<table class="rc-table">
    <thead>
      <tr>
        <th>SUBJECTS</th><th>P1<br>(80)</th><th>A<br>(5)</th><th>P2<br>(80)</th><th>B<br>(5)</th>
        <th>C<br>Note book<br>(5)</th><th>D<br>Sub Enr<br>(5)</th><th>A+B+C+D<br>(20)</th>
        <th>Annual<br>Exam<br>(80)</th><th>Total<br>(20+80)</th><th>Grade</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function gradingTableIXX() {
  return `
    <p class="rc-grading-title">Grading System</p>
    <table class="rc-grading">
      <tr><th class="row-label">Scholastic Areas</th><th colspan="8"></th></tr>
      <tr><td class="row-label">Grade</td><td>A1</td><td>A2</td><td>B1</td><td>B2</td><td>C1</td><td>C2</td><td>D</td><td>E(FAIL)</td></tr>
      <tr><td class="row-label">Marks Range</td><td>91-100</td><td>81-90</td><td>71-80</td><td>61-70</td><td>51-60</td><td>41-50</td><td>33-40</td><td>32 &amp; Below</td></tr>
      <tr><th class="row-label">Co-Scholastic Areas</th><th colspan="8"></th></tr>
      <tr><td class="row-label">Grade</td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td colspan="3"></td></tr>
      <tr><td class="row-label">Description</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td colspan="3"></td></tr>
    </table>`;
}

function reportCardHtmlIXX(student, session) {
  const cls = escapeHtml(student.Class || "");
  return `
  <section class="sheet">
    ${buildHeader(student, cls, session)}
    <div class="rc-body">
    ${buildStudentInfo(student)}
    <div>
      <p class="rc-section-title">A. SCHOLASTIC AREA</p>
      ${scholasticTableIXX(student)}
    </div>
    <div class="rc-two-col">
      <div>
        <p class="rc-section-title">B. CO-SCHOLASTIC ACTIVITIES</p>
        ${miniTableForStudent(student, PERSONAL_TRAITS, "ACTIVITIES", "T1", "T2")}
      </div>
      <div>
        <p class="rc-section-title">HEALTH &amp; PHYSICAL EDUCATION</p>
        ${miniTableForStudent(student, WORK_ART_HEALTH, "Activities", "T1", "T2")}
        <div class="rc-band">ATTENDANCE</div>
        <table class="rc-attendance">
          <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Attendance_T1)}</td></tr>
          <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Attendance_T2)}</td></tr>
        </table>
      </div>
    </div>
    <div class="rc-band">TEACHER'S REMARK</div>
    <table class="rc-remark">
      <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Remark_T1)}</td></tr>
      <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Remark_T2)}</td></tr>
    </table>
    </div>
    <div class="rc-footer">
      ${buildSignatures()}
      ${gradingTableIXX()}
    </div>
  </section>`;
}

/* ---------------- Class III - VIII template ---------------- */

const SUBJECTS_III_VIII = ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer", "General Knowledge", "Art & Craft"];

function subjectRowIIIVIII(student, subj) {
  const key = subj.replace(/[^A-Za-z]/g, "");
  const f = (name) => student[`${key}_${name}`];
  const ut1 = num(f("UT1")), ut2 = num(f("UT2")), nb1 = num(f("NB1")), se1 = num(f("SE1")), midTerm = num(f("MidTerm"));
  const ut3 = num(f("UT3")), ut4 = num(f("UT4")), nb2 = num(f("NB2")), se2 = num(f("SE2")), annualExam = num(f("AnnualExam"));
  const totalT1 = ut1 + ut2 + nb1 + se1 + midTerm;
  const totalT2 = ut3 + ut4 + nb2 + se2 + annualExam;
  const grandTotal = totalT1 + totalT2;
  const grade = gradeFor(grandTotal, GRADE_SCALE_III_VIII);
  return `<tr>
    <td class="subj-name">${escapeHtml(subj)}</td>
    <td>${escapeHtml(f("UT1"))}</td>
    <td>${escapeHtml(f("UT2"))}</td>
    <td>${escapeHtml(f("NB1"))}</td>
    <td>${escapeHtml(f("SE1"))}</td>
    <td>${escapeHtml(f("MidTerm"))}</td>
    <td>${totalT1 || ""}</td>
    <td>${escapeHtml(f("UT3"))}</td>
    <td>${escapeHtml(f("UT4"))}</td>
    <td>${escapeHtml(f("NB2"))}</td>
    <td>${escapeHtml(f("SE2"))}</td>
    <td>${escapeHtml(f("AnnualExam"))}</td>
    <td>${totalT2 || ""}</td>
    <td>${grandTotal || ""}</td>
    <td>${grade}</td>
  </tr>`;
}

function scholasticTableIIIVIII(student) {
  const rows = SUBJECTS_III_VIII.map((s) => subjectRowIIIVIII(student, s)).join("");
  return `<table class="rc-table">
    <thead>
      <tr class="grp-row">
        <th rowspan="3">SUBJECTS</th>
        <th colspan="6">TERM 1</th>
        <th colspan="6">TERM 2</th>
        <th colspan="2" class="overall">OVERALL</th>
      </tr>
      <tr class="col-row">
        <th>Unit<br>Test 1</th><th>Unit<br>Test 2</th><th>Note<br>Book</th><th>Subject<br>Enrich.</th><th>Mid<br>Term</th><th>Total<br>Marks</th>
        <th>Unit<br>Test 3</th><th>Unit<br>Test 4</th><th>Note<br>Book</th><th>Subject<br>Enrich.</th><th>Annual<br>Exam</th><th>Total<br>Marks</th>
        <th>Grand<br>Total<br>(40+60)</th><th>Grade</th>
      </tr>
      <tr class="marks-row">
        <th>5</th><th>5</th><th>5</th><th>5</th><th>20</th><th>40</th>
        <th>5</th><th>5</th><th>5</th><th>5</th><th>40</th><th>60</th>
        <th>100</th><th></th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function gradingTableIIIVIII() {
  return `
    <p class="rc-grading-title">Grading Scale for Scholastic &amp; Co-Scholastic Area</p>
    <table class="rc-grading">
      <tr><td class="row-label">Scholastic / Marks Range in %</td><td>91-100</td><td>81-90</td><td>71-80</td><td>61-70</td><td>51-60</td><td>41-50</td><td>33-40</td><td>32 &amp; Below</td></tr>
      <tr><td class="row-label">Grade</td><td>A1</td><td>A2</td><td>B1</td><td>B2</td><td>C1</td><td>C2</td><td>D</td><td>E (Needs improvement)</td></tr>
      <tr><td class="row-label">Co-Scholastic / Grade</td><td>A</td><td>B</td><td>C</td><td colspan="5"></td></tr>
      <tr><td class="row-label">Grade Point</td><td>3</td><td>2</td><td>1</td><td colspan="5"></td></tr>
      <tr><td class="row-label">Grade Achievement</td><td>Outstanding</td><td>Very Good</td><td>Fair</td><td colspan="5"></td></tr>
    </table>`;
}

function reportCardHtmlIIIVIII(student, session) {
  const cls = escapeHtml(student.Class || "");
  return `
  <section class="sheet">
    ${buildHeader(student, cls, session)}
    <div class="rc-body">
    ${buildStudentInfo(student)}
    <div>
      <p class="rc-section-title">A. SCHOLASTIC AREA</p>
      ${scholasticTableIIIVIII(student)}
    </div>
    <div class="rc-two-col">
      <div>
        <p class="rc-title-band">CO-SCHOLASTIC AREA</p>
        ${miniTableForStudent(student, WORK_ART_HEALTH, "ACTIVITIES", "T1", "T2")}
        <div class="rc-band">ATTENDANCE</div>
        <table class="rc-attendance">
          <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Attendance_T1)}</td></tr>
          <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Attendance_T2)}</td></tr>
        </table>
      </div>
      <div>
        <p class="rc-title-band">PERSONAL &amp; SOCIAL TRAITS</p>
        ${miniTableForStudent(student, PERSONAL_TRAITS, "ACTIVITIES", "T1", "T2")}
      </div>
    </div>
    <div class="rc-band">TEACHER'S REMARK</div>
    <table class="rc-remark">
      <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Remark_T1)}</td></tr>
      <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Remark_T2)}</td></tr>
    </table>
    </div>
    <div class="rc-footer">
      ${buildSignatures()}
      ${gradingTableIIIVIII()}
    </div>
  </section>`;
}

/* ---------------- Template registry ---------------- */

const TEMPLATES = {
  ixx: {
    label: "Class IX \u2013 X",
    classes: ["IX", "X"],
    render: reportCardHtmlIXX,
  },
  iii_viii: {
    label: "Class III \u2013 VIII",
    classes: ["III", "IV", "V", "VI", "VII", "VIII"],
    render: reportCardHtmlIIIVIII,
  },
};

let activeTemplate = "ixx";

/* ---------------- Excel import ---------------- */

let allStudents = [];
let selectedIds = new Set();
let classFilter = "ALL";

const fileInput = document.getElementById("fileInput");
const statusLine = document.getElementById("statusLine");
const studentListEl = document.getElementById("studentList");
const emptyHint = document.getElementById("emptyHint");
const stageEl = document.getElementById("stage");
const countBadge = document.getElementById("countBadge");
const searchBox = document.getElementById("searchBox");
const printBtn = document.getElementById("printBtn");
const printAllBtn = document.getElementById("printAllBtn");
const selectAllBtn = document.getElementById("selectAllBtn");
const clearBtn = document.getElementById("clearBtn");
const sessionInput = document.getElementById("sessionInput");
const templateToggle = document.getElementById("templateToggle");
const classFilterButtons = document.getElementById("classFilterButtons");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames.includes("Students") ? "Students" : wb.SheetNames[0];
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
      if (!rows.length) throw new Error("No student rows found in the sheet.");
      allStudents = rows.map((r, i) => ({ ...r, __id: i }));
      selectedIds = new Set(
        allStudents.filter((s) => belongsToActiveTemplate(s)).map((s) => s.__id)
      );
      setStatus(`Loaded ${allStudents.length} student${allStudents.length > 1 ? "s" : ""} from ${file.name}`, true);
      renderClassFilterButtons();
      renderList();
      renderStage();
    } catch (err) {
      setStatus("Could not read this file: " + err.message, false);
    }
  };
  reader.readAsArrayBuffer(file);
});

function setStatus(msg, ok) {
  statusLine.textContent = msg;
  statusLine.style.display = "block";
  statusLine.className = "status-line " + (ok ? "status-ok" : "status-err");
}

/* ---------------- Academic session override ---------------- */

sessionInput.addEventListener("input", renderStage);

/* ---------------- Class group (template) toggle ---------------- */
/* Only one report-card format is ever shown or printed at a time. Switching
   groups re-filters the student list down to that group's classes and
   rebuilds the class-filter buttons to match. */

templateToggle.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tpl]");
  if (!btn) return;
  activeTemplate = btn.dataset.tpl;
  templateToggle.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  classFilter = "ALL";
  selectedIds = new Set(
    allStudents.filter((s) => belongsToActiveTemplate(s)).map((s) => s.__id)
  );
  renderClassFilterButtons();
  renderList();
  renderStage();
});

function belongsToActiveTemplate(student) {
  const cls = String(student.Class || "").trim().toUpperCase();
  return TEMPLATES[activeTemplate].classes.includes(cls);
}

function renderClassFilterButtons() {
  const classes = TEMPLATES[activeTemplate].classes;
  classFilterButtons.innerHTML = "";
  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.dataset.cls = "ALL";
  allBtn.className = classFilter === "ALL" ? "active" : "";
  classFilterButtons.appendChild(allBtn);
  classes.forEach((c) => {
    const b = document.createElement("button");
    b.textContent = "Class " + c;
    b.dataset.cls = c;
    b.className = classFilter === c ? "active" : "";
    classFilterButtons.appendChild(b);
  });
  classFilterButtons.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      classFilterButtons.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      classFilter = btn.dataset.cls;
      renderList();
    });
  });
}

/* ---------------- Sidebar list ---------------- */

searchBox.addEventListener("input", renderList);

function visibleStudents() {
  const q = searchBox.value.trim().toLowerCase();
  return allStudents.filter((s) => {
    if (!belongsToActiveTemplate(s)) return false;
    const cls = String(s.Class || "").trim().toUpperCase();
    if (classFilter !== "ALL" && cls !== classFilter) return false;
    if (!q) return true;
    return String(s.Name || "").toLowerCase().includes(q) ||
           String(s.AdmissionNo || "").toLowerCase().includes(q);
  });
}

function renderList() {
  const list = visibleStudents();
  const inGroupTotal = allStudents.filter((s) => belongsToActiveTemplate(s)).length;
  studentListEl.innerHTML = "";
  emptyHint.style.display = allStudents.length ? "none" : "block";
  countBadge.textContent = `${list.length} / ${inGroupTotal}`;

  list.forEach((s) => {
    const li = document.createElement("li");
    const checked = selectedIds.has(s.__id);
    li.innerHTML = `
      <span style="display:flex;align-items:center;">
        <input type="checkbox" ${checked ? "checked" : ""} data-id="${s.__id}" />
        <span>${escapeHtml(s.Name || "(no name)")}<br><span class="tag">${escapeHtml(s.AdmissionNo || "")} &middot; Class ${escapeHtml(s.Class || "-")}</span></span>
      </span>`;
    li.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) selectedIds.add(s.__id); else selectedIds.delete(s.__id);
      renderStage();
    });
    studentListEl.appendChild(li);
  });

  const anySelected = allStudents.some((s) => selectedIds.has(s.__id) && belongsToActiveTemplate(s));
  printBtn.disabled = !anySelected;
  printAllBtn.disabled = inGroupTotal === 0;
}

selectAllBtn.addEventListener("click", () => {
  visibleStudents().forEach((s) => selectedIds.add(s.__id));
  renderList();
  renderStage();
});
clearBtn.addEventListener("click", () => {
  visibleStudents().forEach((s) => selectedIds.delete(s.__id));
  renderList();
  renderStage();
});

printBtn.addEventListener("click", () => window.print());
printAllBtn.addEventListener("click", () => {
  allStudents.filter((s) => belongsToActiveTemplate(s)).forEach((s) => selectedIds.add(s.__id));
  renderList();
  renderStage();
  setTimeout(() => window.print(), 200);
});

/* ---------------- Report card rendering ---------------- */

function renderStage() {
  const session = sessionInput.value.trim();
  const selected = allStudents.filter((s) => selectedIds.has(s.__id) && belongsToActiveTemplate(s));
  if (!selected.length) {
    stageEl.innerHTML = `<div class="empty-hint" style="text-align:center;margin-top:80px;font-size:14px;">
      Import an Excel file and select students from the left to preview their report cards here.</div>`;
    return;
  }
  const tpl = TEMPLATES[activeTemplate];
  stageEl.innerHTML = selected
    .map((s) => tpl.render(s, escapeHtml(session || s.Session || "")))
    .join("");
}

renderClassFilterButtons();
renderList();
renderStage();