import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/KeycloakProvider";

export default function Header() {
  const { keycloak, isAuthenticated } = useAuth();

  const handleLogout = () => {
    if (keycloak) {
      keycloak.logout(); // Redirige a Keycloak para cerrar sesión
    }
  };

  return (
    <header>
      <Link to="configuracion/emisor">Emisor</Link>
      <br />
      <Link to="cliente/nuevocliente">Nuevo cliente</Link>
      <br />
      <Link to="cliente/listarClientes">Listar Cliente</Link>
      <br />
      <Link to="producto/nuevoproducto">Nuevo producto</Link>
      <br />
      <Link to="producto/listarProductos">Listar producto</Link>
      <br />
      <Link to="comprobantes/factura">Factura</Link>
      <br />
      <Link to="procesos/ListarRide">Listar Ride</Link>
      <br />
      {isAuthenticated && (
        <>
          <span style={{ marginRight: "10px" }}>
            Usuario: {keycloak?.tokenParsed?.preferred_username}
          </span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      )}
    </header>
  );
}
