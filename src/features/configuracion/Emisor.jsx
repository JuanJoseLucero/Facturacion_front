import React from "react";

export default function Emisor() {
  return (
    <div>
      RUC: <input type="text"></input>
      <br />
      <br />
      Apellidos y Nombres, Razon Social
      <input type="text"></input>
      <br />
      <br />
      Nombre Comercial:
      <input type="text"></input>
      <br />
      <br />
      Direccion Matriz:
      <input type="text"></input>
      <br />
      <br />
      Direccion Establecimiento:
      <input type="text"></input>
      <br />
      <br />
      Codigo establecimiento:
      <input type="text"></input>
      <br />
      <br />
      Codigo punto de emisión:
      <input type="text"></input>
      <br />
      <br />
      Codigo establecimiento:
      <input type="text"></input>
      <br />
      <br />
      Tipo de ambiente:
      <select name="select">
        <option value="value1">PRUEBAS</option>
        <option value="value2" selected>
          PRODUCCION
        </option>
      </select>
      <br />
      <button name="button">Guardar</button>
    </div>
  );
}
