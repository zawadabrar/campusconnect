import { useState } from "react";
import { GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { firebaseEnabled } from "../lib/firebase";
import { Button } from "../components/ui/button";

export default function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("student@campus.edu");
  const [password, setPassword] = useState("campus123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace/>;

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await (mode === "login" ? login(email,password) : register(email,password)); navigate("/dashboard"); }
    catch (e) { setError(e.message || "Authentication failed."); }
    finally { setBusy(false); }
  }

  return <div className="grid min-h-screen bg-[#f5f7fb] lg:grid-cols-2">
    <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-12 text-white lg:flex">
      <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15"><GraduationCap size={25}/></div><span className="text-xl font-extrabold">CampusConnect</span></div>
      <div className="max-w-lg"><p className="mb-4 text-sm font-bold uppercase tracking-[.2em] text-indigo-200">Your campus, connected</p><h1 className="text-5xl font-extrabold leading-tight">Everything happening on campus, in one place.</h1><p className="mt-5 text-lg leading-8 text-indigo-100">Stay informed, discover events and keep your student information organized.</p></div>
      <p className="text-sm text-indigo-200">CSE-2340 · Software Development 1</p>
    </div>
    <div className="grid place-items-center p-5 sm:p-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-7 flex items-center gap-3 lg:hidden"><div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap/></div><b className="text-lg">CampusConnect</b></div>
        <p className="text-sm font-bold text-indigo-600">{mode === "login" ? "WELCOME BACK" : "GET STARTED"}</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{mode === "login" ? "Sign in to your account" : "Create your account"}</h2>
        <p className="mt-2 text-sm text-slate-500">Access your campus dashboard and updates.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Email address</span><div className="relative"><Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="form-control pl-10" type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></div></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold">Password</span><div className="relative"><LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input className="form-control pl-10" type="password" minLength="6" required value={password} onChange={e=>setPassword(e.target.value)}/></div></label>
          {error && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <Button className="w-full" size="lg" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">{mode === "login" ? "New here?" : "Already have an account?"} <button className="font-bold text-indigo-600 hover:underline" onClick={()=>{setMode(mode==="login"?"register":"login");setError("");}}>{mode==="login"?"Create account":"Sign in"}</button></p>
        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">{firebaseEnabled ? "Firebase mode: use an account registered in this Firebase project." : "Demo mode: sign in with any valid email and a password of at least 6 characters. Data is saved in this browser's localStorage."}</div>
      </div>
    </div>
  </div>;
}
