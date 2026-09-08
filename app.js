
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

function hasValue(v) {
  return v !== "" && v !== null && v !== undefined && !isNaN(v);
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}


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
/* IX-X only: "Environmental Education / Individual in Society" goes on the
   IX-X card only, not on III-VIII, so it's added on top of the shared list
   rather than being part of it. */
const WORK_ART_HEALTH_IXX = [...WORK_ART_HEALTH, ["EnvironmentalEducationIndividualSociety", "Environmental Education / Individual in Society"]];
/* ---------------- Play & Nur–II: grade-entry data (no marks/totals) ---------------- */

const PLAY_SUBJECTS = [
  ["OralEnglish", "Oral English"], ["EnglishRhymes", "English Rhymes"], ["WrittenEnglish", "Written English"],
  ["OralHindi", "Oral Hindi"], ["HindiRhymes", "Hindi Rhymes"], ["WrittenHindi", "Written Hindi"],
  ["OralMaths", "Oral Maths"], ["MathsActivity", "Maths Activity"], ["WrittenMaths", "Written Maths"],
  ["Drawing", "Drawing"], ["LanguageDevelopment", "Language Development"],
];
const PLAY_COSCHOLASTIC = [
  ["Sports", "Sports"], ["StagePerformance", "Stage Performance"],
  ["Recitation", "Recitation"], ["DanceMusic", "Dance & Music"],
];
const PLAY_TEACHER_EVAL = [
  ["Curiosity", "Curiosity"], ["Conduct", "Conduct"], ["Cooperation", "Co-operation"],
  ["CourtesyPoliteness", "Courtesy & politeness"], ["Adjustment", "Adjustment"], ["Obedience", "Obedience"],
  ["Expression", "Expression"], ["Neatness", "Neatness"], ["Activity", "Activity"],
];

/* English/Hindi/Maths groups are identical on both the Nur-KG and the I-II
   cards. Reading Skills and Pronunciation/Fluency used to be two separate
   rows - the principal asked for them combined into a single row with a
   slash, so there's now one "ReadingPronunciation" row instead of two. */
const NUR_SCHOLASTIC_BASE = [
  {
    subject: "ENGLISH", key: "Eng", items: [
      ["ReadingPronunciation", "Reading Skills / Pronunciation & Fluency"],
      ["WritingSkillHandwritingDictation", "Writing Skill Handwriting/Dictation"],
      ["PoemRecitationLiterature", "Poem Recitation/ Literature & speaking skills"],
      ["WritingEvaluation", "Writing Evaluation"], ["Assignments", "Assignments"],
    ]
  },
  {
    subject: "HINDI", key: "Hin", items: [
      ["ReadingPronunciation", "Reading Skills / Pronunciation & Fluency"],
      ["WritingSkillHandwritingDictation", "Writing Skill Handwriting/Dictation"],
      ["PoemRecitationLiterature", "Poem Recitation/ Literature & speaking skills"],
      ["WritingEvaluation", "Writing Evaluation"], ["Assignments", "Assignments"],
    ]
  },
  {
    subject: "MATHS", key: "Ma", items: [
      ["RecognitionNumbersMentalAbility", "Recognition of Numbers/Mental Ability"],
      ["OralCountingTablesReasoning", "Oral Counting/Tables/Reasoning skills"],
      ["PreNumberConceptsApplication", "Pre Number Concepts/ application"],
      ["ConceptRelatedExercise", "Concept Related Exercise"],
      ["WrittenEvaluation", "Written Evaluation"], ["Assignments", "Assignments"],
    ]
  },
];
/* Class I-II keeps E.V.S exactly as before. */
const EVS_GROUP = {
  subject: "E.V.S", key: "Evs", items: [
    ["EnvironmentSensitivity", "Environment Sensitivity"], ["GroupDiscussions", "Group Discussions"],
    ["ConceptualUnderstanding", "Conceptual Understanding"],
    ["Assignments", "Assignments"], ["WrittenEvaluation", "Written Evaluation"],
  ]
};
/* Nur-KG replaces E.V.S with DRAWING and its three sub-sections. */
const DRAWING_GROUP = {
  subject: "DRAWING", key: "Draw", items: [
    ["EnjoysColouringDrawing", "Enjoys Colouring & Drawing"],
    ["ArtCraft", "Art & Craft"],
    ["Origami", "Origami"],
  ]
};
const NUR_SCHOLASTIC_NUR_KG = [...NUR_SCHOLASTIC_BASE, DRAWING_GROUP];
const NUR_SCHOLASTIC_FIRST_SECOND = [...NUR_SCHOLASTIC_BASE, EVS_GROUP];

