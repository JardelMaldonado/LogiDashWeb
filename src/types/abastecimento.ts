export interface ItemAbastecimento {
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface PontoVenda {
  razaoSocial: string;
  postoInterno: boolean;
}

export interface Abastecimento {
  identificador: number;
  data: string;
  placa: string;
  nomeMotorista: string;
  hodometro: number;
  litros: number;
  valorTotalCalculado: number;
  abastecimentoEstornado: number | null;
  motivoRecusa: string | null;
  items: ItemAbastecimento[];
  pontoVenda: PontoVenda;
}