// /* P.S.M World School - Report Card Generator
//    Fully offline: reads an .xlsx file client-side (SheetJS, vendored in lib/)
//    and renders print-ready A4 report cards matching the school's template. */

// const SUBJECTS = ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer"];
// const SUBJECT_FIELDS = ["P1", "A", "P2", "B", "C", "D", "AnnualExam"];
// const CO_SCHOLASTIC = [
//   ["Courteousness", "Courteousness"],
//   ["Confidence", "Confidence"],
//   ["CareOfBelongings", "Care of belongings"],
//   ["Neatness", "Neatness"],
//   ["RegularityPunctuality", "Regularity & Punctuality"],
//   ["RespectForOthersBelongings", "Respect for other Belongings"],
//   ["DisciplineBehaviour", "Discipline & Behaviour"],
//   ["AssignmentProjects", "Assignment / Projects"],
// ];
// const HEALTH_PHYSICAL = [
//   ["WorkEducation", "WORK EDUCATION"],
//   ["ArtEducation", "ART EDUCATION (VISUAL & PERFORMING ART)"],
//   ["HealthPhysicalEducation", "HEALTH & PHYSICAL EDUCATION"],
// ];

// const GRADE_SCALE = [
//   [91, 100, "A1"], [81, 90, "A2"], [71, 80, "B1"], [61, 70, "B2"],
//   [51, 60, "C1"], [41, 50, "C2"], [33, 40, "D"], [0, 32, "E(FAIL)"],
// ];

// function gradeFor(total) {
//   if (total === "" || total === null || isNaN(total)) return "";
//   const t = Number(total);
//   for (const [lo, hi, g] of GRADE_SCALE) if (t >= lo && t <= hi) return g;
//   return "";
// }

// function num(v) {
//   const n = parseFloat(v);
//   return isNaN(n) ? 0 : n;
// }

// /* ---------------- Excel import ---------------- */

// let allStudents = [];
// let selectedIds = new Set();
// let classFilter = "ALL";

// const fileInput = document.getElementById("fileInput");
// const statusLine = document.getElementById("statusLine");
// const studentListEl = document.getElementById("studentList");
// const emptyHint = document.getElementById("emptyHint");
// const stageEl = document.getElementById("stage");
// const countBadge = document.getElementById("countBadge");
// const searchBox = document.getElementById("searchBox");
// const printBtn = document.getElementById("printBtn");
// const printAllBtn = document.getElementById("printAllBtn");
// const selectAllBtn = document.getElementById("selectAllBtn");
// const clearBtn = document.getElementById("clearBtn");

// fileInput.addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (!file) return;
//   const reader = new FileReader();
//   reader.onload = (evt) => {
//     try {
//       const data = new Uint8Array(evt.target.result);
//       const wb = XLSX.read(data, { type: "array" });
//       const sheetName = wb.SheetNames.includes("Students") ? "Students" : wb.SheetNames[0];
//       const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
//       if (!rows.length) throw new Error("No student rows found in the sheet.");
//       allStudents = rows.map((r, i) => ({ ...r, __id: i }));
//       selectedIds = new Set(allStudents.map((s) => s.__id));
//       setStatus(`Loaded ${allStudents.length} student${allStudents.length > 1 ? "s" : ""} from ${file.name}`, true);
//       renderList();
//       renderStage();
//     } catch (err) {
//       setStatus("Could not read this file: " + err.message, false);
//     }
//   };
//   reader.readAsArrayBuffer(file);
// });

// function setStatus(msg, ok) {
//   statusLine.textContent = msg;
//   statusLine.style.display = "block";
//   statusLine.className = "status-line " + (ok ? "status-ok" : "status-err");
// }

// /* ---------------- Sidebar list ---------------- */

// document.querySelectorAll(".class-filter button").forEach((btn) => {
//   btn.addEventListener("click", () => {
//     document.querySelectorAll(".class-filter button").forEach((b) => b.classList.remove("active"));
//     btn.classList.add("active");
//     classFilter = btn.dataset.cls;
//     renderList();
//   });
// });

// searchBox.addEventListener("input", renderList);

