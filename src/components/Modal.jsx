import { X } from "lucide-react";
export default function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(e) => { if(e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
      <div className="mb-5 flex items-center justify-between"><h2 id="modal-title" className="text-lg font-bold">{title}</h2><button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close dialog"><X size={18}/></button></div>
      {children}
    </section>
  </div>;
}
