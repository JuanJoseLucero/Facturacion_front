import React from "react";
import { Form, redirect, useLoaderData, useParams } from "react-router-dom";
import {
  createClient,
  getCliente4Id,
  updateClients,
} from "../../../services/apiBack";
import { getAuthToken } from "../../auth/authService";

export default function NuevoCliente() {
  const cliente = useLoaderData();
  console.log("DEsde el nuevo cliente");
  console.log(cliente);
  const { id } = useParams();
  return (
    <div>
      <Form method="POST">
        <input
          type="hidden"
          name="cpersona"
          defaultValue={cliente?.cpersona ?? ""}
        ></input>
        Nombres/ Razon Social:{" "}
        <input
          type="text"
          name="nombres"
          defaultValue={cliente?.nombres ?? ""}
        ></input>
        <br />
        <br />
        Apellidos:{" "}
        <input
          type="text"
          name="apellidos"
          defaultValue={cliente?.apellidos ?? ""}
        ></input>
        <br />
        <br />
        Identificación:
        <select name="tipoIdentificacion">
          <option value="NAT">CEDULA</option>
          <option value="JUR" selected>
            RUC
          </option>
        </select>
        <br />
        <br />
        Identificación:{" "}
        <input
          type="text"
          name="identificacion"
          defaultValue={cliente?.identificacion ?? ""}
        ></input>
        <br />
        <br />
        Direccion:{" "}
        <input
          type="text"
          name="direccion"
          defaultValue={cliente?.direccion ?? ""}
        ></input>
        <br />
        <br />
        Telefono convencional:{" "}
        <input
          type="text"
          name="telefono"
          defaultValue={cliente?.telefono ?? ""}
        ></input>
        <br />
        <br />
        Telefono celular:
        <input
          type="text"
          name="celular"
          defaultValue={cliente?.celular ?? ""}
        ></input>
        <br />
        <br />
        correo electronico:
        <input
          type="text"
          name="email"
          defaultValue={cliente?.email ?? ""}
        ></input>
        <br />
        <br />
        {/**Se usar el name action y el value guardar para que en el action diferenciar que boton presiono el usuario */}
        <button name="accion" value={id ? "editar" : "guardar"}>
          {id ? "Editar cliente" : "Guardar cliente"}
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

{
  /***Esta funcion es llamada automaticamente por FORM para leer los 
  datos enviados por un formulario */
}
export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    tipoPersona: data.tipoPersona === "RUC" ? "JUR" : "NAT",
    cempresa: 1,
    cpersona: parseFloat(data.cpersona),
  };

  const accion = formData.get("accion");
  console.log("ESTA ES LA ACCION");
  console.log(accion);

  if (accion === "guardar") {
    console.log("Guardando");
    const responseNewCLient = await createClient(order);
    if (responseNewCLient.error == "0") {
      return redirect(`/cliente/listarClientes`);
    }
    return null;
  } else if (accion === "editar") {
    const responseEditClient = await updateClients(order);
    if (responseEditClient.error == "0") {
      return redirect(`/cliente/listarClientes`);
    }
    return null;
  }

  if (accion === "cancelar") {
    console.log("Cancelar");
    return null;
  }
  //return null; //Siempre el metodo action espera algo de retorno, incluso para saber que termino correctamente
}

export async function loader({ params }) {
  try {
    if (!params.id) {
      return {
        nombres: "",
        apellidos: "",
        identificacion: "",
        direccion: "",
        telefono: "",
        celular: "",
        email: "",
      };
    }
    const token = await getAuthToken();
    if (!token) throw new Error("No hay token disponible");
    const parametros = { cpersona: parseFloat(params.id) };
    const data = await getCliente4Id(parametros);
    return data;
  } catch (Error) {
    console.error(Error);
  }
}
