export const DEPARTMENTS = ["CSE", "EEE", "BBA", "English", "Law", "Other"];
export const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export const studentFields = [
  { name: "name", label: "Full name", placeholder: "e.g. Ayesha Rahman" },
  { name: "studentId", label: "Student ID", placeholder: "e.g. CSE-2301" },
  { name: "email", label: "Email", type: "email", placeholder: "name@example.com" },
  { name: "department", label: "Department", type: "select", options: DEPARTMENTS },
  { name: "semester", label: "Semester", type: "select", options: SEMESTERS, required: false },
  { name: "phone", label: "Phone", placeholder: "01XXXXXXXXX", required: false },
  { name: "address", label: "Address", type: "textarea", placeholder: "Village / area, district", required: false },
];

// Returns an error message, or "" if the values are fine.
export function validateStudent(values, rows, editingId) {
  const sid = values.studentId.trim().toLowerCase();
  const mail = values.email.trim().toLowerCase();
  const others = rows.filter((r) => r.id !== editingId);
  if (others.some((r) => String(r.studentId || "").trim().toLowerCase() === sid)) return "A student with this Student ID already exists.";
  if (others.some((r) => String(r.email || "").trim().toLowerCase() === mail)) return "A student with this email already exists.";
  return "";
}

export function cleanStudent(values) {
  const out = {};
  Object.entries(values).forEach(([k, v]) => { out[k] = typeof v === "string" ? v.trim() : v; });
  return out;
}

export function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "?";
}