const NUR_COSCHOLASTIC = [
  ["Computer", "Computer"], ["ArtCraft", "Art & Craft"], ["GeneralKnowledge", "General Knowledge"],
  ["MoralValues", "Moral Values"], ["MusicDance", "Music & Dance"], ["Sports", "Sports"],
];
const NUR_PERSONAL_TRAITS = [
  ["Discipline", "Discipline"], ["Confidence", "Confidence"],
  ["RegularityPunctuality", "Regularity & Punctuality"], ["AcceptResponsibility", "Accept Responsibility"],
  ["CleanlinessHygiene", "Cleanliness & Hygiene"], ["RegularityHW", "Regularity in doing H.W"],
  ["GreetingOther", "Greeting Other"], ["SharesWithOther", "Shares with Other"],
  ["FollowInstructions", "Follow Instructions"], ["ParticipateActivities", "Participate in Activities"],
];

/* Generic N-column grade table (replaces the fixed 2-col assumption of
   miniTableForStudent for these two new formats; miniTableForStudent is
   untouched so IX-X and III-VIII keep working exactly as before). */
function evalTable(student, items, headerLabel, suffixes, colLabels, paddingClass = "") {
  const headCells = colLabels.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
  const rows = items.map(([key, label]) => {
    const cells = suffixes.map((sfx) => `<td class="val ${paddingClass}">${escapeHtml(student[`${key}_${sfx}`])}</td>`).join("");
    return `<tr><td class="label ${paddingClass}">${escapeHtml(label)}</td>${cells}</tr>`;
  }).join("");
  return `<table class="rc-mini">
    <tr><th class="label ${paddingClass}">${escapeHtml(headerLabel)}</th>${headCells}</tr>
    ${rows}
  </table>`;
}

/* Student-info block without Phone/Vision/Teeth/Oral Hygiene, with a single
   combined Height/Weight field — matches the Play and Nur–II cards exactly.
   buildStudentInfo() (the full version) is untouched for IX-X / III-VIII. */
function buildStudentInfoBasic(student, showPan = true) {
  return `
    <div class="rc-body-box">
    <div class="rc-info">
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Name of student</span><span class="val">${escapeHtml(student.Name)}</span></div>
        <div class="field"><span class="lbl">Admission No.</span><span class="val">${escapeHtml(student.AdmissionNo)}</span></div>
      </div>
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Father's Name</span><span class="val">${escapeHtml(student.FatherName)}</span></div>
        <div class="field"><span class="lbl">Mother's Name</span><span class="val">${escapeHtml(student.MotherName)}</span></div>
      </div>
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Date of Birth</span><span class="val">${escapeHtml(student.DOB)}</span></div>
        <div class="field"><span class="lbl">Blood Group</span><span class="val">${escapeHtml(student.BloodGroup)}</span></div>
      </div>
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Phone No.</span><span class="val">${escapeHtml(student.PhoneNo)}</span></div>
        ${showPan ? `<div class="field"><span class="lbl">PAN No.</span><span class="val">${escapeHtml(student.PANNo)}</span></div>` : `<div class="field"><span class="lbl">Height(cm)/Weight(kg)</span><span class="val">${escapeHtml(student.HeightWeight)}</span></div>`}
      </div>
      ${showPan ? `
      <div class="rc-info-row">
        <div class="field"><span class="lbl">Height(cm)/Weight(kg)</span><span class="val">${escapeHtml(student.HeightWeight)}</span></div>
      </div>` : ''}
      <div class="rc-info-row address">
        <div class="field"><span class="lbl">Address</span><span class="val">${escapeHtml(student.Address)}</span></div>
      </div>
    </div>
    <div class="rc-photo-box">Student<br/>Photo</div>
    </div>`;
}

/* Grading key shared by Play and Nur–II (identical on both docs). */
function gradingTableGrades() {
  return `
    <p class="rc-grading-title">Grading System</p>
    <table class="rc-grading">
      <tr><th class="row-label">Scholastic</th><th colspan="4"></th></tr>
      <tr><td class="row-label">Grade</td><td>A</td><td>B</td><td>C</td><td>D</td></tr>
      <tr><td class="row-label">Marks</td><td>81-100</td><td>61-80</td><td>41-60</td><td>33-40</td></tr>
      <tr><th class="row-label">Co-Scholastic</th><th colspan="4"></th></tr>
      <tr><td class="row-label">Grade</td><td>A</td><td>B</td><td>C</td><td></td></tr>
      <tr><td class="row-label">Description</td><td>Appreciable</td><td>Satisfactory</td><td>Fair</td><td></td></tr>
    </table>`;
}

