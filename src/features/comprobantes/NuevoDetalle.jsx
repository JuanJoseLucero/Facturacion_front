import { useRef, useState } from "react";
import { getProduct4cempresa } from "../../services/apiBack";

export default function NuevoDetalle({
  onAgregarFila,
  onAgregarProducto,
  cempresa,
}) {
  {
    /**Obtengo una referencia del DOM mediante useREf*/
  }
  const dialogRef = useRef();

  {
    /** la siguiente linea es iguala  a if (dialogRef.current) {
    dialogRef.current.showModal();
    } que quiere decir que solo si el dialogo es distinto de null 
    o undefined*/
  }

  const [productos, setProductos] = useState([]);

  const abrirDialogo = () => {
    dialogRef.current?.showModal();
    listarProductos();
  };

  const cerrarDialogo = () => {
    dialogRef.current?.close();
  };

  const listarProductos = async () => {
    try {
      const empresaObjecto = { cempresa };
      const data = await getProduct4cempresa(empresaObjecto);
      console.log("Lista de productos");
      console.log(data);
      setProductos(data.lstProductos);
    } catch (error) {
      console.log(error);
    }
  };

  const onAgregar = (producto) => {
    onAgregarProducto(producto);
    cerrarDialogo();
  };

  /**
  const onAgregar = (producto) => {
    console.log("Producto agregado:", producto);
    onAgregarFila(producto);
    cerrarDialogo();
  };
  */

  return (
    <div>
      <button onClick={abrirDialogo}>Nuevo detalle</button>
      <dialog ref={dialogRef}>
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Valor</th>
              <th>IVA</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.cproducto}>
                <td>{prod.descripcion}</td>
                <td>{prod.valor}</td>
                <td>{prod.iva}</td>
                <td>
                  <button onClick={() => onAgregar(prod)}>Agregar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={cerrarDialogo}>Cerrar</button>
      </dialog>
    </div>
  );
}
