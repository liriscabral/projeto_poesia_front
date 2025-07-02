// src/services/api.js
import axios from 'axios';


const API_BASE_URL = 'http://localhost:8080'; // Ajuste conforme necessário

const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const categoriaService = {
  listarCategorias: async () => {
    try {
      const response = await Api.get('/categoria');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao listar categorias');
    }
  },

  salvarCategoria: async (categoriaDTO) => {
    try {
      const response = await Api.post('/categoria', categoriaDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao salvar categoria');
    }
  },

  deletarCategoria: async (id, usuarioId) => {
    try {
      await Api.delete(`/categoria/${id}/${usuarioId}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar categoria');
    }
  }
};

export const poemaService = {
  cadastrarPoema: async (poemaDTO) => {
    try {
      const response = await Api.post('/poema', poemaDTO);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar poesia');
    }
  },
  listarPoesias: async () => {
    try {
      const response = await Api.get('/poema');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar poesias');
    }
  }
};

export const curtidaService = {
  curtirPoema: async (poemaId, usuarioId) => {
    try {
      const response = await Api.post('/curtidas', {
        usuarioId,
        poemaId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao curtir poema');
    }
  },

  descurtirPoema: async (poemaId, usuarioId) => {
    try {
      const response = await Api.delete('/curtidas', {
        data: { usuarioId, poemaId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao descurtir poema');
    }
  },

  getContagemCurtidas: async (poemaId) => {
    try {
      const response = await Api.get(`/curtidas/contar/${poemaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar contagem de curtidas');
    }
  },

  getStatusCurtida: async (usuarioId, poemaId) => {
    try {
      const response = await Api.get(`/curtidas/status/${usuarioId}/${poemaId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao verificar status da curtida');
    }
  }
};

export default Api;