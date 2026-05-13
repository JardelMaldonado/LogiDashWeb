import { PostoRanking, MotoristaRanking } from "./ranking";
import { PrecoDiario } from "./precoDiario";
import { GastoDiario } from "./gastoDiario";

export interface DashboardData {
  totalGeral: number;
  totalLitros: number;
  totalAbastecimentos: number;
      todasPlacas: string[];
    todosMotoristas: string[];
  consumo: {
    litrosInterno: number;
    litrosExterno: number;
    dieselInterno: number;
    arlaGranelInterno: number;
    dieselExterno: number;
    arlaGranelExterno: number;
    arlaBaldeExterno: number;
    gasolinaExterno: number;
  };
  precoMedio: {
    dieselInterno: number;
    dieselExterno: number;
    arlaGranelExterno: number;
    arlaBaldeExterno: number;
    gasolinaExterno: number;
    valorInternoTotal: number;
    valorExternoTotal: number;
  };
  rankingPostos: PostoRanking[];
  rankingMotoristas: MotoristaRanking[];
  gastoDiario: GastoDiario[];
  precoDieselDiario: PrecoDiario[];
}