// ADD (right after the existing gradingTableGrades() function)
function gradingTableGradesSplit() {
  return `
    <p class="rc-grading-title">Grading System</p>
    <div class="rc-two-col">
      <div>
        <table class="rc-grading">
          <tr><th class="row-label">Scholastic</th><th colspan="4"></th></tr>
          <tr><td class="row-label">Grade</td><td>A</td><td>B</td><td>C</td><td>D</td></tr>
          <tr><td class="row-label">Marks</td><td>81-100</td><td>61-80</td><td>41-60</td><td>33-40</td></tr>
        </table>
      </div>
      <div>
        <table class="rc-grading">
          <tr><th class="row-label">Co-Scholastic</th><th colspan="3"></th></tr>
          <tr><td class="row-label">Grade</td><td>A</td><td>B</td><td>C</td></tr>
          <tr><td class="row-label">Description</td><td>Appreciable</td><td>Satisfactory</td><td>Fair</td></tr>
        </table>
      </div>
    </div>`;
}
function miniTable(items, headerLabel) {
  const rows = items.map(([key, label]) => `
    <tr><td class="label">${escapeHtml(label)}</td>
      <td class="val">${escapeHtml("")}</td>
      <td class="val">${escapeHtml("")}</td></tr>`).join("");
  return { rows, headerLabel };
}

