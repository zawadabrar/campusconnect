import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function RecordForm({ fields, initial = {}, onSubmit, onCancel, submitLabel = "Save" }) {
  const [values, setValues] = useState({});
  useEffect(() => {
    const next = {};
    fields.forEach((f) => next[f.name] = initial[f.name] ?? "");
    setValues(next);
  }, [initial, fields]);

  function change(name, value) { setValues((old) => ({ ...old, [name]: value })); }
  function submit(e) { e.preventDefault(); onSubmit(values); }

  return <form onSubmit={submit} className="space-y-4">
    {fields.map((field) => <label key={field.name} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{field.label}</span>
      {field.type === "select" ? <select required={field.required !== false} value={values[field.name] || ""} onChange={(e) => change(field.name,e.target.value)} className="form-control"><option value="">Select…</option>{field.options.map((o) => <option key={o} value={o}>{o}</option>)}</select> :
      field.type === "textarea" ? <textarea required={field.required !== false} rows="3" value={values[field.name] || ""} onChange={(e) => change(field.name,e.target.value)} placeholder={field.placeholder || ""} className="form-control resize-y"/> :
      <input required={field.required !== false} type={field.type || "text"} value={values[field.name] || ""} onChange={(e) => change(field.name,e.target.value)} placeholder={field.placeholder || ""} className="form-control"/>}
    </label>)}
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      <Button type="submit">{submitLabel}</Button>
    </div>
  </form>;
}
