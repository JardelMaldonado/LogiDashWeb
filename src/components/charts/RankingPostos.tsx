"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { RankingPostosProps, TooltipPostosProps } from "../../types/dashboard/ranking";

function CustomTooltip({ active, payload }: Readonly<TooltipPostosProps>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-4 text-sm">
      <p className="font-bold text-white mb-3 max-w-50 truncate border-b border-slate-800 pb-2">{d.nome}</p>
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
export function RankingPostos({ dados }: Readonly<RankingPostosProps>) {
  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-slate-200 tracking-tight">Top 10 Postos por Volume</h2>
        <div className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20">
          <span className="text-[10px] font-black uppercase tracking-widest">Postos</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dados} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => `${v}L`} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nome" width={140} tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 500 }} axisLine={{ stroke: '#334155' }} tickLine={false} tickFormatter={(v) => v.length > 25 ? v.substring(0, 25) + "..." : v} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="litros" fill="#0ea5e9" radius={[0, 6, 6, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}