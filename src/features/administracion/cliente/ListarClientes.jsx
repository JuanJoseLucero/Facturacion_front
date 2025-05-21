import React from "react";
import { getAuthToken } from "../../auth/authService";
import { getClients } from "../../../services/apiBack";
import { useLoaderData } from "react-router-dom";

export default function ListarClientes() {
  const data = useLoaderData();

  if (!data || !data.clientes) {
    return <div> No se encontraton clientes</div>;
  }
  return (
    <div>
      <h2>ListarClientes</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Identificación</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Celular</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.clientes.map((cliente) => (
            <tr key={cliente.cpersona}>
              <td>{cliente.cpersona}</td>
              <td>{cliente.nombres}</td>
              <td>{cliente.apellidos}</td>
              <td>{cliente.identificacion}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.celular}</td>
              <td>
                <button onClick={() => handleEditar(cliente)}>Editar</button>
                <button onClick={() => handleEliminar(cliente)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function loader() {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error("No hay token disponible");
    const cempresa = { cempresa: 1 };
    const listClientes = await getClients(cempresa);
    return listClientes;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function handleEditar(cliente) {
  console.log("Editar cliente:", cliente);
}

function handleEliminar(cliente) {
  console.log("Eliminar cliente ", cliente);
}
