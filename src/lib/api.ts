import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export interface AbastecimentoFiltro {
  pagina: number;
  dataInicial: string;
  dataFinal: string;
}

export const fetchAbastecimentos = async (filtros: AbastecimentoFiltro) => {
  const response = await api.post('/abastecimentos/consultar', filtros);
  console.log('Resposta da API:', response.data);
  return response.data;
};