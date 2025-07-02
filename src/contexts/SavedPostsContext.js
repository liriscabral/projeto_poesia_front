import React, { createContext, useContext, useState } from 'react';

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

  const savePost = (post) => {
    setSavedPosts(prev => {
      const isAlreadySaved = prev.some(p => p.id === post.id);
      if (isAlreadySaved) return prev;
      return [...prev, post];
    });
  };

  const removeSavedPost = (postId) => {
    setSavedPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <SavedPostsContext.Provider value={{ savedPosts, savePost, removeSavedPost }}>
      {children}
    </SavedPostsContext.Provider>
  );
};