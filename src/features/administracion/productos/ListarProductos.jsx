import React from "react";
import { getProducts } from "../../../services/apiBack";
import { getAuthToken } from "../../auth/authService";
import { useLoaderData, useNavigate } from "react-router-dom";

export default function ListarProductos() {
  const data = useLoaderData();
  const navigate = useNavigate();
  if (!data || !data.lstProductos) {
    return <div>No se encontraton productos</div>;
  }

  function handleEditar(producto) {
    try {
      return navigate(`/producto/editar/${producto.cproducto}`);
    } catch (Error) {
      console.error(Error);
    }
  }

  return (
    <div>
      <h2>ListarProductos</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Código SRI</th>
            <th>Código SRI Auxiliar</th>
            <th>Descripción</th>
            <th>Valor</th>
            <th>Iva</th>
          </tr>
        </thead>
        <tbody>
          {data.lstProductos.map((producto) => (
            <tr key={producto.cproducto}>
              <td>{producto.productosri}</td>
              <td>{producto.productosri2}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.valor}</td>
              <td>{producto.iva}</td>
              <td>
                <button onClick={() => handleEditar(producto)}>Editar</button>
                <button onClick={() => handleEliminar(producto)}>
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
    const data = await getProducts(cempresa);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function handleEliminar(producto) {
  console.log(producto);
}
