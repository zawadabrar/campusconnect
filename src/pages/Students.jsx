import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { createRecord, listRecords, removeRecord, updateRecord } from "../lib/data";
import { cleanStudent, studentFields, validateStudent } from "../lib/studentFields";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Modal from "../components/Modal";
import RecordForm from "../components/RecordForm";

export default function Students() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setRows(await listRecords("students")); }
    catch (e) { setError(e.message || "Could not load students."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => ["name", "studentId", "email", "department"].some((k) => String(r[k] || "").toLowerCase().includes(q)));
  }, [rows, query]);

  function closeForm() { setCreating(false); setEditing(null); setFormError(""); }

  async function save(values) {
    const msg = validateStudent(values, rows, editing?.id);
    if (msg) { setFormError(msg); return; }
    try {
      const data = cleanStudent(values);
      if (editing) await updateRecord("students", editing.id, data);
      else await createRecord("students", data);
      closeForm(); await load();
    } catch (e) { setFormError(e.message || "Could not save. Check your connection and Firebase rules."); }
  }

  async function remove(row) {
    if (!window.confirm(`Delete ${row.name}?`)) return;
    try { await removeRecord("students", row.id); await load(); }
    catch (e) { setError(e.message || "Could not delete student."); }
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Campus workspace</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Students</h1><p className="mt-1 text-sm text-slate-500">Add, search and manage student information.</p></div>
      <Button onClick={() => setCreating(true)}><Plus size={17}/> Add student</Button>
    </div>
    <Card><CardContent className="p-4">
      <div className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="form-control pl-10" aria-label="Search students" placeholder="Search by name, student ID or email..." value={query} onChange={(e) => setQuery(e.target.value)}/></div>
    </CardContent></Card>
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
    <Card>
      <CardHeader><div className="flex items-center justify-between"><CardTitle>Student list</CardTitle><span className="text-xs text-slate-400">{filtered.length} of {rows.length} students</span></div></CardHeader>
      <CardContent className="p-0">
        {loading ? <p className="p-6 text-sm text-slate-500">Loading students…</p> : filtered.length === 0 ? <p className="p-6 text-sm text-slate-500">{rows.length ? "No student matches your search." : "No students yet. Add your first student."}</p> :
        <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-bold">Name</th><th className="px-5 py-3 font-bold">Student ID</th><th className="px-5 py-3 font-bold">Email</th><th className="px-5 py-3 font-bold">Department</th><th className="px-5 py-3 font-bold">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.map((row) => <tr key={row.id} className="hover:bg-slate-50/70">
            <td className="px-5 py-4 font-semibold text-slate-800"><Link to={`/students/${row.id}`} className="hover:text-indigo-600">{row.name}</Link></td>
            <td className="px-5 py-4 text-slate-600">{row.studentId || "—"}</td>
            <td className="px-5 py-4 text-slate-600">{row.email || "—"}</td>
            <td className="px-5 py-4 text-slate-600">{row.department || "—"}</td>
            <td className="px-5 py-4"><div className="flex gap-1">
              <Link to={`/students/${row.id}`} aria-label="View profile" className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"><Eye size={16}/></Link>
              <Button variant="ghost" size="icon" aria-label="Edit student" onClick={() => setEditing(row)}><Pencil size={16}/></Button>
              <Button variant="ghost" size="icon" aria-label="Delete student" onClick={() => remove(row)}><Trash2 size={16} className="text-rose-600"/></Button>
            </div></td>
          </tr>)}</tbody>
        </table></div>}
      </CardContent>
    </Card>
    {(creating || editing) && <Modal title={editing ? "Edit student" : "Add student"} onClose={closeForm}>
      {formError && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{formError}</div>}
      <RecordForm fields={studentFields} initial={editing || {}} onSubmit={save} onCancel={closeForm} submitLabel={editing ? "Update student" : "Add student"}/>
    </Modal>}
  </div>;
}
