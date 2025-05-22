import React from "react";
import { Form, redirect, useLoaderData, useParams } from "react-router-dom";
import {
  createProduct,
  getProduct4Id,
  updateProduct,
} from "../../../services/apiBack";
import { getAuthToken } from "../../auth/authService";

export default function NuevoProducto() {
  const producto = useLoaderData();
  const { id } = useParams();
  return (
    <div>
      <Form method="POST">
        Código Principal{" "}
        <input
          type="text"
          name="cproducto"
          defaultValue={producto?.cproducto ?? ""}
        ></input>
        <br />
        <br />
        Descripción{" "}
        <input
          type="text"
          name="descripcion"
          defaultValue={producto?.descripcion ?? ""}
        ></input>
        {/**<br />
        <br />
        Tipo de producto:
        <select
          name="tipoProducto"
          defaultValue={producto?.tipoProducto ?? "value2"}
        >
          <option value="value1">BIEN</option>
          <option value="value2" selected>
            SERVICIO
          </option>
        </select>*/}
        <br />
        <br />
        Valor Unitario
        <input
          type="text"
          name="valor"
          defaultValue={producto?.valor ?? ""}
        ></input>
        <br />
        <br />
        <button name="accion" value={id ? "editar" : "guardar"}>
          {id ? "Editar producto" : "Guardar producto"}
        </button>
        <br />
        <br />
        <button name="accion" value="cancelar">
          Cancelar
        </button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const order = {
      ...data,
      iva: 12,
      empresa: 1,
      valor: parseFloat(data.valor),
      cproducto: parseFloat(data.cproducto),
    };

    const accion = formData.get("accion");
    if (accion === "guardar") {
      const responseSaveProducto = await createProduct(order);
      if (responseSaveProducto.error == "0") {
        return redirect(`/producto/listarProductos`);
      } else {
        return null;
      }
    } else if (accion === "editar") {
      const responseEditar = await updateProduct(order);
      if (responseEditar.error == "0") {
        return redirect(`/producto/listarProductos`);
      }
    }
  } catch (error) {
    console.log("error into action");
    console.error(error);
    return null;
  }
}

export async function loader({ params }) {
  if (!params.id) {
    return {
      cproducto: "",
      descripcion: "",
      valor: "",
    };
  }
  const token = await getAuthToken();
  if (!token) throw new Error("No hay token disponible");
  const parametros = { cproducto: parseFloat(params.id) };
  const data = await getProduct4Id(parametros);
  return data;
}
