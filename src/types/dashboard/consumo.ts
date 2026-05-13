export interface ConsumoData {
  litrosInterno: number;
  litrosExterno: number;
  dieselInterno: number;
  arlaGranelInterno: number;
  dieselExterno: number;
  arlaGranelExterno: number;
  arlaBaldeExterno: number;
  gasolinaExterno: number;
}
export interface PrecoMedioData {
  dieselInterno: number;
  dieselExterno: number;
  arlaGranelExterno: number;
  arlaBaldeExterno: number;
  gasolinaExterno: number;
  valorInternoTotal: number;
  valorExternoTotal: number;
}
export interface ConsumoProps {
  consumo: ConsumoData;
}
export interface PrecoMedioProps {
  precoMedio: PrecoMedioData;
  consumo: { litrosInterno: number; litrosExterno: number };
}
