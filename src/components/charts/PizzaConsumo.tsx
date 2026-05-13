"use client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CORES } from "./PizzaValor";
import { ConsumoProps } from "../../types/dashboard/consumo";

export function PizzaConsumo({ consumo }: Readonly<ConsumoProps>) {
  const dados = [
    { name: "Interno", value: consumo.litrosInterno, fill: CORES[0] },
    { name: "Externo", value: consumo.litrosExterno, fill: CORES[1] },
  ];

  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6">
      <h2 className="font-bold text-slate-200 mb-6 tracking-tight">Consumo Interno vs Externo (Litros)</h2>
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1">
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
                formatter={(value) => [`${Number(value).toLocaleString("pt-BR")} L`, "Total"]}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center gap-3 min-w-47.5 text-[13px] bg-[#0F172A]/50 p-4 rounded-xl border border-slate-800/50">
          <p className="font-black text-sky-400 uppercase text-[10px] tracking-widest">Posto Interno</p>
          <div className="flex justify-between text-slate-300">
            <span>Diesel</span>
            <span className="font-bold text-white">{consumo.dieselInterno.toLocaleString("pt-BR")} L</span>
          </div>
          {consumo.arlaGranelInterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Granel</span>
              <span className="font-bold text-white">{consumo.arlaGranelInterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}
          <hr className="border-slate-800 my-1" />
          <p className="font-black text-amber-500 uppercase text-[10px] tracking-widest">Posto Externo</p>
          <div className="flex justify-between text-slate-300">
            <span>Diesel</span>
            <span className="font-bold text-white">{consumo.dieselExterno.toLocaleString("pt-BR")} L</span>
          </div>
          {consumo.arlaGranelExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Granel</span>
              <span className="font-bold text-white">{consumo.arlaGranelExterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}
          {consumo.arlaBaldeExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Balde</span>
              <span className="font-bold text-white">{consumo.arlaBaldeExterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}
          {consumo.gasolinaExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Gasolina</span>
              <span className="font-bold text-white">{consumo.gasolinaExterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}