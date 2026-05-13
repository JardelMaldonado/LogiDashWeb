export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}
export interface UsuarioRequest {
  nome: string;
  email: string;
  senha?: string;
  role: string;
}
