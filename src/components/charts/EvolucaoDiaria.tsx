"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Abastecimento } from "@/src/types/abastecimento";
import { useState } from "react";

interface Props { dados: Abastecimento[]; }


export function EvolucaoDiaria({ dados }: Props) {
 const [metrica, setMetrica] = useState<"valor" | "litros">("valor");


 const gastoDiario = Object.values(
  dados.reduce((acc, x) => {
   const dia = x.data.substring(0, 10);
   if (!acc[dia]) acc[dia] = { dia, valor: 0, litros: 0 };
   acc[dia].valor  += x.valorTotalCalculado || 0;
   acc[dia].litros += x.litros || 0;
   return acc;
  }, {} as Record<string, { dia: string; valor: number; litros: number }>)
 ).sort((a, b) => a.dia.localeCompare(b.dia));


 return (
  <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6 mb-8">
   <div className="flex items-center justify-between mb-6">
    <h2 className="font-bold text-slate-200 tracking-tight">Evolução Diária</h2>
    
    <div className="flex gap-2 bg-[#0F172A] p-1 rounded-xl border border-slate-700">
     <button 
      onClick={() => setMetrica("valor")} 
      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
        metrica === "valor" 
        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
        : "text-slate-500 hover:text-slate-300"
      }`}
     >
      Valor R$
     </button>
     <button 
      onClick={() => setMetrica("litros")} 
      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
        metrica === "litros" 
        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
        : "text-slate-500 hover:text-slate-300"
      }`}
     >
      Litros
     </button>
    </div>
   </div>


   <ResponsiveContainer width="100%" height={300}>
    <LineChart data={gastoDiario} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
     
     <XAxis 
      dataKey="dia" 
      tickFormatter={(v) => v.substring(8, 10) + "/" + v.substring(5, 7)} 
      tick={{ fontSize: 11, fill: '#64748b' }} 
      axisLine={{ stroke: '#334155' }}
      tickLine={false}
     />
     
     <YAxis 
      tickFormatter={(v) => metrica === "valor" ? `R$${v}` : `${v}L`} 
      tick={{ fontSize: 11, fill: '#64748b' }} 
      axisLine={false}
      tickLine={false}
     />
     
     <Tooltip 
      contentStyle={{ 
        backgroundColor: '#0F172A', 
        border: '1px solid #334155', 
        borderRadius: '12px',
        fontSize: '12px',
        color: '#f1f5f9'
      }}
      itemStyle={{ fontWeight: 'bold' }}
      formatter={(value) => metrica === "valor" 
        ? [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Valor"] 
        : [`${Number(value).toLocaleString("pt-BR")} L`, "Litros"]
      } 
      labelFormatter={(label) => `Dia ${label.substring(8, 10)}/${label.substring(5, 7)}`} 
     />


     <Line 
      type="monotone" 
      dataKey={metrica} 
      stroke={metrica === "valor" ? "#10b981" : "#0ea5e9"} 
      strokeWidth={3} 
      dot={{ r: 4, fill: metrica === "valor" ? "#10b981" : "#0ea5e9", strokeWidth: 2, stroke: '#1E293B' }} 
      activeDot={{ r: 6, strokeWidth: 0 }} 
     />
    </LineChart>
   </ResponsiveContainer>
  </div>
 );
}