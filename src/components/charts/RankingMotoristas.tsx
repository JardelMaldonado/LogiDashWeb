"use client";


import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Abastecimento } from "@/src/types/abastecimento";


interface Props { dados: Abastecimento[]; }


interface MotoristaRanking {
 nome: string;
 litros: number;
 valor: number;
 abastecimentos: number;
 placas: Record<string, number>;
 placaPrincipal: string;
}


interface TooltipProps {
 active?: boolean;
 payload?: { payload: MotoristaRanking }[];
}


function CustomTooltip({ active, payload }: TooltipProps) {
 if (!active || !payload?.length) return null;
 const d = payload[0].payload;
 return (
  <div className="bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-4 text-sm">
   <p className="font-bold text-white mb-3 max-w-[200px] truncate border-b border-slate-800 pb-2">{d.nome}</p>
   <div className="flex flex-col gap-2">
    <div className="flex justify-between gap-6">
     <span className="text-slate-400">Litros</span>
     <span className="font-black text-violet-400">{d.litros.toLocaleString("pt-BR")} L</span>
    </div>
    <div className="flex justify-between gap-6">
     <span className="text-slate-400">Total gasto</span>
     <span className="font-black text-emerald-400">R$ {d.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
    </div>
    <div className="flex justify-between gap-6">
     <span className="text-slate-400">Abastecimentos</span>
     <span className="font-bold text-slate-200">{d.abastecimentos}</span>
    </div>
    <div className="flex justify-between gap-6 border-t border-slate-800 pt-2 mt-1">
     <span className="text-slate-400">Placa principal</span>
     <span className="font-bold text-sky-400 uppercase font-mono">{d.placaPrincipal}</span>
    </div>
   </div>
  </div>
 );
}


export function RankingMotoristas({ dados }: Props) {
 const ranking = Object.values(
  dados.reduce((acc, x) => {
   const nome = x.nomeMotorista?.trim() || "Desconhecido";
   if (!acc[nome]) acc[nome] = { nome, litros: 0, valor: 0, abastecimentos: 0, placas: {}, placaPrincipal: "" };
   acc[nome].litros     += x.litros || 0;
   acc[nome].valor      += x.valorTotalCalculado || 0;
   acc[nome].abastecimentos += 1;
   const placa = x.placa || "N/A";
   acc[nome].placas[placa] = (acc[nome].placas[placa] || 0) + 1;
   return acc;
  }, {} as Record<string, MotoristaRanking>)
 ).map(x => ({
  ...x,
  placaPrincipal: Object.entries(x.placas).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A",
 })).sort((a, b) => b.litros - a.litros).slice(0, 10);


 return (
  <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6 mb-8">
   <div className="flex items-center justify-between mb-6">
    <h2 className="font-bold text-slate-200 tracking-tight">Top 10 Motoristas por Volume</h2>
    <div className="bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full border border-violet-500/20">
      <span className="text-[10px] font-black uppercase tracking-widest">Litros</span>
    </div>
   </div>


   <ResponsiveContainer width="100%" height={400}>
    <BarChart 
     data={ranking} 
     layout="vertical" 
     margin={{ left: 0, right: 40, top: 0, bottom: 0 }}
    >
     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
     
     <XAxis 
      type="number" 
      tickFormatter={(v) => `${v}L`} 
      tick={{ fontSize: 11, fill: '#64748b' }} 
      axisLine={false}
      tickLine={false}
     />
     
     <YAxis 
      type="category" 
      dataKey="nome" 
      width={140} 
      tick={{ fontSize: 11, fill: '#cbd5e1', fontWeight: 500 }} 
      axisLine={{ stroke: '#334155' }}
      tickLine={false}
     />


     <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
     
     <Bar 
      dataKey="litros" 
      fill="#8b5cf6" 
      radius={[0, 6, 6, 0]} 
      barSize={24}
      className="hover:opacity-80 transition-opacity cursor-pointer"
     />
    </BarChart>
   </ResponsiveContainer>
  </div>
 );
}