// function visibleStudents() {
//   const q = searchBox.value.trim().toLowerCase();
//   return allStudents.filter((s) => {
//     const cls = String(s.Class || "").trim().toUpperCase();
//     if (classFilter !== "ALL" && cls !== classFilter) return false;
//     if (!q) return true;
//     return String(s.Name || "").toLowerCase().includes(q) ||
//            String(s.AdmissionNo || "").toLowerCase().includes(q);
//   });
// }

// function renderList() {
//   const list = visibleStudents();
//   studentListEl.innerHTML = "";
//   emptyHint.style.display = allStudents.length ? "none" : "block";
//   countBadge.textContent = `${list.length} / ${allStudents.length}`;

//   list.forEach((s) => {
//     const li = document.createElement("li");
//     const checked = selectedIds.has(s.__id);
//     li.innerHTML = `
//       <span style="display:flex;align-items:center;">
//         <input type="checkbox" ${checked ? "checked" : ""} data-id="${s.__id}" />
//         <span>${escapeHtml(s.Name || "(no name)")}<br><span class="tag">${escapeHtml(s.AdmissionNo || "")} &middot; Class ${escapeHtml(s.Class || "-")}</span></span>
//       </span>`;
//     li.querySelector("input").addEventListener("change", (e) => {
//       if (e.target.checked) selectedIds.add(s.__id); else selectedIds.delete(s.__id);
//       renderStage();
//     });
//     studentListEl.appendChild(li);
//   });

//   const anySelected = allStudents.some((s) => selectedIds.has(s.__id));
//   printBtn.disabled = !anySelected;
//   printAllBtn.disabled = allStudents.length === 0;
// }

// selectAllBtn.addEventListener("click", () => {
//   visibleStudents().forEach((s) => selectedIds.add(s.__id));
//   renderList();
//   renderStage();
// });
// clearBtn.addEventListener("click", () => {
//   selectedIds.clear();
//   renderList();
//   renderStage();
// });

// printBtn.addEventListener("click", () => window.print());
// printAllBtn.addEventListener("click", () => {
//   selectedIds = new Set(allStudents.map((s) => s.__id));
//   renderList();
//   renderStage();
//   setTimeout(() => window.print(), 200);
// });

// /* ---------------- Report card rendering ---------------- */

// function escapeHtml(str) {
//   return String(str ?? "").replace(/[&<>"']/g, (c) => ({
//     "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
//   }[c]));
// }

// function subjectRow(student, subj) {
//   const key = subj.replace(" ", "");
//   const vals = {};
//   SUBJECT_FIELDS.forEach((f) => (vals[f] = student[`${key}_${f}`]));
//   const abcdSum = num(vals.A) + num(vals.B) + num(vals.C) + num(vals.D);
//   const total = abcdSum + num(vals.AnnualExam);
//   const grade = gradeFor(total);
//   return `<tr>
//     <td class="subj-name">${escapeHtml(subj)}</td>
//     <td>${escapeHtml(vals.P1)}</td>
//     <td>${escapeHtml(vals.A)}</td>
//     <td>${escapeHtml(vals.P2)}</td>
//     <td>${escapeHtml(vals.B)}</td>
//     <td>${escapeHtml(vals.C)}</td>
//     <td>${escapeHtml(vals.D)}</td>
//     <td>${abcdSum || ""}</td>
//     <td>${escapeHtml(vals.AnnualExam)}</td>
//     <td>${total || ""}</td>
//     <td>${grade}</td>
//   </tr>`;
// }

// function coScholasticTable(student) {
//   const rows = CO_SCHOLASTIC.map(([key, label]) => `
//     <tr><td class="label">${escapeHtml(label)}</td>
//       <td class="val">${escapeHtml(student[`${key}_T1`])}</td>
//       <td class="val">${escapeHtml(student[`${key}_T2`])}</td></tr>`).join("");
//   return `<table class="rc-mini">
//     <tr><th class="label">ACTIVITIES</th><th>TERM I</th><th>TERM II</th></tr>
//     ${rows}
//   </table>`;
// }

// function healthTable(student) {
//   const rows = HEALTH_PHYSICAL.map(([key, label]) => `
//     <tr><td class="label">${escapeHtml(label)}</td>
//       <td class="val">${escapeHtml(student[`${key}_T1`])}</td>
//       <td class="val">${escapeHtml(student[`${key}_T2`])}</td></tr>`).join("");
//   return `<table class="rc-mini">
//     <tr><th class="label">Activities</th><th>TERM I</th><th>TERM II</th></tr>
//     ${rows}
//   </table>`;
// }

