import { useState } from "react";
import { getProduct4cempresa } from "../../services/apiBack";

export default function NuevoDetalle({ onAgregarProducto, cempresa }) {
  const [abierto, setAbierto] = useState(false);
  const [productos, setProductos] = useState([]);

  const abrirDialogo = async () => {
    setAbierto(true);
    try {
      const data = await getProduct4cempresa({ cempresa });
      setProductos(data.lstProductos || []);
    } catch {
      setProductos([]);
    }
  };

  const onAgregar = (producto) => {
    onAgregarProducto(producto);
    setAbierto(false);
  };

  if (!abierto) {
    return (
      <button
        onClick={abrirDialogo}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo Detalle
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAbierto(false)}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Seleccionar Producto</h3>
          <button
            onClick={() => setAbierto(false)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pr-3">Descripci\u00f3n</th>
                <th className="pb-3 pr-3 text-right">Valor</th>
                <th className="pb-3 pr-3 text-right">IVA</th>
                <th className="pb-3 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                    No hay productos disponibles
                  </td>
                </tr>
              ) : (
                productos.map((prod) => (
                  <tr key={prod.cproducto} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-3 text-gray-700">{prod.descripcion}</td>
                    <td className="py-3 pr-3 text-right font-medium text-gray-800">${parseFloat(prod.valor).toFixed(2)}</td>
                    <td className="py-3 pr-3 text-right text-gray-600">{prod.iva}%</td>
                    <td className="py-3">
                      <button
                        onClick={() => onAgregar(prod)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setAbierto(false)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
