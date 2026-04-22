"use client";

import {PieChart,Pie,Cell,Tooltip,Legend,ResponsiveContainer,} from "recharts";
import { Abastecimento } from "@/src/types/abastecimento";
import { somaLitrosBalde, somaLitrosPorNome } from "@/src/lib/helpers";
import { CORES } from "./PizzaValor";

interface Props {
  interno: Abastecimento[];
  externo: Abastecimento[];
}


export function PizzaConsumo({ interno, externo }: Props) {
  const litrosInterno = interno.reduce((acc, x) => acc + (x.litros || 0), 0);
  const litrosExterno = externo.reduce((acc, x) => acc + (x.litros || 0), 0);


  const dados = [
    { name: "Interno", value: Number.parseFloat(litrosInterno.toFixed(2)) },
    { name: "Externo", value: Number.parseFloat(litrosExterno.toFixed(2)) },
  ];


  const dieselInterno = somaLitrosPorNome(interno, "Diesel S-10 Comum") + somaLitrosPorNome(interno, "Diesel S-10 Aditivado");
  const arlaGranelInterno = somaLitrosPorNome(interno, "Arla 32 - Granel");
  const dieselExterno = somaLitrosPorNome(externo, "Diesel S-10 Comum") + somaLitrosPorNome(externo, "Diesel S-10 Aditivado");
  const arlaGranelExterno = somaLitrosPorNome(externo, "Arla 32 - Granel");
  const arlaBaldeExterno = somaLitrosBalde(externo, "Arla 32 - Balde");
  const gasolinaExterno = somaLitrosPorNome(externo, "Gasolina Comum");


  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6">
      <h2 className="font-bold text-slate-200 mb-6 tracking-tight">Consumo Interno vs Externo (Litros)</h2>
      
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie 
                data={dados} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                innerRadius={60} 
                outerRadius={70} 
                paddingAngle={5} 
                stroke="none"
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {dados.map((_, index) => (
                  <Cell key={index} fill={CORES[index]} className="hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  border: '1px solid #334155', 
                  borderRadius: '12px',
                  color: '#f1f5f9' 
                }}
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(value) => [`${Number(value).toLocaleString("pt-BR")} L`, "Total"]} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col justify-center gap-3 min-w-[190px] text-[13px] bg-[#0F172A]/50 p-4 rounded-xl border border-slate-800/50">
          <p className="font-black text-sky-400 uppercase text-[10px] tracking-widest">Posto Interno</p>
          <div className="flex justify-between text-slate-300">
            <span>Diesel</span>
            <span className="font-bold text-white">{dieselInterno.toLocaleString("pt-BR")} L</span>
          </div>
          {arlaGranelInterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Granel</span>
              <span className="font-bold text-white">{arlaGranelInterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}


          <hr className="border-slate-800 my-1" />


          <p className="font-black text-amber-500 uppercase text-[10px] tracking-widest">Posto Externo</p>
          <div className="flex justify-between text-slate-300">
            <span>Diesel</span>
            <span className="font-bold text-white">{dieselExterno.toLocaleString("pt-BR")} L</span>
          </div>
          {arlaGranelExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Granel</span>
              <span className="font-bold text-white">{arlaGranelExterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}
          {arlaBaldeExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Balde</span>
              <span className="font-bold text-white">{arlaBaldeExterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}
          {gasolinaExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Gasolina</span>
              <span className="font-bold text-white">{gasolinaExterno.toLocaleString("pt-BR")} L</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}