// const SIGN_TEACHER_SVG = `<svg class="sign-img" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
//   <path d="M6,36 C14,14 20,44 28,26 C33,15 38,34 44,24 C50,14 54,32 62,22 C70,12 74,30 84,20 C92,12 98,26 108,18 C115,12 120,24 130,16 C136,11 140,20 150,14"
//     stroke="#1a2b6d" stroke-width="2" fill="none" stroke-linecap="round"/>
//   <path d="M10,40 C40,44 90,44 145,38" stroke="#1a2b6d" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.55"/>
// </svg>`;

// const SIGN_PRINCIPAL_SVG = `<svg class="sign-img" viewBox="0 0 160 50" xmlns="http://www.w3.org/2000/svg">
//   <path d="M8,30 C12,12 22,12 26,28 C29,38 33,20 38,14 C42,9 46,30 52,32 C58,34 60,16 66,14 C72,12 74,28 80,30 C90,34 96,14 104,16 C112,18 110,32 118,30 C128,27 132,14 142,20 C148,24 146,32 152,28"
//     stroke="#5a1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
// </svg>`;

// function reportCardHtml(student) {
//   const cls = escapeHtml(student.Class || "");
//   const session = escapeHtml(student.Session || "");
//   const subjectRows = SUBJECTS.map((s) => subjectRow(student, s)).join("");

//   return `
//   <section class="sheet">
//     <div class="rc-header">
//       <img class="logo-board" src="assets/logo-board.png" alt="Board logo" />
//       <div class="titles">
//         <p class="school-name">P.S.M WORLD SCHOOL</p>
//         <p class="report-title">PERFORMANCE REPORT</p>
//         <p class="session-line">ACADEMIC SESSION : ${session}</p>
//         <p class="class-line">CLASS : ${cls}</p>
//       </div>
//       <div class="right-col">
//         <img class="logo-school" src="assets/logo-school.png" alt="School logo" />
       
//       </div>
//     </div>

//     <div class="rc-body">
//     <div class="rc-body-box">
//     <div class="rc-info">
//       <div class="rc-info-row">
//         <div class="field"><span class="lbl">Name of student</span><span class="val">${escapeHtml(student.Name)}</span></div>
//         <div class="field"><span class="lbl">Admission No.</span><span class="val">${escapeHtml(student.AdmissionNo)}</span></div>
//       </div>
//       <div class="rc-info-row">
//         <div class="field"><span class="lbl">Father's Name</span><span class="val">${escapeHtml(student.FatherName)}</span></div>
//         <div class="field"><span class="lbl">Date of Birth</span><span class="val">${escapeHtml(student.DOB)}</span></div>
//       </div>
//       <div class="rc-info-row">
//         <div class="field"><span class="lbl">Mother's Name</span><span class="val">${escapeHtml(student.MotherName)}</span></div>
//         <div class="field"><span class="lbl">Phone No.</span><span class="val">${escapeHtml(student.PhoneNo)}</span></div>
//       </div>
//       <div class="rc-info-row address">
//         <div class="field"><span class="lbl">Address</span><span class="val">${escapeHtml(student.Address)}</span></div>
//       </div>
//       <div class="rc-info-row">
//         <div class="field"><span class="lbl">Height</span><span class="val">${escapeHtml(student.Height)}</span></div>
//         <div class="field"><span class="lbl">Weight</span><span class="val">${escapeHtml(student.Weight)}</span></div>
//         <div class="field"><span class="lbl">Blood Group</span><span class="val">${escapeHtml(student.BloodGroup)}</span></div>
//       </div>
//       <div class="rc-info-row">
//         <div class="field"><span class="lbl">Vision</span><span class="val">${escapeHtml(student.Vision)}</span></div>
//         <div class="field"><span class="lbl">Teeth</span><span class="val">${escapeHtml(student.Teeth)}</span></div>
//         <div class="field"><span class="lbl">Oral Hygiene</span><span class="val">${escapeHtml(student.OralHygiene)}</span></div>
//       </div>
//       </div>
//        <div class="rc-photo-box">Student<br/>Photo</div>
//     </div>
// <div>
//     <p class="rc-section-title">A. SCHOLASTIC AREA</p>
//     <table class="rc-table">
//       <thead>
//         <tr>
//           <th>SUBJECTS</th><th>P1<br>(80)</th><th>A<br>(5)</th><th>P2<br>(80)</th><th>B<br>(5)</th>
//           <th>C<br>Note book<br>(5)</th><th>D<br>Sub Enr<br>(5)</th><th>A+B+C+D<br>(20)</th>
//           <th>Annual<br>Exam<br>(80)</th><th>Total<br>(20+80)</th><th>Grade</th>
//         </tr>
//       </thead>
//       <tbody>${subjectRows}</tbody>
//     </table>
// </div>
//     <div class="rc-two-col">
//       <div>
//         <p class="rc-section-title">B. CO-SCHOLASTIC ACTIVITIES</p>
//         ${coScholasticTable(student)}
//       </div>
//       <div>
//         <p class="rc-section-title">HEALTH &amp; PHYSICAL EDUCATION</p>
//         ${healthTable(student)}
//         <div class="rc-band">ATTENDANCE</div>
//         <table class="rc-attendance">
//           <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Attendance_T1)}</td></tr>
//           <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Attendance_T2)}</td></tr>
//         </table>
//       </div>
//     </div>

