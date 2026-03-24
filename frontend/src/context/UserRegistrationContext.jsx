import { createContext, useContext, useEffect, useState } from "react";

const UserRegistrationContext = createContext();

export const UserRegistrationProvider = ({ children }) => {
  const [registeredProjects, setRegisteredProjects] = useState({});

useEffect(() => {
  const stored = localStorage.getItem("user_registered_projects");

  if (stored) {
    setRegisteredProjects(JSON.parse(stored));
  }
}, []);


const registerUser = (projectId) => {
  const updated = {
    ...registeredProjects,
    [projectId]: true,
  };

  localStorage.setItem(
    "user_registered_projects",
    JSON.stringify(updated)
  );

  setRegisteredProjects(updated);
};

  const isRegistered = (projectId) => {
    return !!registeredProjects[projectId];
  };

  return (
    <UserRegistrationContext.Provider
      value={{ isRegistered, registerUser }}
    >
      {children}
    </UserRegistrationContext.Provider>
  );
};

export const useUserRegistration = () =>
  useContext(UserRegistrationContext);