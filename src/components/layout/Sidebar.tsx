"use client";

import { Fuel, LayoutDashboard, Users, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavProps } from '../../types/layout/nav';

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", ativo: true, adminOnly: false },
  { label: "Usuários", icon: Users, href: "/usuarios", ativo: true, adminOnly: true },
];

function NavItems({ pathname, role, onClose }: Readonly<NavProps>) {
  return (
    <>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems
          .filter(item => !item.adminOnly || role === "ADMIN")
          .map((item) => {
            const Icon = item.icon;
            const ativo = item.ativo && pathname === item.href;
            return item.ativo ? (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${ativo ? "bg-sky-500/10 text-sky-400" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}>
                <Icon size={18} className={ativo ? "text-sky-400" : "text-slate-400"} />
                {item.label}
                {ativo && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />}
              </Link>
            ) : (
              <div key={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed opacity-60">
                <Icon size={18} />
                {item.label}
                <span className="ml-auto text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">Breve</span>
              </div>
            );
          })}
      </nav>
      <div className="p-4 border-t border-slate-800 bg-[#0B1222]">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-slate-500 text-[10px] font-medium tracking-widest uppercase">Sistema Online</p>
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const role = globalThis.window === undefined ? "" : localStorage.getItem("role") ?? "";
  const [aberto, setAberto] = useState(false);

  const logoSection = (showClose = false) => (
    <div className="p-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Fuel size={20} color="white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none tracking-tight">LogiDash</p>
            <p className="text-slate-500 text-xs mt-1">Gestão de Frota</p>
          </div>
        </div>
        {showClose && (
          <button onClick={() => setAberto(false)} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-300"
      >
        <Menu size={18} />
      </button>


      {aberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="md:hidden fixed inset-0 bg-black/60 z-40 cursor-default"
          onClick={() => setAberto(false)}
          onKeyDown={(e) => e.key === "Escape" && setAberto(false)}
        />
      )}

      <aside className={`md:hidden fixed left-0 top-0 h-screen w-72 bg-[#0F172A] flex flex-col z-50 border-r border-slate-800 transition-transform duration-300 ${aberto ? "translate-x-0" : "-translate-x-full"}`}>
        {logoSection(true)}
        <NavItems pathname={pathname} role={role} onClose={() => setAberto(false)} />
      </aside>

      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-[#0F172A] flex-col z-40 border-r border-slate-800">
        {logoSection(false)}
        <NavItems pathname={pathname} role={role} />
      </aside>
    </>
  );
}