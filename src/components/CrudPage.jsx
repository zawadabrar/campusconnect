import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { createRecord, listRecords, removeRecord, updateRecord } from "../lib/data";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Modal from "./Modal";
import RecordForm from "./RecordForm";

export default function CrudPage({ type, title, subtitle, fields, columns, searchKey, extraActions }) {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setRows(await listRecords(type)); }
    catch (e) { setError(e.message || "Could not load records."); }
    finally { setLoading(false); }
  }, [type]);
  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => rows.filter((r) => searchKey.some((k) => String(r[k] || "").toLowerCase().includes(query.toLowerCase()))), [rows, query, searchKey]);

  async function save(values) {
    try {
      if (editing) await updateRecord(type, editing.id, values);
      else await createRecord(type, values);
      setEditing(null); setCreating(false); await load();
    } catch (e) { setError(e.message || "Could not save. Check your connection and Firebase rules."); }
  }
  async function remove(id) {
    if (!window.confirm("Delete this record?")) return;
    try { await removeRecord(type, id); await load(); }
    catch (e) { setError(e.message || "Could not delete record."); }
  }

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-indigo-600">Campus workspace</p><h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>
      <Button onClick={() => setCreating(true)}><Plus size={17}/> Add new</Button>
    </div>
    <Card><CardContent className="p-4">
      <div className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="form-control pl-10" aria-label={`Search ${title}`} placeholder="Search records..." value={query} onChange={(e) => setQuery(e.target.value)}/></div>
    </CardContent></Card>
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
    <Card>
      <CardHeader><div className="flex items-center justify-between"><CardTitle>{title} records</CardTitle><span className="text-xs text-slate-400">{filtered.length} records</span></div></CardHeader>
      <CardContent className="p-0">
        {loading ? <p className="p-6 text-sm text-slate-500">Loading records…</p> : filtered.length === 0 ? <p className="p-6 text-sm text-slate-500">No records found. Add your first record.</p> :
        <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{columns.map((c) => <th key={c.key} className="px-5 py-3 font-bold">{c.label}</th>)}<th className="px-5 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{filtered.map((row) => <tr key={row.id} className="hover:bg-slate-50/70">{columns.map((c) => <td key={c.key} className="max-w-xs px-5 py-4 text-slate-600">{row[c.key] || "—"}</td>)}<td className="px-5 py-4"><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label="Edit record" onClick={() => setEditing(row)}><Pencil size={16}/></Button><Button variant="ghost" size="icon" aria-label="Delete record" onClick={() => remove(row.id)}><Trash2 size={16} className="text-rose-600"/></Button>{extraActions?.(row, load)}</div></td></tr>)}</tbody>
        </table></div>}
      </CardContent>
    </Card>
    {(creating || editing) && <Modal title={editing ? `Edit ${title}` : `Add ${title}`} onClose={() => {setCreating(false);setEditing(null);}}>
      <RecordForm fields={fields} initial={editing || {}} onSubmit={save} onCancel={() => {setCreating(false);setEditing(null);}} submitLabel={editing ? "Update record" : "Create record"}/>
    </Modal>}
  </div>;
}
