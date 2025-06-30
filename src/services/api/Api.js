import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(errorMessage);
  }
};

// Serviço de Categoria
export const categoriaService = {
  listarCategorias: () => handleRequest(api.get('/categoria')),
  salvarCategoria: (categoriaDTO) => handleRequest(api.post('/categoria', categoriaDTO)),
  buscarCategoriaPorId: (id) => handleRequest(api.get(`/categoria/${id}`)),
  deletarCategoria: (id, usuarioId) => handleRequest(api.delete(`/categoria/${id}/${usuarioId}`))
};

// Serviço de Poesia
export const poesiaService = {
  listarPoesias: (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.titulo) params.append('titulo', filtros.titulo);
    if (filtros.autor) params.append('autor', filtros.autor);
    if (filtros.categoriaId) params.append('categoriaId', filtros.categoriaId);
    
    return handleRequest(api.get('/poema', { params }));
  },
  buscarPoesiaPorId: (id) => handleRequest(api.get(`/poema/${id}`)),
  salvarPoesia: (poesiaDTO) => handleRequest(api.post('/poema', poesiaDTO)),
  atualizarPoesia: (id, poesiaDTO) => handleRequest(api.put(`/poema/${id}`, poesiaDTO)),
  deletarPoesia: (id, autorId) => handleRequest(api.delete(`/poema/${id}/${autorId}`)),
  listarPoesiasPorCategoria: (categoriaId) => handleRequest(api.get(`/poema/categoria/${categoriaId}`)),
  listarPoesiasPorAutor: (autorId) => handleRequest(api.get(`/poema/autor/${autorId}`)),
  listarPoesiasPorAutorUsername: (autorId) => handleRequest(api.get(`/poema/autor/username/${autorId}`))
};

// Serviço de Usuário
export const usuarioService = {
  cadastrar: (usuarioDTO) => handleRequest(api.post('/cadastro', usuarioDTO)),
  login: (credenciais) => handleRequest(api.post('/cadastro/login', credenciais)),
  listarUsuarios: () => handleRequest(api.get('/cadastro')),
  buscarUsuarioPorUsername: (username) => handleRequest(api.get(`/cadastro/${username}`)),
  buscarUsuarioPorId: (id) => handleRequest(api.get(`/cadastro/id/${id}`))
};

export { api };