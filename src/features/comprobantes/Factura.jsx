import React, { useEffect, useState } from "react";
import {
  getClient4Identification,
  getInitFactura,
  sendFactura,
} from "../../services/apiBack";
import { getAuthToken } from "../auth/authService";
import { useLoaderData } from "react-router-dom";
import NuevoDetalle from "./NuevoDetalle";

export default function Factura() {
  const initData = useLoaderData();
  const {
    cempresa,
    contribuyenteEspecial,
    direccionEstablecimiento,
    direccionMatiz,
    nombreComercial,
    razonSocial,
    ruc,
  } = initData.empresa;
  const [rowsDetalle, setRows] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [subtotal0, setSubtotal0] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [cpersonaCliente, setCpersonaCliente] = useState(null);
  const [formaPago, setFormaPago] = useState(0);

  useEffect(() => {
    const sumaValorUnitario = rowsDetalle.reduce(
      (acc, row) => acc + parseFloat(row.valorUnitario || 0),
      0
    );

    setSubtotal(sumaValorUnitario.toFixed(2));
    setSubtotal0(sumaValorUnitario.toFixed(2)); // Aquí puedes cambiar la lógica si deseas separar 0%
    setValorTotal(sumaValorUnitario.toFixed(2)); // Aquí puedes sumar impuestos si lo deseas
  }, [rowsDetalle]);

  const addProductoFromDialog = (producto) => {
    const exists = rowsDetalle.some((row) => row.codigo === producto.cproducto);

    if (exists) {
      alert("El producto ya ha sido agregado.");
      return;
    }

    setRows([
      ...rowsDetalle,
      {
        cantidad: 1,
        codigo: producto.cproducto,
        descripcion: producto.descripcion,
        precioUnitario: producto.valor,
        valorUnitario: producto.valor.toFixed(2),
      },
    ]);
  };

  const addRow = (producto) => {
    setRows([
      ...rowsDetalle,
      {
        cantidad: 1,
        codigo: producto.cproducto,
        descripcion: producto.descripcion,
        precioUnitario: producto.valor,
        valorUnitario: producto.valor,
      },
    ]);
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = rowsDetalle.map((row, i) => {
      if (i === index) {
        const updatedRow = { ...row, [name]: value };
        // Si cambiamos la cantidad, recalculamos valorUnitario
        if (name === "cantidad") {
          const cantidad = parseFloat(value) || 0;
          const precioUnitario = parseFloat(row.precioUnitario) || 0;
          updatedRow.valorUnitario = (cantidad * precioUnitario).toFixed(2);
        }
        return updatedRow;
      }
      return row;
      //i === index ? { ...row, [event.target.name]: event.target.value } : row;
    });
    setRows(updatedRows);
  };

  const [identificacion, setIdentificacion] = useState("");
  const [razonSocialComprador, setRazonSocialComprador] = useState("");
  const [direccionComprador, setDireccionComprador] = useState("");

  const buscarComprador = async () => {
    try {
      const data = await getClient4Identification({ identificacion });
      setRazonSocialComprador(data.razonSocial);
      setDireccionComprador(data.direccion);
      setCpersonaCliente(data.cpersona_cliente);
    } catch (error) {
      console.log("Error al buscar comprador:", error);
    }
  };

  const handleFormaPago = (event) => {
    const value = event.target.value;
    const text = event.target.options[event.target.selectedIndex].text;
    setFormaPago(value);
    console.log("Valor:", value);
    console.log("Texto:", text);
    console.log("Opción completa:", { value, text });
  };

  const createFactura = async () => {
    try {
      const factura = {
        cempresa: cempresa,
        cpersona_cliente: cpersonaCliente,
        productos: rowsDetalle.map((row) => ({
          codigo: row.codigo,
          cantidad: Number(row.cantidad),
        })),
        infoTributaria: {
          ruc: ruc,
        },
        infoFactura: {
          identificacionComprador: identificacion,
        },
        formaPago: {
          codformaPago: formaPago,
        },
      };
      console.log("Factura a enviar:", factura);
      const data = await sendFactura(factura);
      console.log(data);
      if (data.error === "0" && data.ride) {
        descargarPDF(data.ride, "factura.pdf");
      } else {
        window.alert(data.mensaje);
      }
    } catch (error) {
      console.log("Error al buscar comprador:", error);
    }
  };

  const descargarPDF = (base64String, nombreArchivo = "factura.pdf") => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      Datos del Emisor RUC: {ruc}
      <br />
      <br />
      Nombre Comercial: {nombreComercial}
      <br />
      <br />
      Razón Social, nombres y apellidos: {razonSocial}
      <br />
      <br />
      Contribuyente Especial:{contribuyenteEspecial}
      <br />
      <br />
      Dirección Matriz: {direccionMatiz}
      <br />
      <br />
      Direccion establecimiento: {direccionEstablecimiento}
      <br />
      <br />
      <br />
      <br />
      Identificación del comprobante
      <br />
      <br />
      NRO: 001-001-000000015
      <br />
      <br />
      FECHA DE EMISIÓN (dd/mm/aaaa): <input type="date"></input>
      <br />
      <br />
      <br />
      <br />
      Datos del comprador:
      <br />
      <br />
      RUC/pasaporte/identificación del exterior:{" "}
      <input
        type="text"
        value={identificacion}
        onChange={(e) => setIdentificacion(e.target.value)}
      ></input>
      <button name="button" onClick={buscarComprador}>
        Buscar Comprador
      </button>
      <br />
      <br />
      Razón social / apellidos y nombres:{" "}
      <input type="text" value={razonSocialComprador} readOnly></input>
      <br />
      <br />
      Dirección comprador:{" "}
      <input type="text" value={direccionComprador} readOnly></input>
      <br />
      <br />
      <br />
      <br />
      Detalle de la factura (Moneda: Dólares americanos $$)
      <br />
      <NuevoDetalle
        onAgregarFila={addRow}
        onAgregarProducto={addProductoFromDialog}
        cempresa={cempresa}
      />
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>Cantidad</th>
            <th>Código principal</th>
            <th>Descripción</th>
            <th>Precio Unitario</th>
            <th>Valor Total</th>
          </tr>
        </thead>
        <tbody>
          {rowsDetalle.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  name="cantidad"
                  value={row.cantidad}
                  onChange={(e) => handleChange(index, e)}
                />
              </td>

              <td>
                <input
                  type="text"
                  name="codigo"
                  value={row.codigo}
                  onChange={(e) => handleChange(index, e)}
                  readOnly
                />
              </td>

              <td>
                <input
                  type="text"
                  name="descripcion"
                  value={row.descripcion}
                  onChange={(e) => handleChange(index, e)}
                  readOnly
                />
              </td>

              <td>
                <input
                  type="text"
                  name="precioUnitario"
                  value={row.precioUnitario}
                  onChange={(e) => handleChange(index, e)}
                  readOnly
                />
              </td>

              <td>
                <input
                  type="text"
                  name="valorUnitario"
                  value={row.valorUnitario}
                  onChange={(e) => handleChange(index, e)}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <br />
      Formas de Pago:
      <br />
      <br />
      <select name="button" value={formaPago} onChange={handleFormaPago}>
        <option value="">-- SELECCIONE UNA OPCION --</option>
        <option value="01">SIN UTILIZACION DEL SISTEMA FINANCIERO</option>
        <option value="20">OTROS CON UTILIZACION DEL SISTEMA FINANCIERO</option>
      </select>
      <br />
      <br />
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Descripción</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <br />
      <br />
      <br />
      <br />
      VALORES DETALLADOS
      <br />
      <br />
      SUBTOTAL SIN IMPUESTOS:{" "}
      <input type="text" value={subtotal} readOnly></input>
      <br />
      <br />
      SUBTOTAL 0%: <input type="text" value={subtotal0} readOnly></input>
      <br />
      <br />
      VALOR TOTAL:<input type="text" value={valorTotal} readOnly></input>
      <br />
      <br />
      <button name="button" onClick={createFactura}>
        Enviar
      </button>
      <br />
      <br />
      <button name="button">Cancelar</button>
    </div>
  );
}

export async function loader() {
  const token = await getAuthToken();
  if (!token) throw new Error("No hay token disponible");
  const empresa = { cempresa: 1 };
  const order = await getInitFactura(empresa);
  return order;
}
