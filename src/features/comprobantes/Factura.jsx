import { useEffect, useState } from "react";
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
  const [formaPago, setFormaPago] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [razonSocialComprador, setRazonSocialComprador] = useState("");
  const [direccionComprador, setDireccionComprador] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const suma = rowsDetalle.reduce(
      (acc, row) => acc + parseFloat(row.valorUnitario || 0), 0
    );
    setSubtotal(suma.toFixed(2));
    setSubtotal0(suma.toFixed(2));
    setValorTotal(suma.toFixed(2));
  }, [rowsDetalle]);

  const addProductoFromDialog = (producto) => {
    const exists = rowsDetalle.some((row) => row.codigo === producto.cproducto);
    if (exists) {
      alert("El producto ya ha sido agregado.");
      return;
    }
    setRows([...rowsDetalle, {
      cantidad: 1,
      codigo: producto.cproducto,
      descripcion: producto.descripcion,
      precioUnitario: producto.valor,
      valorUnitario: producto.valor.toFixed(2),
    }]);
  };

  const eliminarFila = (index) => {
    setRows(rowsDetalle.filter((_, i) => i !== index));
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    setRows(rowsDetalle.map((row, i) => {
      if (i !== index) return row;
      const updated = { ...row, [name]: value };
      if (name === "cantidad") {
        const cant = parseFloat(value) || 0;
        const pu = parseFloat(row.precioUnitario) || 0;
        updated.valorUnitario = (cant * pu).toFixed(2);
      }
      return updated;
    }));
  };

  const buscarComprador = async () => {
    if (!identificacion.trim()) return;
    setBuscando(true);
    try {
      const data = await getClient4Identification({ identificacion });
      setRazonSocialComprador(data.razonSocial || "");
      setDireccionComprador(data.direccion || "");
      setCpersonaCliente(data.cpersona_cliente);
    } catch {
      alert("Comprador no encontrado");
    } finally {
      setBuscando(false);
    }
  };

  const createFactura = async () => {
    if (!cpersonaCliente) {
      alert("Debe buscar un comprador v\u00e1lido");
      return;
    }
    if (rowsDetalle.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }
    if (!formaPago) {
      alert("Debe seleccionar una forma de pago");
      return;
    }
    setEnviando(true);
    try {
      const factura = {
        cempresa,
        cpersona_cliente: cpersonaCliente,
        productos: rowsDetalle.map((row) => ({
          codigo: row.codigo,
          cantidad: Number(row.cantidad),
        })),
        infoTributaria: { ruc },
        infoFactura: { identificacionComprador: identificacion },
        formaPago: { codformaPago: formaPago },
      };
      const data = await sendFactura(factura);
      if (data.error === "0" && data.ride) {
        descargarPDF(data.ride, "factura.pdf");
        alert("Factura enviada exitosamente");
        limpiar();
      } else {
        alert(data.mensaje || "Error al enviar factura");
      }
    } catch {
      alert("Error al enviar factura");
    } finally {
      setEnviando(false);
    }
  };

  const limpiar = () => {
    setRows([]);
    setIdentificacion("");
    setRazonSocialComprador("");
    setDireccionComprador("");
    setCpersonaCliente(null);
    setFormaPago("");
    setFechaEmision("");
  };

  const descargarPDF = (base64String, nombreArchivo) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0));
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">NUEVA FACTURA</h2>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
        <h3 className="mb-3 text-sm font-semibold text-blue-800 uppercase tracking-wide">Datos del Emisor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
          <div><span className="font-medium text-gray-500">RUC:</span> {ruc}</div>
          <div><span className="font-medium text-gray-500">Raz\u00f3n Social:</span> {razonSocial}</div>
          <div><span className="font-medium text-gray-500">Nombre Comercial:</span> {nombreComercial}</div>
          <div className="md:col-span-2"><span className="font-medium text-gray-500">Direcci\u00f3n Matriz:</span> {direccionMatiz}</div>
          <div><span className="font-medium text-gray-500">Direc. Establecimiento:</span> {direccionEstablecimiento}</div>
          <div><span className="font-medium text-gray-500">Contribuyente Especial:</span> {contribuyenteEspecial}</div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Informaci\u00f3n del Comprobante</h3>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <span className="text-sm text-gray-500">N\u00b0 Factura:</span>
            <span className="ml-2 font-semibold text-gray-800">001-001-000000015</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Fecha de emisi\u00f3n:</span>
            <input
              type="date"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Datos del Comprador</h3>
        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">RUC / Pasaporte / Identificaci\u00f3n</label>
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscarComprador()}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Ingrese identificaci\u00f3n"
              />
            </div>
            <button
              onClick={buscarComprador}
              disabled={buscando}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Raz\u00f3n Social / Apellidos y Nombres</label>
              <input
                type="text"
                value={razonSocialComprador}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Direcci\u00f3n</label>
              <input
                type="text"
                value={direccionComprador}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Detalle de Factura <span className="font-normal normal-case text-gray-400">(USD)</span>
          </h3>
          <NuevoDetalle
            onAgregarProducto={addProductoFromDialog}
            cempresa={cempresa}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="pb-2 pr-2 w-16">Cant.</th>
                <th className="pb-2 pr-2">C\u00f3digo</th>
                <th className="pb-2 pr-2">Descripci\u00f3n</th>
                <th className="pb-2 pr-2 text-right">P/U</th>
                <th className="pb-2 pr-2 text-right">Total</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rowsDetalle.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                    No hay productos agregados. Presione &quot;+ Nuevo Detalle&quot; para agregar.
                  </td>
                </tr>
              ) : (
                rowsDetalle.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        name="cantidad"
                        value={row.cantidad}
                        onChange={(e) => handleChange(index, e)}
                        min="1"
                        className="w-14 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        name="codigo"
                        value={row.codigo}
                        readOnly
                        className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-600"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="text"
                        name="descripcion"
                        value={row.descripcion}
                        readOnly
                        className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-600"
                      />
                    </td>
                    <td className="py-2 pr-2 text-right">
                      <span className="text-gray-700">${parseFloat(row.precioUnitario).toFixed(2)}</span>
                    </td>
                    <td className="py-2 pr-2 text-right">
                      <span className="font-medium text-gray-800">${row.valorUnitario}</span>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => eliminarFila(index)}
                        className="rounded-md p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Forma de Pago</h3>
        <select
          value={formaPago}
          onChange={(e) => setFormaPago(e.target.value)}
          className="w-full md:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="">-- SELECCIONE UNA OPCI\u00d3N --</option>
          <option value="01">SIN UTILIZACI\u00d3N DEL SISTEMA FINANCIERO</option>
          <option value="20">OTROS CON UTILIZACI\u00d3N DEL SISTEMA FINANCIERO</option>
        </select>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">Totales</h3>
        <div className="space-y-1.5 text-right">
          <div className="flex justify-end items-center gap-4 text-sm text-gray-600">
            <span>Subtotal sin impuestos:</span>
            <span className="w-28 text-right font-medium">${subtotal}</span>
          </div>
          <div className="flex justify-end items-center gap-4 text-sm text-gray-600">
            <span>Subtotal 0%:</span>
            <span className="w-28 text-right font-medium">${subtotal0}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2 flex justify-end items-center gap-4">
            <span className="text-base font-semibold text-gray-800">VALOR TOTAL:</span>
            <span className="w-28 text-right text-2xl font-bold text-blue-600">${valorTotal}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={limpiar}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={createFactura}
          disabled={enviando}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {enviando ? (
            <>Enviando...</>
          ) : (
            <>Enviar al SRI</>
          )}
        </button>
      </div>
    </div>
  );
}

export async function loader() {
  const token = await getAuthToken();
  if (!token) throw new Error("No hay token disponible");
  const empresa = { cempresa: 1 };
  return await getInitFactura(empresa);
}
