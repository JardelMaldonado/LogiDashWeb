"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Abastecimento } from "@/src/types/abastecimento";

interface Props { dados: Abastecimento[]; }


export function PrecoDiesel({ dados }: Props) {
 const precoDieselDiario = Object.values(
  dados.filter(x => x.pontoVenda?.postoInterno === false)
   .reduce((acc, x) => {
    const dia = x.data.substring(0, 10);
    const itensDiesel = x.items?.filter(i => i.nome.toLowerCase().includes("diesel")) || [];
    if (itensDiesel.length === 0) return acc;
    if (!acc[dia]) acc[dia] = { dia, somaPrecos: 0, quantidade: 0 };
    itensDiesel.forEach(i => { acc[dia].somaPrecos += i.valorUnitario || 0; acc[dia].quantidade += 1; });
    return acc;
   }, {} as Record<string, { dia: string; somaPrecos: number; quantidade: number }>)
 ).map(x => ({ dia: x.dia, preco: parseFloat((x.somaPrecos / x.quantidade).toFixed(4)) }))
  .sort((a, b) => a.dia.localeCompare(b.dia));


 return (
  <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6 mb-8">
   <div className="flex items-center justify-between mb-6">
    <div>
     <h2 className="font-bold text-slate-200 tracking-tight">Preço Médio do Diesel</h2>
     <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-semibold">Postos Externos</p>
    </div>
    <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">
      <span className="text-[10px] font-black uppercase tracking-wider">R$ / Litro</span>
    </div>
   </div>


   <ResponsiveContainer width="100%" height={300}>
    <LineChart data={precoDieselDiario} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>

     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
     
     <XAxis 
      dataKey="dia" 
      tickFormatter={(v) => v.substring(8, 10) + "/" + v.substring(5, 7)} 
      tick={{ fontSize: 11, fill: '#64748b' }} 
      axisLine={{ stroke: '#334155' }}
      tickLine={false}
     />
     
     <YAxis 
      domain={["auto", "auto"]} 
      tickFormatter={(v) => `R$${v.toFixed(2)}`} 
      tick={{ fontSize: 11, fill: '#64748b' }} 
      axisLine={false}
      tickLine={false}
      width={60}
     />


     <Tooltip 
      contentStyle={{ 
        backgroundColor: '#0F172A', 
        border: '1px solid #334155', 
        borderRadius: '12px',
        fontSize: '12px'
      }}
      itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
      formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 3 })}/L`, "Preço Médio"]} 
      labelFormatter={(label) => `Data: ${label.substring(8, 10)}/${label.substring(5, 7)}`} 
     />


     <Line 
      type="monotone" 
      dataKey="preco" 
      stroke="#f59e0b" 
      strokeWidth={3} 
      dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#1E293B' }} 
      activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }} 
     />
    </LineChart>
   </ResponsiveContainer>
  </div>
 );
}