//     <div class="rc-band">TEACHER'S REMARK</div>
//     <table class="rc-remark">
//       <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Remark_T1)}</td></tr>
//       <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Remark_T2)}</td></tr>
//     </table>
//     </div>

//     <div class="rc-footer">
//       <div class="rc-signatures">
//         <div class="sign-block">
//           ${SIGN_TEACHER_SVG}
//           <span class="sign-line">Class Teacher Sign.</span>
//         </div>
//         <div class="sign-block">
//           ${SIGN_PRINCIPAL_SVG}
//           <span class="sign-line">Principal Sign.</span>
//         </div>
//         <div class="sign-block">
//           <span class="sign-img"></span>
//           <span class="sign-line">Parent Sign.</span>
//         </div>
//       </div>

//       <p class="rc-grading-title">Grading System</p>
//       <table class="rc-grading">
//         <tr><th class="row-label">Scholastic Areas</th><th colspan="8"></th></tr>
//         <tr><td class="row-label">Grade</td><td>A1</td><td>A2</td><td>B1</td><td>B2</td><td>C1</td><td>C2</td><td>D</td><td>E(FAIL)</td></tr>
//         <tr><td class="row-label">Marks Range</td><td>91-100</td><td>81-90</td><td>71-80</td><td>61-70</td><td>51-60</td><td>41-50</td><td>33-40</td><td>32 &amp; Below</td></tr>
//         <tr><th class="row-label">Co-Scholastic Areas</th><th colspan="8"></th></tr>
//         <tr><td class="row-label">Grade</td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td colspan="3"></td></tr>
//         <tr><td class="row-label">Description</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td colspan="3"></td></tr>
//       </table>
//     </div>
//   </section>`;
// }

// function renderStage() {
//   const selected = allStudents.filter((s) => selectedIds.has(s.__id));
//   if (!selected.length) {
//     stageEl.innerHTML = `<div class="empty-hint" style="text-align:center;margin-top:80px;font-size:14px;">
//       Import an Excel file and select students from the left to preview their report cards here.</div>`;
//     return;
//   }
//   stageEl.innerHTML = selected.map(reportCardHtml).join("");
// }

// renderList();
// renderStage();


/* P.S.M World School - Report Card Generator
   Fully offline: reads an .xlsx file client-side (SheetJS, vendored in lib/)
   and renders print-ready A4 report cards matching the school's template. */

const SUBJECTS = ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer"];
const SUBJECT_FIELDS = ["P1", "A", "P2", "B", "C", "D", "AnnualExam"];
const CO_SCHOLASTIC = [
  ["Courteousness", "Courteousness"],
  ["Confidence", "Confidence"],
  ["CareOfBelongings", "Care of belongings"],
  ["Neatness", "Neatness"],
  ["RegularityPunctuality", "Regularity & Punctuality"],
  ["RespectForOthersBelongings", "Respect for other Belongings"],
  ["DisciplineBehaviour", "Discipline & Behaviour"],
  ["AssignmentProjects", "Assignment / Projects"],
];
const HEALTH_PHYSICAL = [
  ["WorkEducation", "WORK EDUCATION"],
  ["ArtEducation", "ART EDUCATION (VISUAL & PERFORMING ART)"],
  ["HealthPhysicalEducation", "HEALTH & PHYSICAL EDUCATION"],
];

