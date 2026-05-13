export interface PostoRanking {
  nome: string;
  litros: number;
  valor: number;
  precoDiesel: number;
}
export interface MotoristaRanking {
  nome: string;
  litros: number;
  valor: number;
  abastecimentos: number;
  placaPrincipal: string;
}
export interface RankingPostosProps {
  dados: PostoRanking[];
}
export interface RankingMotoristasProps {
  dados: MotoristaRanking[];
}
export interface TooltipPostosProps {
  active?: boolean;
  payload?: { payload: PostoRanking }[];
}

export interface TooltipMotoristasProps {
  active?: boolean;
  payload?: { payload: MotoristaRanking }[];
}
