import { Abastecimento } from "@/src/types/abastecimento";

export function somaLitrosPorNome(lista: Abastecimento[], nomeExato: string) {
  return lista.reduce((acc, x) => {
    const itens = x.items?.filter(i => i.nome === nomeExato) || [];
    return acc + itens.reduce((a, i) => a + (i.quantidade || 0), 0);
  }, 0);
}

export function mediaPrecoUnitario(lista: Abastecimento[], nomeExato: string) {
  const itens = lista.flatMap(x => x.items?.filter(i => i.nome === nomeExato) || []);
  if (itens.length === 0) return 0;
  return itens.reduce((a, i) => a + (i.valorUnitario || 0), 0) / itens.length;
}

export function somaLitrosBalde(lista: Abastecimento[], nomeExato: string) {
  return lista.reduce((acc, x) => {
    const itens = x.items?.filter(i => i.nome === nomeExato) || [];
    return acc + itens.reduce((a, i) => a + (i.quantidade || 0) * 20, 0);
  }, 0);
}

export function mediaPrecoUnitarioBalde(lista: Abastecimento[], nomeExato: string) {
  const itens = lista.flatMap(x => x.items?.filter(i => i.nome === nomeExato) || []);
  if (itens.length === 0) return 0;
  return (itens.reduce((a, i) => a + (i.valorUnitario || 0), 0) / itens.length) / 20;
}