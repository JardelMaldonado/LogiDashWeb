"use client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PrecoMedioProps } from "../../types/dashboard/consumo";

export const CORES = ["#0ea5e9", "#f59e0b"];

export function PizzaValor({ precoMedio }: Readonly<PrecoMedioProps>) {
  const dados = [
    { name: "Interno", value: precoMedio.valorInternoTotal, fill: CORES[0] },
    { name: "Externo", value: precoMedio.valorExternoTotal, fill: CORES[1] },
  ];

  const totalGeral = precoMedio.valorInternoTotal + precoMedio.valorExternoTotal;

  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6">
      <h2 className="font-bold text-slate-200 mb-6 tracking-tight">Gasto Interno vs Externo (R$)</h2>
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={dados} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={60} outerRadius={70}
                paddingAngle={5} stroke="none"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Total"]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center gap-3 text-[12px] bg-[#0F172A]/50 p-4 rounded-xl border border-slate-800/50">
          <p className="font-black text-sky-400 uppercase text-[10px] tracking-widest">Preço Médio Interno</p>
          {precoMedio.dieselInterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Diesel</span>
              <span className="font-bold text-white">R$ {precoMedio.dieselInterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          <hr className="border-slate-800 my-1" />
          <p className="font-black text-amber-500 uppercase text-[10px] tracking-widest">Preço Médio Externo</p>
          {precoMedio.dieselExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Diesel</span>
              <span className="font-bold text-white">R$ {precoMedio.dieselExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          {precoMedio.arlaGranelExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Granel</span>
              <span className="font-bold text-white">R$ {precoMedio.arlaGranelExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          {precoMedio.arlaBaldeExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Balde</span>
              <span className="font-bold text-white">R$ {precoMedio.arlaBaldeExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          {precoMedio.gasolinaExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Gasolina</span>
              <span className="font-bold text-white">R$ {precoMedio.gasolinaExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          <hr className="border-slate-800 my-1" />
          <div className="flex justify-between text-[11px] text-green-400 mt-1">
            <span>TOTAL GERAL</span>
            <span className="font-bold">R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}