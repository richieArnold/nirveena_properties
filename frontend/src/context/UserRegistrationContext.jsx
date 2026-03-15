import { createContext, useContext, useEffect, useState } from "react";

const UserRegistrationContext = createContext();

export const UserRegistrationProvider = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user_registered");

    if (stored) {
      const parsed = JSON.parse(stored);

      const expiry = 2 * 24 * 60 * 60 * 1000; // 7 days

      if (Date.now() - parsed.time < expiry) {
        setIsRegistered(true);
      } else {
        localStorage.removeItem("user_registered");
        setIsRegistered(false);
      }
    }
  }, []);

  const registerUser = (phone) => {
    const data = {
      phone,
      time: Date.now(),
    };

    localStorage.setItem("user_registered", JSON.stringify(data));
    setIsRegistered(true);
  };

  return (
    <UserRegistrationContext.Provider value={{ isRegistered, registerUser }}>
      {children}
    </UserRegistrationContext.Provider>
  );
};

export const useUserRegistration = () => useContext(UserRegistrationContext);
