import axios from 'axios';
import { UsuarioRequest, UsuarioResponse, DashboardData } from '../types/index'; 

export const api = axios.create({
  baseURL: '/backend',
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      globalThis.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, senha: string) => {
  const response = await axios.post('/api/auth/login', { email, senha }, {
    withCredentials: true,
  });
  return response.data;
};

export const logout = async () => {
  await axios.post('/api/auth/logout', {}, {
    withCredentials: true,
  });
  globalThis.location.href = '/login';
};

export const listarUsuarios = async (): Promise<UsuarioResponse[]> => {
  const response = await api.get('/usuarios');
  return response.data;
};

export const criarUsuario = async (request: UsuarioRequest): Promise<UsuarioResponse> => {
  const response = await api.post('/usuarios', request);
  return response.data;
};

export const editarUsuario = async (id: number, request: UsuarioRequest): Promise<UsuarioResponse> => {
  const response = await api.put(`/usuarios/${id}`, request);
  return response.data;
};

export const alterarStatusUsuario = async (id: number): Promise<UsuarioResponse> => {
  const response = await api.patch(`/usuarios/${id}/status`);
  return response.data;
};

export const fetchDashboard = async (dataInicial: string, dataFinal: string, placa?: string, motorista?: string): Promise<DashboardData> => {
  const response = await api.get('/dashboard', {
    params: { dataInicial, dataFinal, placa, motorista }
  });
  return response.data;
};