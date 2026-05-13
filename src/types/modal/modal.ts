import { UsuarioRequest, UsuarioResponse } from "../usuario/usuario";

export interface ModalProps {
  usuario?: UsuarioResponse;
  onSalvar: (data: UsuarioRequest) => void;
  onFechar: () => void;
  loading: boolean;
}
