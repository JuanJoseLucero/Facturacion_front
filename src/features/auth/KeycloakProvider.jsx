import { createContext, useContext, useEffect, useRef, useState } from "react";
import Keycloak from "keycloak-js";
import { setAuthToken } from "./authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function KeycloakProvider({ children }) {
  const keycloakRef = useRef(null); // 🔒 instancia única
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!keycloakRef.current) {
      keycloakRef.current = new Keycloak({
        url: "http://localhost:8183/",
        realm: "cjconfecciones",
        clientId: "facturacion-client",
      });

      keycloakRef.current
        .init({ onLoad: "login-required" })
        .then((authenticated) => {
          setAuthToken(keycloakRef.current.token);
          setIsAuthenticated(authenticated);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Keycloak init error", err);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ keycloak: keycloakRef.current, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
