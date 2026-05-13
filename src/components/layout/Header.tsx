"use client";

import { Calendar, Search, User, X, LogOut, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { HeaderProps } from "../../types/layout/header";

export function Header({
  placas, motoristas, filtroPlaca, filtroMotorista,
  dataInicio, dataFim, onFiltroPlaca, onFiltroMotorista,
  onDataInicio, onDataFim, onBuscar, onLimpar
}: Readonly<HeaderProps>) {
  const nome = globalThis.window === undefined ? "Usuário" : localStorage.getItem("nome") ?? "Usuário";
  const role = globalThis.window === undefined ? "" : localStorage.getItem("role") ?? "";
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFiltros, setShowFiltros] = useState(false);
  const [showCalendario, setShowCalendario] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    dataInicio && dataFim ? { from: new Date(dataInicio), to: new Date(dataFim) } : undefined
  );

  const [placaLocal, setPlacaLocal] = useState(filtroPlaca);
  const [motoristaLocal, setMotoristaLocal] = useState(filtroMotorista);

  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const calendarioRef = useRef<HTMLDivElement>(null);
  const hoje = new Date();

  const temFiltro = filtroPlaca !== "" || filtroMotorista !== "" || dataInicio !== "" || dataFim !== "";

  const periodoLabel = dataInicio && dataFim
    ? `${dataInicio.substring(8, 10)}/${dataInicio.substring(5, 7)} até ${dataFim.substring(8, 10)}/${dataFim.substring(5, 7)}`
    : "Selecionar período";

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (calendarioRef.current && !calendarioRef.current.contains(e.target as Node)) {
        setShowCalendario(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  function handleBuscar() {
    if (!range?.from || !range?.to) return;
    const fmt = (d: Date) => d.toISOString().split("T")[0];
    const inicio = fmt(range.from);
    const fim = fmt(range.to);
    onDataInicio(inicio);
    onDataFim(fim);
    onFiltroPlaca(placaLocal);
    onFiltroMotorista(motoristaLocal);
    onBuscar(inicio, fim, placaLocal, motoristaLocal);
    setShowCalendario(false);
    setShowFiltros(false);
  }

  function handleLimpar() {
    setPlacaLocal("");
    setMotoristaLocal("");
    setRange(undefined);
    onLimpar();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    localStorage.removeItem("role");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/login");
  }

  const selectClass = "text-xs border border-slate-700 rounded-lg px-3 py-1.5 bg-[#1E293B] text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all hover:bg-slate-800";
  const selectClassMobile = "w-full text-xs border border-slate-700 rounded-lg px-3 py-2 bg-[#1E293B] text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all";

  const renderFiltroSelects = (mobile = false) => (
    <>
      <select
        value={placaLocal}
        onChange={e => {
          const novaPlaca = e.target.value;
          setPlacaLocal(novaPlaca);

          if (range?.from && range?.to) {
            const fmt = (d: Date) => d.toISOString().split("T")[0];
            onBuscar(fmt(range.from), fmt(range.to), novaPlaca, motoristaLocal);
          }
        }}
        className={mobile ? selectClassMobile : selectClass}
      >
        <option value="" className="bg-[#0F172A]">Todas as Placas</option>
        {placas.map(p => <option key={p} value={p} className="bg-[#0F172A]">{p}</option>)}
      </select>

      <select
        value={motoristaLocal}
        onChange={e => {
          const novoMotorista = e.target.value;
          setMotoristaLocal(novoMotorista);

          if (range?.from && range?.to) {
            const fmt = (d: Date) => d.toISOString().split("T")[0];
            onBuscar(fmt(range.from), fmt(range.to), placaLocal, novoMotorista);
          }
        }}
        className={mobile ? selectClassMobile : selectClass}
      >
        <option value="" className="bg-[#0F172A]">Todos os Motoristas</option>
        {motoristas.map(m => <option key={m} value={m} className="bg-[#0F172A]">{m}</option>)}
      </select>
    </>
  );

  return (
    <>
      <header className="fixed top-0 left-0 md:left-60 right-0 h-16 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between px-4 md:px-8 z-30">

        <div className="flex items-center gap-3 md:hidden pl-12">
          <span className="text-white font-black text-base">LogiDash</span>
          <button
            onClick={() => setShowFiltros(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${temFiltro ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-slate-800 text-slate-400 border border-slate-700"}`}
          >
            <SlidersHorizontal size={14} />
            Filtros {temFiltro && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 ml-0.5 inline-block" />}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 relative">
          <div className="flex items-center gap-2 text-sky-500/70 mr-1">
            <Search size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filtros</span>
          </div>

          <button
            onClick={() => setShowCalendario(v => !v)}
            className={`flex items-center gap-2 text-xs border rounded-lg px-3 py-1.5 transition-all ${dataInicio && dataFim ? "border-sky-500 bg-sky-500/10 text-sky-400" : "border-slate-700 bg-[#1E293B] text-slate-300 hover:bg-slate-800"}`}
          >
            <Calendar size={14} />
            {periodoLabel}
          </button>

          {renderFiltroSelects()}

          <button
            onClick={handleBuscar}
            disabled={!range?.from || !range?.to}
            className="px-4 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-600 disabled:bg-sky-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Buscar
          </button>

          {temFiltro && (
            <button onClick={handleLimpar} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
              <X size={14} /> Limpar
            </button>
          )}

          {showCalendario && (
            <div ref={calendarioRef} className="absolute top-12 left-0 bg-[#1E293B] text-white border border-slate-700 rounded-2xl shadow-2xl z-50 p-4">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                locale={ptBR}
                disabled={{ after: hoje }}
                classNames={{
                  selected: `bg-sky-500 text-black font-bold`,
                  range_middle: `bg-sky-500 text-black`,
                  range_start: `rounded-l-md bg-sky-500 text-black`,
                  range_end: `rounded-r-md bg-sky-500 text-black`,
                  chevron: `fill-sky-500`,
                }}
              />
              <button
                onClick={() => setShowCalendario(false)}
                className="w-full mt-2 px-3 py-2 text-xs font-bold text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div ref={userMenuRef} className="relative flex items-center gap-2 md:gap-3 md:pl-6 md:border-l md:border-slate-700">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-white">{nome}</span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wide">{role}</span>
            </div>
            <button
              type="button"
              aria-label="Menu do usuário"
              onClick={() => setShowUserMenu(v => !v)}
              className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-sky-500/20 hover:scale-105 transition-transform"
            >
              <User size={18} className="text-white" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-12 bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-44 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-700 md:hidden">
                  <p className="text-xs font-bold text-white">{nome}</p>
                  <p className="text-[10px] text-emerald-400">{role}</p>
                </div>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showFiltros && (
        <button
          type="button"
          aria-label="Fechar filtros"
          className="md:hidden fixed inset-0 bg-black/60 z-40 cursor-default"
          onClick={() => setShowFiltros(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowFiltros(false)}
        />
      )}

      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#0F172A] border-t border-slate-800 rounded-t-2xl z-50 transition-transform duration-300 ${showFiltros ? "translate-y-0" : "translate-y-full"}`}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm">Filtros</h3>
            <button onClick={() => setShowFiltros(false)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs text-white font-bold uppercase tracking-wide">Período</span>
            <div className="flex justify-center text-white bg-slate-900/50 rounded-xl p-2">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                locale={ptBR}
                disabled={{ after: hoje }}
                classNames={{
                  selected: `bg-sky-500 text-black font-bold`,
                  range_middle: `bg-sky-500 text-black`,
                  range_start: `rounded-l-md bg-sky-500 text-black`,
                  range_end: `rounded-r-md bg-sky-500 text-black`,
                  chevron: `fill-sky-500`,
                }}
              />
            </div>

            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-2">Veículo e Motorista</span>
            {renderFiltroSelects(true)}

            <button
              onClick={handleBuscar}
              disabled={!range?.from || !range?.to}
              className="w-full mt-4 px-3 py-3 text-xs font-bold bg-sky-500 hover:bg-sky-600 disabled:bg-sky-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Aplicar Filtros
            </button>

            {temFiltro && (
              <button onClick={handleLimpar} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                <X size={14} /> Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}