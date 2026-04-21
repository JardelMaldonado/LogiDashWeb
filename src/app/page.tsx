"use client";

import { useEffect, useState } from "react";
import { fetchAbastecimentos } from "@/src/lib/api";
import { Abastecimento } from "@/src/types/abastecimento";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Header } from "@/src/components/layout/Header";
import { PizzaConsumo } from "@/src/components/charts/PizzaConsumo";
import { PizzaValor } from "@/src/components/charts/PizzaValor";
import { RankingPostos } from "@/src/components/charts/RankingPostos";
import { RankingMotoristas } from "@/src/components/charts/RankingMotoristas";
import { EvolucaoDiaria } from "@/src/components/charts/EvolucaoDiaria";
import { PrecoDiesel } from "@/src/components/charts/PrecoDiesel";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [filtroPlaca, setFiltroPlaca] = useState("");
  const [filtroMotorista, setFiltroMotorista] = useState("");
  const mesAtual = String(new Date().getMonth() + 1).padStart(2, "0");
  const [mesSelecionado, setMesSelecionado] = useState(mesAtual);
  const [cache, setCache] = useState<Record<string, Abastecimento[]>>({});
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);

  useEffect(() => {
    if (cache[mesSelecionado]) {
      setAbastecimentos(cache[mesSelecionado]);
      setFiltroPlaca("");
      setFiltroMotorista("");
      return;
    }

    async function carregarDados() {
      setLoading(true);
      try {
        const ano = new Date().getFullYear();
        const ultimoDia = new Date(ano, Number.parseInt(mesSelecionado), 0).getDate();
        const dataFinal =
          mesSelecionado === mesAtual
            ? `${ano}-${mesSelecionado}-${String(new Date().getDate()).padStart(2, "0")}`
            : `${ano}-${mesSelecionado}-${ultimoDia}`;

        const data = await fetchAbastecimentos({
          pagina: 1,
          dataInicial: `${ano}-${mesSelecionado}-01`,
          dataFinal,
        });

        const resultado = data || [];
        setCache((prev) => ({ ...prev, [mesSelecionado]: resultado }));
        setAbastecimentos(resultado);
        setFiltroPlaca("");
        setFiltroMotorista("");
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [mesSelecionado]);

  const dados = abastecimentos
    .filter((x) => filtroPlaca === "" || x.placa === filtroPlaca)
    .filter(
      (x) => filtroMotorista === "" || x.nomeMotorista === filtroMotorista,
    );

  const interno = dados.filter((x) => x.pontoVenda?.postoInterno === true);
  const externo = dados.filter((x) => x.pontoVenda?.postoInterno === false);

if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sky-400 font-medium tracking-tight">Carregando LogiDash...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Sidebar />
      <Header
        abastecimentos={abastecimentos}
        filtroPlaca={filtroPlaca}
        filtroMotorista={filtroMotorista}
        mesSelecionado={mesSelecionado}
        onFiltroPlaca={setFiltroPlaca}
        onFiltroMotorista={setFiltroMotorista}
        onMesSelecionado={setMesSelecionado}
        onLimpar={() => {
          setFiltroPlaca("");
          setFiltroMotorista("");
        }}
      />
      <main className="ml-60 pt-20 p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800 shadow-lg">
             <h3 className="text-slate-300 text-sm font-bold mb-4 uppercase tracking-wider">Consumo</h3>
             <PizzaConsumo interno={interno} externo={externo} />
          </div>
          <div className="bg-[#1E293B] p-6 rounded-2xl border border-slate-800 shadow-lg">
             <h3 className="text-slate-300 text-sm font-bold mb-4 uppercase tracking-wider">Valores</h3>
             <PizzaValor interno={interno} externo={externo} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <RankingPostos dados={dados} />
          <RankingMotoristas dados={dados} />
          <EvolucaoDiaria dados={dados} />
          <PrecoDiesel dados={dados} />
        </div>
      </main>
    </div>
  );
}