export interface HeaderProps {
  placas: string[];
  motoristas: string[];
  filtroPlaca: string;
  filtroMotorista: string;
  dataInicio: string;
  dataFim: string;
  onFiltroPlaca: (v: string) => void;
  onFiltroMotorista: (v: string) => void;
  onDataInicio: (v: string) => void;
  onDataFim: (v: string) => void;
  onBuscar: (inicio: string, fim: string, placa?: string, motorista?: string) => void;
  onLimpar: () => void;
}
