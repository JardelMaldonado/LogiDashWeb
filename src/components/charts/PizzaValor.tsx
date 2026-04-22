"use client";


import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Abastecimento } from "@/src/types/abastecimento";
import { mediaPrecoUnitario, mediaPrecoUnitarioBalde } from "@/src/lib/helpers";


export const CORES = ["#0ea5e9", "#f59e0b"];


interface Props {
  interno: Abastecimento[];
  externo: Abastecimento[];
}


export function PizzaValor({ interno, externo }: Props) {
  const valorInterno = interno.reduce((acc, x) => acc + (x.valorTotalCalculado || 0), 0);
  const valorExterno = externo.reduce((acc, x) => acc + (x.valorTotalCalculado || 0), 0);


  const dados = [
    { name: "Interno", value: parseFloat(valorInterno.toFixed(2)) },
    { name: "Externo", value: parseFloat(valorExterno.toFixed(2)) },
  ];


  const mediaDieselInterno     = mediaPrecoUnitario(interno, "Diesel S-10 Comum");
  const mediaDieselExterno     = mediaPrecoUnitario(externo, "Diesel S-10 Comum");
  const mediaArlaGranelExterno = mediaPrecoUnitario(externo, "Arla 32 - Granel");
  const mediaArlaBaldeExterno  = mediaPrecoUnitarioBalde(externo, "Arla 32 - Balde");
  const mediaGasolinaExterno   = mediaPrecoUnitario(externo, "Gasolina Comum");


  return (
    <div className="bg-[#1E293B] rounded-2xl shadow-xl border border-slate-800 p-6">
      <h2 className="font-bold text-slate-200 mb-6 tracking-tight">Gasto Interno vs Externo (R$)</h2>
      
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
                  <Cell key={index} fill={CORES[index]} className="hover:opacity-80 transition-opacity cursor-pointer" />
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
                formatter={(value) => [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Total"]} 
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>


        <div className="flex flex-col justify-center gap-3 min-w-[200px] text-[12px] bg-[#0F172A]/50 p-4 rounded-xl border border-slate-800/50">
          <p className="font-black text-sky-400 uppercase text-[10px] tracking-widest">Preço Médio Interno</p>
          {mediaDieselInterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Diesel</span>
              <span className="font-bold text-white">R$ {mediaDieselInterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}


          <hr className="border-slate-800 my-1" />


          <p className="font-black text-amber-500 uppercase text-[10px] tracking-widest">Preço Médio Externo</p>
          {mediaDieselExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Diesel</span>
              <span className="font-bold text-white">R$ {mediaDieselExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          {mediaArlaGranelExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Granel</span>
              <span className="font-bold text-white">R$ {mediaArlaGranelExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          {mediaArlaBaldeExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Arla Balde</span>
              <span className="font-bold text-white">R$ {mediaArlaBaldeExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}
          {mediaGasolinaExterno > 0 && (
            <div className="flex justify-between text-slate-300">
              <span>Gasolina</span>
              <span className="font-bold text-white">R$ {mediaGasolinaExterno.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/L</span>
            </div>
          )}


          <hr className="border-slate-800 my-1" />


          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>TOTAL GERAL</span>
            <span className="font-bold text-emerald-400">R$ {(valorInterno + valorExterno).toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}