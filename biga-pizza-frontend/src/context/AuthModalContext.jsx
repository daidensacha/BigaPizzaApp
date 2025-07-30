import React, { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openAuthModal = () => setModalOpen(true);
  const closeAuthModal = () => setModalOpen(false);

  return (
    <AuthModalContext.Provider value={{ isModalOpen, openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
