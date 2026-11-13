import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, CalendarDays, GraduationCap, LayoutDashboard, LogOut, Menu, Users, UserRound, X, CloudSun } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/notices", label: "Notice board", icon: Bell },
  { to: "/events", label: "Campus events", icon: CalendarDays },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 hover:bg-slate-100 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={23}/></div>
          <div><div className="font-extrabold tracking-tight">CampusConnect</div><div className="text-xs text-slate-500">Smart campus, one place</div></div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <span className="max-w-48 truncate text-sm text-slate-500">{user?.email}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}><LogOut size={15}/> Sign out</Button>
        </div>
      </div>
    </header>
    <div className="mx-auto grid max-w-7xl md:grid-cols-[230px_1fr]">
      <aside className={`${open ? "block" : "hidden"} border-r border-slate-200 bg-white p-4 md:block md:min-h-[calc(100vh-65px)]`}>
        <p className="mb-3 px-3 pt-3 text-[11px] font-bold uppercase tracking-[.15em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>
            <Icon size={18}/>{label}
          </NavLink>)}
        </nav>
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white">
          <CloudSun size={22}/>
          <p className="mt-3 text-sm font-bold">Campus updates</p>
          <p className="mt-1 text-xs leading-5 text-indigo-100">Notices, events and student information in one simple space.</p>
        </div>
        <div className="mt-5 border-t border-slate-100 pt-4 md:hidden">
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-500"><UserRound size={14}/>{user?.email}</div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}><LogOut size={15}/> Sign out</Button>
        </div>
      </aside>
      <main className="min-w-0 p-4 sm:p-6 lg:p-8"><Outlet/></main>
    </div>
    <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-400">CampusConnect · CSE-2340 Software Development 1 demo project</footer>
  </div>;
}