function miniTableForStudent(student, items, headerLabel, term1Suffix, term2Suffix, paddingClass = "") {
  const rows = items.map(([key, label]) => `
    <tr><td class="label ${paddingClass}">${escapeHtml(label)}</td>
      <td class="val ${paddingClass}">${escapeHtml(student[`${key}_${term1Suffix}`])}</td>
      <td class="val ${paddingClass}">${escapeHtml(student[`${key}_${term2Suffix}`])}</td></tr>`).join("");
  return `<table class="rc-mini">
    <tr><th class="label ${paddingClass}">${headerLabel}</th><th class=" ${paddingClass}">TERM I</th><th class=" ${paddingClass}" >TERM II</th></tr>
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
        <div class="field"><span class="lbl">PAN No.</span><span class="val">${escapeHtml(student.PANNo)}</span></div>
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
const SIGN_PRINCIPAL_SRC = "assets/principal.png";

function signatureImg(src, alt) {
  return `<img class="sign-img" src="${src}" alt="${alt}" onerror="this.style.visibility='hidden'" />`;
}

// function buildSignatures() {
//   return `
//       <div class="rc-signatures">
//         <div class="sign-block">
//           ${signatureImg(SIGN_TEACHER_SRC, "Class Teacher signature")}
//           <span class="sign-line">Class Teacher Sign.</span>
//         </div>
//         <div class="sign-block">
//           ${signatureImg(SIGN_PRINCIPAL_SRC, "Principal signature")}
//           <span class="sign-line">Principal Sign.</span>
//         </div>
//         <div class="sign-block">
//           <span class="sign-img"></span>
//           <span class="sign-line">Parent Sign.</span>
//         </div>
//       </div>`;
// }

function buildSignatures() {
  const teacherSrc = teacherSignDataUrl || SIGN_TEACHER_SRC;
  return `
      <div class="rc-signatures">
        <div class="sign-block">
          ${signatureImg(teacherSrc, "Class Teacher signature")}
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

const SUBJECTS_IXX = ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer", "Sanskrit", "Vocational Education"];
const SUBJECT_FIELDS_IXX = ["P1", "A", "P2", "B", "C", "D", "AnnualExam"];

function subjectRowIXX(student, subj) {
  const key = subj.replace(" ", "");
  const vals = {};
  SUBJECT_FIELDS_IXX.forEach((f) => (vals[f] = student[`${key}_${f}`]));
  const abcdSum = num(vals.A) + num(vals.B) + num(vals.C) + num(vals.D);
  const computedTotal = abcdSum + num(vals.AnnualExam);
  // If the sheet already supplies a Total for this subject, trust it over
  // the computed figure - otherwise fall back to calculating it ourselves.
  const totalOverride = student[`${key}_Total`];
  const total = hasValue(totalOverride) ? num(totalOverride) : computedTotal;
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

function scholasticTableIXX(student, customClass = "") {
  const rows = SUBJECTS_IXX.map((s) => subjectRowIXX(student, s)).join("");
  return `<table class="rc-table ${customClass}">
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
      ${scholasticTableIXX(student, customClass = "scholasticTableIXX")}
    </div>
    <div class="rc-two-col">
      <div>
        <p class="rc-section-title">B. CO-SCHOLASTIC ACTIVITIES</p>
        ${miniTableForStudent(student, PERSONAL_TRAITS, "ACTIVITIES", "T1", "T2", paddingClass = "py-5")}
      </div>
      <div>
        <p class="rc-section-title">HEALTH &amp; PHYSICAL EDUCATION</p>
        ${miniTableForStudent(student, WORK_ART_HEALTH_IXX, "Activities", "T1", "T2", paddingClass = "py-5")}
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
      ${buildSignatures()}
      ${gradingTableIXX()}
    </div>
  </section>`;
}

/* ---------------- Class III - VIII template ---------------- */

const SUBJECTS_III_VIII = ["English", "Hindi", "Mathematics", "Science", "Social Science", "Computer", "General Knowledge", "Moral Education", "Sanskrit", "Art & Craft"];

function subjectRowIIIVIII(student, subj) {
  const key = subj.replace(/[^A-Za-z]/g, "");
  const f = (name) => student[`${key}_${name}`];
  const ut1 = num(f("UT1")), ut2 = num(f("UT2")), nbse1 = num(f("NBSE1")), midTerm = num(f("MidTerm"));
  const ut3 = num(f("UT3")), ut4 = num(f("UT4")), nbse2 = num(f("NBSE2")), annualExam = num(f("AnnualExam"));

  // Attendance is worth 5 marks per term (same as the Note book / Subject
  // Enrichment column) and applies the same way to every subject row, since
  // it's a student-level figure rather than a per-subject one. It's read
  // from a dedicated *marks* field (0-5) rather than the Attendance_T1/T2
  // field, which keeps showing the raw attendance record (days/percentage)
  // in its own column without that record itself being added into totals.
  const attMarks1 = num(student.AttendanceMarks_T1);
  const attMarks2 = num(student.AttendanceMarks_T2);

  const computedTotalT1 = ut1 + ut2 + nbse1 + attMarks1 + midTerm;
  const computedTotalT2 = ut3 + ut4 + nbse2 + attMarks2 + annualExam;
  const computedGrandTotal = computedTotalT1 + computedTotalT2;

  // Optional per-subject Total1 / Total2 / GrandTotal columns: if the
  // uploaded sheet already fills these in, use them as-is. If they're left
  // blank, calculate them from the component marks as before (now correctly
  // including attendance).
  const totalT1 = hasValue(f("Total1")) ? num(f("Total1")) : computedTotalT1;
  const totalT2 = hasValue(f("Total2")) ? num(f("Total2")) : computedTotalT2;
  const grandTotal = hasValue(f("GrandTotal")) ? num(f("GrandTotal")) : totalT1 + totalT2;

  const grade = gradeFor(grandTotal, GRADE_SCALE_III_VIII);
  return `<tr>
    <td class="subj-name">${escapeHtml(subj)}</td>
    <td>${escapeHtml(f("UT1"))}</td>
    <td>${escapeHtml(f("UT2"))}</td>
    <td>${escapeHtml(f("NBSE1"))}</td>
    <td>${escapeHtml(student.AttendanceMarks_T1)}</td>
    <td>${escapeHtml(f("MidTerm"))}</td>
    <td>${totalT1 || ""}</td>
    <td>${escapeHtml(f("UT3"))}</td>
    <td>${escapeHtml(f("UT4"))}</td>
    <td>${escapeHtml(f("NBSE2"))}</td>
    <td>${escapeHtml(student.AttendanceMarks_T2)}</td>
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
        <th colspan="2" class="overall">CUMULATIVE</th>
      </tr>
      <tr class="col-row">
        <th>Unit<br>Test 1</th><th>Unit<br>Test 2</th><th>Note book /<br>Subject Enrich.</th><th>Attendance</th><th>Mid<br>Term</th><th>Total<br>Marks</th>
        <th>Unit<br>Test 3</th><th>Unit<br>Test 4</th><th>Note book /<br>Subject Enrich.</th><th>Attendance</th><th>Annual<br>Exam</th><th>Total<br>Marks</th>
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
    <div class="">
    <div class="rc-band">TEACHER'S REMARK</div>
    <table class="rc-remark">
      <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Remark_T1)}</td></tr>
      <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Remark_T2)}</td></tr>
    </table>
    </div>
    </div>
    <div class="rc-footer">
      ${buildSignatures()}
      ${gradingTableIIIVIII()}
    </div>
  </section>`;
}

/* ---------------- Play template ---------------- */

function scholasticTablePlay(student) {
  const rows = PLAY_SUBJECTS.map(([k, label]) => `<tr>
    <td class="subj-name">${escapeHtml(label)}</td>
    <td>${escapeHtml(student[`${k}_T1`])}</td>
    <td>${escapeHtml(student[`${k}_T2`])}</td>
  </tr>`).join("");
  return `<table class="rc-table">
    <thead>
      <tr><th rowspan="2">SUBJECTS</th><th colspan="2">TERMINAL EXAMINATION</th></tr>
      <tr><th>TERM I</th><th>TERM II</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function reportCardHtmlPlay(student, session) {
  const cls = escapeHtml(student.Class || "PLAY");
  return `
  <section class="sheet">
    ${buildHeader(student, cls, session)}
    <div class="rc-body">
    ${buildStudentInfoBasic(student, false)}
    <div>
      <p class="rc-section-title">A. SCHOLASTIC AREA</p>
      ${scholasticTablePlay(student)}
    </div>
    <div class="rc-two-col">
      <div>
        <p class="rc-section-title">B. ACTIVITIES</p>
        ${evalTable(student, PLAY_COSCHOLASTIC, "ACTIVITIES", ["T1", "T2"], ["TERM I", "TERM II"])}
        <div class="rc-band">ATTENDANCE</div>
        <table class="rc-attendance">
          <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Attendance_T1)}</td></tr>
          <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Attendance_T2)}</td></tr>
        </table>
      </div>
      <div>
        <p class="rc-section-title">C. CLASS TEACHER'S EVALUATION</p>
        ${evalTable(student, PLAY_TEACHER_EVAL, "ACTIVITIES", ["T1", "T2"], ["TERM I", "TERM II"])}
      </div>
    </div>
    <div class="">
    <div class="rc-band">TEACHER'S REMARK</div>
    <table class="rc-remark">
      <tr><td class="term-label">TERM I</td><td>${escapeHtml(student.Remark_T1)}</td></tr>
      <tr><td class="term-label">TERM II</td><td>${escapeHtml(student.Remark_T2)}</td></tr>
    </table>
    </div>
    </div>
    <div class="rc-footer">
      ${buildSignatures()}
      ${gradingTableGrades()}
    </div>
  </section>`;
}

