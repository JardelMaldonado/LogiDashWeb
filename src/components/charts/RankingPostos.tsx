"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Abastecimento } from "@/src/types/abastecimento"; 
interface Props { dados: Abastecimento[]; }


interface PostoRanking {
 nome: string;
 litros: number;
 valor: number;
 somaPrecos: number;
 qtdItens: number;
 precoDiesel: number;
}


interface TooltipProps {
 active?: boolean;
 payload?: { payload: PostoRanking }[];
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
     <span className="font-black text-sky-400">{d.litros.toLocaleString("pt-BR")} L</span>
    </div>
    <div className="flex justify-between gap-6">
     <span className="text-slate-400">Total gasto</span>
     <span className="font-black text-emerald-400">R$ {d.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
    </div>
    {d.precoDiesel > 0 && (
     <div className="flex justify-between gap-6 border-t border-slate-800 pt-2 mt-1">
      <span className="text-slate-400">Média Diesel</span>
      <span className="font-bold text-amber-500">R$ {d.precoDiesel.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/L</span>
     </div>
    )}
   </div>
  </div>
 );
}


export function RankingPostos({ dados }: Props) {
 const metrica = "litros";


 const ranking = Object.values(
  dados.reduce((acc, x) => {
   const nome = x.pontoVenda?.razaoSocial?.trim() || "Desconhecido";
   if (!acc[nome]) acc[nome] = { nome, litros: 0, valor: 0, somaPrecos: 0, qtdItens: 0, precoDiesel: 0 };
   acc[nome].litros += x.litros || 0;
   acc[nome].valor  += x.valorTotalCalculado || 0;
   const itensDiesel = x.items?.filter(i => i.nome.toLowerCase().includes("diesel")) || [];
   itensDiesel.forEach(i => {
    acc[nome].somaPrecos += i.valorUnitario || 0;
    acc[nome].qtdItens  += 1;
   });
   return acc;
  }, {} as Record<string, PostoRanking>)
 ).map(x => ({
  ...x,
  precoDiesel: x.qtdItens > 0 ? x.somaPrecos / x.qtdItens : 0,
 })).sort((a, b) => b[metrica] - a[metrica]).slice(0, 10);


 return (
  <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6 mb-8">
   <div className="flex items-center justify-between mb-6">
    <h2 className="font-bold text-slate-200 tracking-tight">Top 10 Postos por Volume</h2>
    <div className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20">
      <span className="text-[10px] font-black uppercase tracking-widest">Postos</span>
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
      tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 500 }} 
      axisLine={{ stroke: '#334155' }}
      tickLine={false}
     />


     <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
     
     <Bar 
      dataKey={metrica} 
      fill="#0ea5e9"
      radius={[0, 6, 6, 0]} 
      barSize={24}
      className="hover:opacity-80 transition-opacity cursor-pointer"
     />
    </BarChart>
   </ResponsiveContainer>
  </div>
 );
}