"use client";

import { Calendar, Search, User, X } from "lucide-react";
import { Abastecimento } from "@/src/types/abastecimento";

const MESES = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
].slice(0, new Date().getMonth() + 1);

interface HeaderProps {
  abastecimentos: Abastecimento[];
  filtroPlaca: string;
  filtroMotorista: string;
  mesSelecionado: string;
  onFiltroPlaca: (v: string) => void;
  onFiltroMotorista: (v: string) => void;
  onMesSelecionado: (v: string) => void;
  onLimpar: () => void;
}

export function Header({ abastecimentos, filtroPlaca, filtroMotorista, mesSelecionado, onFiltroPlaca, onFiltroMotorista, onMesSelecionado, onLimpar }: HeaderProps) {
  const placas = [...new Set(abastecimentos.map(x => x.placa))].sort();
  const motoristas = [...new Set(abastecimentos.map(x => x.nomeMotorista))].sort();
  const temFiltro = filtroPlaca !== "" || filtroMotorista !== "";
  const mesLabel = MESES.find(m => m.value === mesSelecionado)?.label ?? "";
  const ano = new Date().getFullYear();

  const selectClass = "text-xs border border-slate-700 rounded-lg px-3 py-1.5 bg-[#1E293B] text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all hover:bg-slate-800";

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-8 z-30">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sky-500/70 mr-2">
          <Search size={18} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filtros</span>
        </div>

        <div className="flex items-center gap-2">
            <select value={mesSelecionado} onChange={e => onMesSelecionado(e.target.value)} className={selectClass}>
                {MESES.map(m => <option key={m.value} value={m.value} className="bg-[#0F172A]">{m.label}</option>)}
            </select>

            <select value={filtroPlaca} onChange={e => onFiltroPlaca(e.target.value)} className={selectClass}>
                <option value="" className="bg-[#0F172A]">Todas as Placas</option>
                {placas.map(p => <option key={p} value={p} className="bg-[#0F172A]">{p}</option>)}
            </select>

            <select value={filtroMotorista} onChange={e => onFiltroMotorista(e.target.value)} className={selectClass}>
                <option value="" className="bg-[#0F172A]">Todos os Motoristas</option>
                {motoristas.map(m => <option key={m} value={m} className="bg-[#0F172A]">{m}</option>)}
            </select>
        </div>

        {temFiltro && (
          <button
            onClick={onLimpar}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <X size={14} /> Limpar
          </button>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2.5 bg-slate-800/40 px-4 py-2 rounded-full border border-slate-700/50">
          <Calendar size={14} className="text-sky-400" />
          <span className="text-xs font-bold text-slate-300">
            {mesLabel}, {ano}
          </span>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-700">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-white">Jardel Silva</span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wide">Admin</span>
          </div>
          <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform">
            <User size={18} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}