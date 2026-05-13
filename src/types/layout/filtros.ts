export interface FiltrosProps {
  mobile?: boolean;
  placas: string[];
  motoristas: string[];
  filtroPlaca: string;
  filtroMotorista: string;
  temFiltro: boolean;
  dataInicio: string;
  dataFim: string;
  onFiltroPlaca: (v: string) => void;
  onFiltroMotorista: (v: string) => void;
  onLimpar: () => void;
  onFecharDrawer?: () => void;
  onAbrirCalendario?: () => void;
}