const GRADE_SCALE = [
  [91, 100, "A1"], [81, 90, "A2"], [71, 80, "B1"], [61, 70, "B2"],
  [51, 60, "C1"], [41, 50, "C2"], [33, 40, "D"], [0, 32, "E(FAIL)"],
];

function gradeFor(total) {
  if (total === "" || total === null || isNaN(total)) return "";
  const t = Number(total);
  for (const [lo, hi, g] of GRADE_SCALE) if (t >= lo && t <= hi) return g;
  return "";
}

function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

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
      selectedIds = new Set(allStudents.map((s) => s.__id));
      setStatus(`Loaded ${allStudents.length} student${allStudents.length > 1 ? "s" : ""} from ${file.name}`, true);
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
/* If the box in the sidebar is filled in, it replaces the per-student
   "Session" column on every card. Leave it blank to use each row's
   own value from the spreadsheet instead. */

sessionInput.addEventListener("input", renderStage);

/* ---------------- Sidebar list ---------------- */

document.querySelectorAll(".class-filter button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".class-filter button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    classFilter = btn.dataset.cls;
    renderList();
  });
});

searchBox.addEventListener("input", renderList);

function visibleStudents() {
  const q = searchBox.value.trim().toLowerCase();
  return allStudents.filter((s) => {
    const cls = String(s.Class || "").trim().toUpperCase();
    if (classFilter !== "ALL" && cls !== classFilter) return false;
    if (!q) return true;
    return String(s.Name || "").toLowerCase().includes(q) ||
           String(s.AdmissionNo || "").toLowerCase().includes(q);
  });
}

function renderList() {
  const list = visibleStudents();
  studentListEl.innerHTML = "";
  emptyHint.style.display = allStudents.length ? "none" : "block";
  countBadge.textContent = `${list.length} / ${allStudents.length}`;

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

  const anySelected = allStudents.some((s) => selectedIds.has(s.__id));
  printBtn.disabled = !anySelected;
  printAllBtn.disabled = allStudents.length === 0;
}

selectAllBtn.addEventListener("click", () => {
  visibleStudents().forEach((s) => selectedIds.add(s.__id));
  renderList();
  renderStage();
});
clearBtn.addEventListener("click", () => {
  selectedIds.clear();
  renderList();
  renderStage();
});

printBtn.addEventListener("click", () => window.print());
printAllBtn.addEventListener("click", () => {
  selectedIds = new Set(allStudents.map((s) => s.__id));
  renderList();
  renderStage();
  setTimeout(() => window.print(), 200);
});

