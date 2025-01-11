import React, { createContext, useContext, useState } from "react";

// Create the context
const LoadingContext = createContext();

// Create a provider
export const LoadingProvider = ({ children }) => {
  const [isLoad, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoad, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use the loading context
export const useLoading = () => useContext(LoadingContext);
