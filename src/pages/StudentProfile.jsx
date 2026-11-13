import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Hash, MapPin, Pencil, Phone, Mail, Trash2, BookOpen } from "lucide-react";
import { listRecords, removeRecord, updateRecord } from "../lib/data";
import { cleanStudent, initials, studentFields, validateStudent } from "../lib/studentFields";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Modal from "../components/Modal";
import RecordForm from "../components/RecordForm";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(await listRecords("students")); }
    catch (e) { setError(e.message || "Could not load student."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const student = rows.find((r) => r.id === id);

  async function save(values) {
    const msg = validateStudent(values, rows, id);
    if (msg) { setFormError(msg); return; }
    try { await updateRecord("students", id, cleanStudent(values)); setEditing(false); setFormError(""); await load(); }
    catch (e) { setFormError(e.message || "Could not save changes."); }
  }
  async function remove() {
    if (!window.confirm(`Delete ${student.name}?`)) return;
    try { await removeRecord("students", id); navigate("/students"); }
    catch (e) { setError(e.message || "Could not delete student."); }
  }

  const back = <Link to="/students" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"><ArrowLeft size={16}/> Back to students</Link>;
  if (loading) return <div className="space-y-4">{back}<p className="text-sm text-slate-500">Loading student…</p></div>;
  if (!student) return <div className="space-y-4">{back}<Card><CardContent className="p-6 text-sm text-slate-500">{error || "Student not found. They may have been deleted."}</CardContent></Card></div>;

  const details = [
    { icon: Hash, label: "Student ID", value: student.studentId },
    { icon: Mail, label: "Email", value: student.email },
    { icon: Building2, label: "Department", value: student.department },
    { icon: BookOpen, label: "Semester", value: student.semester },
    { icon: Phone, label: "Phone", value: student.phone },
    { icon: MapPin, label: "Address", value: student.address },
  ];

  return <div className="space-y-6">
    {back}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
    <Card><CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-600 text-xl font-extrabold text-white">{initials(student.name)}</div>
        <div><h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{student.name}</h1><p className="text-sm text-slate-500">{student.department || "Department not set"}{student.studentId ? ` · ${student.studentId}` : ""}</p></div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setEditing(true)}><Pencil size={16}/> Edit</Button>
        <Button variant="danger" onClick={remove}><Trash2 size={16}/> Delete</Button>
      </div>
    </CardContent></Card>
    <Card><CardContent className="grid gap-5 p-6 sm:grid-cols-2">
      {details.map(({ icon: Icon, label, value }) => <div key={label} className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"><Icon size={18}/></div>
        <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="break-words text-sm text-slate-800">{value || "—"}</p></div>
      </div>)}
    </CardContent></Card>
    {editing && <Modal title="Edit student" onClose={() => { setEditing(false); setFormError(""); }}>
      {formError && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{formError}</div>}
      <RecordForm fields={studentFields} initial={student} onSubmit={save} onCancel={() => { setEditing(false); setFormError(""); }} submitLabel="Update student"/>
    </Modal>}
  </div>;
}