/* ---------------- Report card rendering ---------------- */

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function subjectRow(student, subj) {
  const key = subj.replace(" ", "");
  const vals = {};
  SUBJECT_FIELDS.forEach((f) => (vals[f] = student[`${key}_${f}`]));
  const abcdSum = num(vals.A) + num(vals.B) + num(vals.C) + num(vals.D);
  const total = abcdSum + num(vals.AnnualExam);
  const grade = gradeFor(total);
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

function coScholasticTable(student) {
  const rows = CO_SCHOLASTIC.map(([key, label]) => `
    <tr><td class="label">${escapeHtml(label)}</td>
      <td class="val">${escapeHtml(student[`${key}_T1`])}</td>
      <td class="val">${escapeHtml(student[`${key}_T2`])}</td></tr>`).join("");
  return `<table class="rc-mini">
    <tr><th class="label">ACTIVITIES</th><th>TERM I</th><th>TERM II</th></tr>
    ${rows}
  </table>`;
}

function healthTable(student) {
  const rows = HEALTH_PHYSICAL.map(([key, label]) => `
    <tr><td class="label">${escapeHtml(label)}</td>
      <td class="val">${escapeHtml(student[`${key}_T1`])}</td>
      <td class="val">${escapeHtml(student[`${key}_T2`])}</td></tr>`).join("");
  return `<table class="rc-mini">
    <tr><th class="label">Activities</th><th>TERM I</th><th>TERM II</th></tr>
    ${rows}
  </table>`;
}

/* Real signature images. Drop scanned/cropped signature files at these
   paths (transparent PNG works best) and they'll appear on every card.
   If a file is missing, the slot just stays blank instead of erroring -
   the "Sign." caption and underline still print either way. */
const SIGN_TEACHER_SRC = "assets/sign-teacher.png";
const SIGN_PRINCIPAL_SRC = "assets/sign-principal.png";

function signatureImg(src, alt) {
  return `<img class="sign-img" src="${src}" alt="${alt}" onerror="this.style.visibility='hidden'" />`;
}

function reportCardHtml(student) {
  const cls = escapeHtml(student.Class || "");
  const session = escapeHtml((sessionInput.value.trim() || student.Session || ""));
  const subjectRows = SUBJECTS.map((s) => subjectRow(student, s)).join("");

  return `
  <section class="sheet">
    <div class="rc-header">
      <img class="logo-board" src="assets/logo-board.jpg" alt="Board logo" />
      <div class="titles">
        <p class="school-name">P.S.M WORLD SCHOOL</p>
        <p class="report-title">PERFORMANCE REPORT</p>
        <p class="session-line">ACADEMIC SESSION : ${session}</p>
        <p class="class-line">CLASS : ${cls}</p>
      </div>
      <div class="right-col">
        <img class="logo-school" src="assets/logo-school.png" alt="School logo" />
       
      </div>
    </div>

    <div class="rc-body">
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
    </div>
<div>
    <p class="rc-section-title">A. SCHOLASTIC AREA</p>
    <table class="rc-table">
      <thead>
        <tr>
          <th>SUBJECTS</th><th>P1<br>(80)</th><th>A<br>(5)</th><th>P2<br>(80)</th><th>B<br>(5)</th>
          <th>C<br>Note book<br>(5)</th><th>D<br>Sub Enr<br>(5)</th><th>A+B+C+D<br>(20)</th>
          <th>Annual<br>Exam<br>(80)</th><th>Total<br>(20+80)</th><th>Grade</th>
        </tr>
      </thead>
      <tbody>${subjectRows}</tbody>
    </table>
</div>
    <div class="rc-two-col">
      <div>
        <p class="rc-section-title">B. CO-SCHOLASTIC ACTIVITIES</p>
        ${coScholasticTable(student)}
      </div>
      <div>
        <p class="rc-section-title">HEALTH &amp; PHYSICAL EDUCATION</p>
        ${healthTable(student)}
        <div class="rc-band">ATTENDANCE</div>
        <table class="rc-attendance">
          <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Attendance_T1)}</td></tr>
          <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Attendance_T2)}</td></tr>
        </table>
      </div>
    </div>
    <div>
      <div class="rc-band">TEACHER'S REMARK</div>
      <table class="rc-remark">
        <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Remark_T1)}</td></tr>
        <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Remark_T2)}</td></tr>
      </table>
      </div>
    </div>

    <div class="rc-footer">
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
      </div>

      <p class="rc-grading-title">Grading System</p>
      <table class="rc-grading">
        <tr><th class="row-label">Scholastic Areas</th><th colspan="8"></th></tr>
        <tr><td class="row-label">Grade</td><td>A1</td><td>A2</td><td>B1</td><td>B2</td><td>C1</td><td>C2</td><td>D</td><td>E(FAIL)</td></tr>
        <tr><td class="row-label">Marks Range</td><td>91-100</td><td>81-90</td><td>71-80</td><td>61-70</td><td>51-60</td><td>41-50</td><td>33-40</td><td>32 &amp; Below</td></tr>
        <tr><th class="row-label">Co-Scholastic Areas</th><th colspan="8"></th></tr>
        <tr><td class="row-label">Grade</td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td colspan="3"></td></tr>
        <tr><td class="row-label">Description</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td colspan="3"></td></tr>
      </table>
    </div>
  </section>`;
}

function renderStage() {
  const selected = allStudents.filter((s) => selectedIds.has(s.__id));
  if (!selected.length) {
    stageEl.innerHTML = `<div class="empty-hint" style="text-align:center;margin-top:80px;font-size:14px;">
      Import an Excel file and select students from the left to preview their report cards here.</div>`;
    return;
  }
  stageEl.innerHTML = selected.map(reportCardHtml).join("");
}

renderList();
renderStage();