/* ---------------- Nur-KG and Class I-II templates ---------------- */
/* Both share this exact layout - only the scholastic group list differs
   (DRAWING vs E.V.S. as the 4th subject), so one function renders both. */

function scholasticTableNur(student, scholasticGroups) {
  const rows = scholasticGroups.flatMap((grp) =>
    grp.items.map(([subKey, subLabel], idx) => {
      const subjCell = idx === 0
        ? `<td class="subj-name" rowspan="${grp.items.length}">${escapeHtml(grp.subject)}</td>`
        : "";
      return `<tr>${subjCell}
        <td class="subj-sub">${escapeHtml(subLabel)}</td>
        <td>${escapeHtml(student[`${grp.key}_${subKey}_E1`])}</td>
        <td>${escapeHtml(student[`${grp.key}_${subKey}_E2`])}</td>
        <td>${escapeHtml(student[`${grp.key}_${subKey}_E3`])}</td>
      </tr>`;
    })
  ).join("");
  return `<table class="rc-table rc-table-nur">
    <thead>
      <tr><th colspan="2">SUBJECTS</th><th>EVALUATION I</th><th>EVALUATION II</th><th>EVALUATION III</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function reportCardHtmlNurBase(student, session, scholasticGroups) {
  const cls = escapeHtml(student.Class || "");
  return `
  <section class="sheet">
    ${buildHeader(student, cls, session)}
    <div class="rc-body">
    ${buildStudentInfoBasic(student)}
    <div>
      <p class="rc-section-title">A. SCHOLASTIC AREA</p>
      ${scholasticTableNur(student, scholasticGroups)}
    </div>
    <div class="rc-two-col">
      <div>
        <p class="rc-section-title">B. CO-SCHOLASTIC AREA</p>
        ${evalTable(student, NUR_COSCHOLASTIC, "ACTIVITIES", ["E1", "E2", "E3"], ["EVALUATION I", "EVALUATION II", "EVALUATION III"], paddingClass = "py-1")}
         <div class="rc-band">ATTENDANCE</div>
        <table class="rc-attendance">
          <tr><td class="term-label py-3">EVALUATION I</td><td class="py-3">${escapeHtml(student.Attendance_E1)}</td></tr>
          <tr><td class="term-label py-3">EVALUATION II</td><td class="py-3">${escapeHtml(student.Attendance_E2)}</td></tr>
          <tr><td class="term-label py-3">EVALUATION III</td><td class="py-3">${escapeHtml(student.Attendance_E3)}</td></tr>
        </table>
      </div>
      <div>
        <p class="rc-section-title">C. PERSONAL &amp; SOCIAL TRAITS</p>
        ${evalTable(student, NUR_PERSONAL_TRAITS, "ACTIVITIES", ["E1", "E2", "E3"], ["EVALUATION I", "EVALUATION II", "EVALUATION III"], paddingClass = "py-1")}
       
      </div>
    </div>
    <div class="">
    <div class="rc-band">TEACHER'S REMARK</div>
    <table class="rc-remark">
      <tr><td class="term-label py-2">EVALUATION I</td><td class="py-2">${escapeHtml(student.Remark_E1)}</td></tr>
      <tr><td class="term-label py-2">EVALUATION II</td><td class="py-2">${escapeHtml(student.Remark_E2)}</td></tr>
      <tr><td class="term-label py-2">EVALUATION III</td><td class="py-2">${escapeHtml(student.Remark_E3)}</td></tr>
    </table>
    </div>
    </div>
    <div class="rc-footer">
      ${buildSignatures()}
      ${gradingTableGradesSplit()}
    </div>
  </section>`;
}

function reportCardHtmlNurKG(student, session) {
  return reportCardHtmlNurBase(student, session, NUR_SCHOLASTIC_NUR_KG);
}
function reportCardHtmlFirstSecond(student, session) {
  return reportCardHtmlNurBase(student, session, NUR_SCHOLASTIC_FIRST_SECOND);
}

/* ---------------- Template registry ---------------- */

// const TEMPLATES = {
//   ixx: {
//     label: "Class IX \u2013 X",
//     classes: ["IX", "X"],
//     render: reportCardHtmlIXX,
//   },
//   iii_viii: {
//     label: "Class III \u2013 VIII",
//     classes: ["III", "IV", "V", "VI", "VII", "VIII"],
//     render: reportCardHtmlIIIVIII,
//   },
// };
const TEMPLATES = {
  play: { label: "Play", classes: ["PLAY"], render: reportCardHtmlPlay },
  nur_kg: { label: "Nur \u2013 KG", classes: ["NUR", "LKG", "UKG"], render: reportCardHtmlNurKG },
  first_second: { label: "Class I \u2013 II", classes: ["I", "II"], render: reportCardHtmlFirstSecond },
  iii_viii: { label: "Class III \u2013 VIII", classes: ["III", "IV", "V", "VI", "VII", "VIII"], render: reportCardHtmlIIIVIII },
  ixx: { label: "Class IX \u2013 X", classes: ["IX", "X"], render: reportCardHtmlIXX },
};

let activeTemplate = "iii_viii";


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

printBtn.addEventListener("click", () => { setPrintTitleForSelection(); window.print() });
printAllBtn.addEventListener("click", () => {
  allStudents.filter((s) => belongsToActiveTemplate(s)).forEach((s) => selectedIds.add(s.__id));
  renderList();
  renderStage();
  setTimeout(() => { setPrintTitleForSelection(); window.print() }, 200);
});

// ADD (near printBtn/printAllBtn declarations)
const ORIGINAL_TITLE = document.title;

function setPrintTitleForSelection() {
  const selected = allStudents.filter((s) => selectedIds.has(s.__id) && belongsToActiveTemplate(s));
  const session = (sessionInput.value.trim() || selected[0]?.Session || "").replace(/[\\/:*?"<>|]/g, "-");
  const tplLabel = TEMPLATES[activeTemplate].label.replace(/[\\/:*?"<>|]/g, "-");

  let name;
  if (selected.length === 1) {
    const s = selected[0];
    const admNo = String(s.AdmissionNo || "").trim();
    name = `${s.Name || "Report Card"}${admNo ? " - " + admNo : ""}`;
  } else if (selected.length > 1) {
    name = `${tplLabel} Report Cards${session ? " - " + session : ""}`;
  } else {
    name = ORIGINAL_TITLE;
  }
  document.title = name.replace(/[\\/:*?"<>|]/g, "-").trim();
}

window.addEventListener("afterprint", () => {
  document.title = ORIGINAL_TITLE;
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



/* ---------------- Teacher signature: upload + in-browser crop ---------------- */

let teacherSignDataUrl = null;
let cropImage = null;
let cropRect = null;
let cropDragging = false;
let cropStart = null;

const teacherSignInput = document.getElementById("teacherSignInput");
const teacherSignPreviewWrap = document.getElementById("teacherSignPreviewWrap");
const teacherSignPreview = document.getElementById("teacherSignPreview");
const teacherSignRemoveBtn = document.getElementById("teacherSignRemoveBtn");
const cropModal = document.getElementById("cropModal");
const cropCanvas = document.getElementById("cropCanvas");
const cropCtx = cropCanvas.getContext("2d");
const cropCancelBtn = document.getElementById("cropCancelBtn");
const cropConfirmBtn = document.getElementById("cropConfirmBtn");

teacherSignInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => openCropModal(img);
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
  teacherSignInput.value = "";
});

function openCropModal(img) {
  cropImage = img;
  const maxW = 480, maxH = 420;
  const scale = Math.min(maxW / img.width, maxH / img.height, 1);
  cropCanvas.width = Math.round(img.width * scale);
  cropCanvas.height = Math.round(img.height * scale);
  cropRect = null;
  drawCrop();
  cropModal.style.display = "flex";
}

function drawCrop() {
  cropCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
  cropCtx.drawImage(cropImage, 0, 0, cropCanvas.width, cropCanvas.height);
  if (cropRect) {
    cropCtx.save();
    cropCtx.strokeStyle = "#1f4e79";
    cropCtx.lineWidth = 2;
    cropCtx.setLineDash([6, 4]);
    cropCtx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
    cropCtx.restore();
  }
}

function canvasPoint(e) {
  const r = cropCanvas.getBoundingClientRect();
  const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
  const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
  return { x: Math.max(0, Math.min(cropCanvas.width, cx)), y: Math.max(0, Math.min(cropCanvas.height, cy)) };
}
function cropPointerDown(e) {
  cropDragging = true;
  cropStart = canvasPoint(e);
  cropRect = { x: cropStart.x, y: cropStart.y, w: 0, h: 0 };
}
function cropPointerMove(e) {
  if (!cropDragging) return;
  const p = canvasPoint(e);
  cropRect = {
    x: Math.min(cropStart.x, p.x), y: Math.min(cropStart.y, p.y),
    w: Math.abs(p.x - cropStart.x), h: Math.abs(p.y - cropStart.y),
  };
  drawCrop();
}
function cropPointerUp() { cropDragging = false; }

cropCanvas.addEventListener("mousedown", cropPointerDown);
cropCanvas.addEventListener("mousemove", cropPointerMove);
window.addEventListener("mouseup", cropPointerUp);
cropCanvas.addEventListener("touchstart", cropPointerDown);
cropCanvas.addEventListener("touchmove", cropPointerMove);
window.addEventListener("touchend", cropPointerUp);

cropCancelBtn.addEventListener("click", () => { cropModal.style.display = "none"; });

cropConfirmBtn.addEventListener("click", () => {
  if (!cropImage) return;
  const scaleX = cropImage.width / cropCanvas.width;
  const scaleY = cropImage.height / cropCanvas.height;
  const useRect = (cropRect && cropRect.w > 4 && cropRect.h > 4)
    ? cropRect
    : { x: 0, y: 0, w: cropCanvas.width, h: cropCanvas.height };
  const outW = Math.max(1, Math.round(useRect.w * scaleX));
  const outH = Math.max(1, Math.round(useRect.h * scaleY));
  const outCanvas = document.createElement("canvas");
  outCanvas.width = outW;
  outCanvas.height = outH;
  outCanvas.getContext("2d").drawImage(
    cropImage, useRect.x * scaleX, useRect.y * scaleY, outW, outH, 0, 0, outW, outH
  );
  teacherSignDataUrl = outCanvas.toDataURL("image/png");
  teacherSignPreview.src = teacherSignDataUrl;
  teacherSignPreviewWrap.style.display = "block";
  cropModal.style.display = "none";
  renderStage();
});

teacherSignRemoveBtn.addEventListener("click", () => {
  teacherSignDataUrl = null;
  teacherSignPreviewWrap.style.display = "none";
  renderStage();
});

function detectBestTemplate(rows) {
  let best = activeTemplate, bestCount = -1;
  Object.keys(TEMPLATES).forEach((key) => {
    const classes = TEMPLATES[key].classes;
    const count = rows.filter((r) => classes.includes(String(r.Class || "").trim().toUpperCase())).length;
    if (count > bestCount) { bestCount = count; best = key; }
  });
  return { best, bestCount };
}

function activateTemplate(key) {
  activeTemplate = key;
  templateToggle.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.tpl === key));
  updateDownloadTemplateLabel();
  classFilter = "ALL";
  renderClassFilterButtons();
}

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

      const { best, bestCount } = detectBestTemplate(allStudents);
      if (bestCount === 0) {
        setStatus(`Loaded ${allStudents.length} student(s), but none match a known Class value for any group — check the "Class" column (e.g. PLAY, NUR, III, IX...).`, false);
      } else if (best !== activeTemplate) {
        activateTemplate(best);
        setStatus(`Loaded ${allStudents.length} student(s) — switched to "${TEMPLATES[best].label}" based on the Class column.`, true);
      } else {
        setStatus(`Loaded ${allStudents.length} student${allStudents.length > 1 ? "s" : ""} from ${file.name}`, true);
      }

      selectedIds = new Set(allStudents.filter((s) => belongsToActiveTemplate(s)).map((s) => s.__id));
      renderList();
      renderStage();
    } catch (err) {
      setStatus("Could not read this file: " + err.message, false);
    }
  };
  reader.readAsArrayBuffer(file);
});

templateToggle.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tpl]");
  if (!btn) return;
  activateTemplate(btn.dataset.tpl);
  selectedIds = new Set(allStudents.filter((s) => belongsToActiveTemplate(s)).map((s) => s.__id));
  renderList();
  renderStage();
});

const STUDENT_FIELDS_FULL = ["Name", "AdmissionNo", "Class", "Session", "FatherName", "MotherName", "DOB", "PhoneNo", "PANNo", "Address", "Height", "Weight", "BloodGroup", "Vision", "Teeth", "OralHygiene"];
const STUDENT_FIELDS_BASIC = ["Name", "AdmissionNo", "Class", "Session", "FatherName", "MotherName", "DOB", "BloodGroup", "PhoneNo", "PANNo", "HeightWeight", "Address"];

function templateColumns(key) {
  let cols;
  if (key === "ixx") {
    cols = [...STUDENT_FIELDS_FULL];
    SUBJECTS_IXX.forEach((s) => {
      const k = s.replace(" ", "");
      SUBJECT_FIELDS_IXX.forEach((f) => cols.push(`${k}_${f}`));
      // Optional: fill this in only if you want to override the calculated total for this subject.
      cols.push(`${k}_Total`);
    });
    PERSONAL_TRAITS.forEach(([k]) => cols.push(`${k}_T1`, `${k}_T2`));
    WORK_ART_HEALTH_IXX.forEach(([k]) => cols.push(`${k}_T1`, `${k}_T2`));
    cols.push("Attendance_T1", "Attendance_T2", "Remark_T1", "Remark_T2");
  } else if (key === "iii_viii") {
    cols = [...STUDENT_FIELDS_FULL];
    SUBJECTS_III_VIII.forEach((s) => {
      const k = s.replace(/[^A-Za-z]/g, "");
      // Total1 / Total2 / GrandTotal are optional overrides - leave them
      // blank and they'll be calculated automatically (UT1+UT2+Note book+
      // Attendance marks+Mid Term, etc.), attendance and note book each
      // worth 5 marks as shown in the printed header.
      ["UT1", "UT2", "NBSE1", "MidTerm", "Total1", "UT3", "UT4", "NBSE2", "AnnualExam", "Total2", "GrandTotal"].forEach((f) => cols.push(`${k}_${f}`));
    });
    WORK_ART_HEALTH.forEach(([k]) => cols.push(`${k}_T1`, `${k}_T2`));
    PERSONAL_TRAITS.forEach(([k]) => cols.push(`${k}_T1`, `${k}_T2`));
    // AttendanceMarks_T1/T2 hold the 0-5 mark that feeds into each subject's
    // total; Attendance_T1/T2 keep showing the raw attendance record.
    cols.push("Attendance_T1", "Attendance_T2", "AttendanceMarks_T1", "AttendanceMarks_T2", "Remark_T1", "Remark_T2");
  } else if (key === "play") {
    cols = [...STUDENT_FIELDS_BASIC];
    PLAY_SUBJECTS.forEach(([k]) => cols.push(`${k}_T1`, `${k}_T2`));
    PLAY_COSCHOLASTIC.forEach(([k]) => cols.push(`${k}_T1`, `${k}_T2`));
    PLAY_TEACHER_EVAL.forEach(([k]) => cols.push(`${k}_T1`, `${k}_T2`));
    // NEW
    cols.push("Attendance_T1", "Attendance_T2", "Remark_T1", "Remark_T2");
    // cols.push("ExtraCurricular", "Attendance_T1", "Attendance_T2", "Remark_T1", "Remark_T2");
  } else if (key === "nur_kg" || key === "first_second") {
    cols = [...STUDENT_FIELDS_BASIC];
    const scholasticGroups = key === "nur_kg" ? NUR_SCHOLASTIC_NUR_KG : NUR_SCHOLASTIC_FIRST_SECOND;
    scholasticGroups.forEach((grp) => grp.items.forEach(([subKey]) =>
      cols.push(`${grp.key}_${subKey}_E1`, `${grp.key}_${subKey}_E2`, `${grp.key}_${subKey}_E3`)
    ));
    NUR_COSCHOLASTIC.forEach(([k]) => cols.push(`${k}_E1`, `${k}_E2`, `${k}_E3`));
    NUR_PERSONAL_TRAITS.forEach(([k]) => cols.push(`${k}_E1`, `${k}_E2`, `${k}_E3`));
    cols.push("Attendance_E1", "Attendance_E2", "Attendance_E3", "Remark_E1", "Remark_E2", "Remark_E3");
  }
  return cols;
}

const downloadTemplateBtn = document.getElementById("downloadTemplateBtn");
const downloadTemplateLabel = document.getElementById("downloadTemplateLabel");

function updateDownloadTemplateLabel() {
  downloadTemplateLabel.textContent = TEMPLATES[activeTemplate].label;
}

downloadTemplateBtn.addEventListener("click", () => {
  const cols = templateColumns(activeTemplate);
  const ws = XLSX.utils.aoa_to_sheet([cols]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Students");
  XLSX.writeFile(wb, `template_${activeTemplate}.xlsx`);
});

updateDownloadTemplateLabel();
renderClassFilterButtons();
renderList();
renderStage();
