"use client";

import { Fuel, LayoutDashboard, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard",       icon: LayoutDashboard, href: "/",             ativo: true  },
  { label: "Abastecimentos",  icon: Fuel,             href: "/abastecimentos", ativo: false },
  { label: "Nota de Condução", icon: FileText,        href: "/conducao",     ativo: false },
];

export function Sidebar() {
  const pathname = usePathname();

return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0F172A] flex flex-col z-40 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Fuel size={20} color="white" />
          </div>
          <div>
            <p className="text-white font-black text-lg leading-none tracking-tight">LogiDash</p>
            <p className="text-slate-500 text-xs mt-1">Gestão de Frota</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const ativo = item.ativo && pathname === item.href;
          
          return item.ativo ? (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${ativo 
                  ? "bg-sky-500/10 text-sky-400"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"}`}
            >

              <Icon size={18} className={ativo ? "text-sky-400" : "text-slate-400"} />
              {item.label}
              {ativo && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow-glow" />}
            </Link>
          ) : (
            <div
              key={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed opacity-60"
            >
              <Icon size={18} />
              {item.label}
              <span className="ml-auto text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">
                Breve
              </span>
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
    </aside>
  );
}