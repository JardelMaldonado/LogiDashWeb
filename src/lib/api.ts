import axios from 'axios';
import { UsuarioRequest, UsuarioResponse, DashboardData } from '../types/index'; 

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      globalThis.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, senha: string) => {
  const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, senha });
  return response.data;
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

export const fetchDashboard = async ( dataInicial: string, dataFinal: string, placa?: string, motorista?: string): Promise<DashboardData> => {
  const response = await api.get('/dashboard', {
    params: { dataInicial, dataFinal, placa, motorista }
  });
  return response.data;
};