import React from "react";
import { Form, redirect } from "react-router-dom";
import { createClient } from "../../../services/apiBack";

export default function NuevoCliente() {
  return (
    <div>
      <Form method="POST">
        Apellidos y Nombres/ Razon Social:{" "}
        <input type="text" name="nombres"></input>
        <br />
        <br />
        Apellidos: <input type="text" name="apellidos"></input>
        <br />
        <br />
        Identificación:
        <select name="tipoIdentificacion">
          <option value="value1">CEDULA</option>
          <option value="value2" selected>
            RUC
          </option>
        </select>
        <br />
        <br />
        Identificación: <input type="text" name="identificacion"></input>
        <br />
        <br />
        Direccion: <input type="text" name="direccion"></input>
        <br />
        <br />
        Telefono convencional: <input type="text" name="telefono"></input>
        <br />
        <br />
        Telefono celular:<input type="text" name="celular"></input>
        <br />
        <br />
        correo electronico:<input type="text" name="email"></input>
        <br />
        <br />
        {/**Se usar el name action y el value guardar para que en el action diferenciar que boton presiono el usuario */}
        <button name="accion" value="guardar">
          Guardar Cliente
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
  };

  const accion = formData.get("accion");

  if (accion === "guardar") {
    console.log("Guardando");
    const responseNewCLient = await createClient(order);
    if (responseNewCLient.error == "0") {
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
