import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { salvoService } from '../services/api/Api';

const SavedPostsContext = createContext();

export const useSavedPosts = () => {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error('useSavedPosts must be used within a SavedPostsProvider');
  }
  return context;
};

export const SavedPostsProvider = ({ children }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    if (usuario) {
      carregarPoesiasSalvas();
    } else {
      setSavedPosts([]);
    }
  }, [usuario]);

  const carregarPoesiasSalvas = async () => {
    if (!usuario) return;
    
    setLoading(true);
    try {
      const salvos = await salvoService.listarPoemasSalvos(usuario.id);
      const poesiasFormatadas = salvos.map(salvo => ({
        id: salvo.poemaId,
        titulo: salvo.poemaTitulo,
        conteudo: salvo.poemaConteudo,
        categoria: salvo.poemaCategoria,
        autor: salvo.poemaAutor,
        data: salvo.poemaData,
        autor: {
          user: salvo.poemaAutor
        }
      }));
      setSavedPosts(poesiasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar poesias salvas:', error);
      setSavedPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (post) => {
    if (!usuario) return;
    
    try {
      await salvoService.salvarPoema(usuario.id, post.id);
      setSavedPosts(prev => {
        const isAlreadySaved = prev.some(p => p.id === post.id);
        if (isAlreadySaved) return prev;
        return [...prev, post];
      });
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      throw error;
    }
  };

  const removeSavedPost = async (postId) => {
    if (!usuario) return;
    
    try {
      await salvoService.removerPoemaSalvo(usuario.id, postId);
      setSavedPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Erro ao remover post salvo:', error);
      throw error;
    }
  };

  const isPostSaved = (postId) => {
    return savedPosts.some(post => post.id === postId);
  };

  return (
    <SavedPostsContext.Provider value={{ 
      savedPosts, 
      savePost, 
      removeSavedPost, 
      isPostSaved,
      loading,
      carregarPoesiasSalvas 
    }}>
      {children}
    </SavedPostsContext.Provider>
  );
};