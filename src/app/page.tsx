"use client";

import { useEffect, useState, useRef } from "react";
import { DashboardData } from "../types";
import { fetchDashboard } from "../lib/api";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Header } from "@/src/components/layout/Header";
import { PizzaConsumo } from "@/src/components/charts/PizzaConsumo";
import { PizzaValor } from "@/src/components/charts/PizzaValor";
import { RankingPostos } from "@/src/components/charts/RankingPostos";
import { RankingMotoristas } from "@/src/components/charts/RankingMotoristas";
import { EvolucaoDiaria } from "@/src/components/charts/EvolucaoDiaria";
import { PrecoDiesel } from "@/src/components/charts/PrecoDiesel";

const CACHE_KEY_PREFIX = "dash_";

function getCacheKey(inicio: string, fim: string) {
  return `${CACHE_KEY_PREFIX}${inicio}_${fim}`;
}

export default function Dashboard() {
  const hoje = new Date();
  const mes = hoje.getMonth() + 1;
  const mesStr = String(mes).padStart(2, "0");
  const anoStr = String(hoje.getFullYear());
  const diaStr = String(hoje.getDate()).padStart(2, "0");

  const [loading, setLoading] = useState(true);
  const [filtroPlaca, setFiltroPlaca] = useState("");
  const [filtroMotorista, setFiltroMotorista] = useState("");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashboardOriginal, setDashboardOriginal] = useState<DashboardData | null>(null);
  const [dataInicio, setDataInicio] = useState(`${anoStr}-${mesStr}-01`);
  const [dataFim, setDataFim] = useState(`${anoStr}-${mesStr}-${diaStr}`);
  const [erro, setErro] = useState("");
  const buscando = useRef(false);

  useEffect(() => {
    buscar(dataInicio, dataFim);
  }, []);

  async function buscar(inicio: string, fim: string, placa?: string, motorista?: string) {
    if (buscando.current) return;

    const temFiltro = (placa && placa !== "") || (motorista && motorista !== "");
    const cacheKey = getCacheKey(inicio, fim);

    if (!temFiltro) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const data: DashboardData = JSON.parse(cached);
        setDashboard(data);
        setDashboardOriginal(data);
        setFiltroPlaca("");
        setFiltroMotorista("");
        setLoading(false);
        return;
      }
    }

    buscando.current = true;
    setLoading(true);
    setErro("");

    try {
      const data = await fetchDashboard(inicio, fim, placa || undefined, motorista || undefined);

      if (!temFiltro) {
        Object.keys(sessionStorage)
          .filter(k => k.startsWith(CACHE_KEY_PREFIX))
          .forEach(k => sessionStorage.removeItem(k));

        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        setDashboardOriginal(data);
      }

      setDashboard(data);
      setFiltroPlaca(placa || "");
      setFiltroMotorista(motorista || "");
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setErro("Não foi possível carregar os dados. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
      buscando.current = false;
    }
  }


  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sky-400 font-medium tracking-tight">Carregando LogiDash...</p>
        </div>
      </div>
    );

  if (erro)
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center">
            <span className="text-rose-400 text-2xl">!</span>
          </div>
          <p className="text-white font-bold text-lg">Algo deu errado</p>
          <p className="text-slate-400 text-sm">{erro}</p>
          <button
            onClick={() => { setErro(""); buscando.current = false; buscar(dataInicio, dataFim); }}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );

  if (!dashboard) return null;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Sidebar />
      <Header
        filtroPlaca={filtroPlaca}
        filtroMotorista={filtroMotorista}
        placas={dashboardOriginal?.todasPlacas || dashboard.todasPlacas}
        motoristas={dashboardOriginal?.todosMotoristas || dashboard.todosMotoristas}
        dataInicio={dataInicio}
        dataFim={dataFim}
        onFiltroPlaca={setFiltroPlaca}
        onFiltroMotorista={setFiltroMotorista}
        onDataInicio={setDataInicio}
        onDataFim={setDataFim}
        onBuscar={(inicio, fim, placa, motorista) => {
          setDataInicio(inicio);
          setDataFim(fim);
          const cacheKey = getCacheKey(inicio, fim);
          const cached = sessionStorage.getItem(cacheKey);
          if (!placa && !motorista && cached) {
            const data: DashboardData = JSON.parse(cached);
            setDashboard(data);
            setDashboardOriginal(data);
            setFiltroPlaca("");
            setFiltroMotorista("");
            return;
          }
          buscar(inicio, fim, placa, motorista);
        }}
        onLimpar={() => {
          setFiltroPlaca("");
          setFiltroMotorista("");
          if (dashboardOriginal) {
            setDashboard(dashboardOriginal);
          }
        }}
      />
      <main className="ml-0 md:ml-60 pt-20 px-4 md:px-8 pb-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800 shadow-lg">
            <h3 className="text-slate-300 text-sm font-bold mb-4 uppercase tracking-wider">Consumo</h3>
            <PizzaConsumo consumo={dashboard.consumo} />
          </div>
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800 shadow-lg">
            <h3 className="text-slate-300 text-sm font-bold mb-4 uppercase tracking-wider">Valores</h3>
            <PizzaValor precoMedio={dashboard.precoMedio} consumo={dashboard.consumo} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8">
          <RankingPostos dados={dashboard.rankingPostos} />
          <RankingMotoristas dados={dashboard.rankingMotoristas} />
          <EvolucaoDiaria dados={dashboard.gastoDiario} />
          <PrecoDiesel dados={dashboard.precoDieselDiario} />
        </div>
      </main>
    </div>
  );
}