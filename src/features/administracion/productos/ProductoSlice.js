const initialState = {
  codigoSri: "",
  descripcion: "",
  valor: 0,
  iva: 0,
};

/**Reducer */
export default function productoReducer(state = initialState, action) {
  switch (action.type) {
    case "producto/crearProducto": {
      return {
        ...state,
        codigoSri: action.payload.codigoSri,
        descripcion: action.payload.descripcion,
        valor: action.payload.valor,
        iva: action.payload.iva,
      };
    }
  }
}

/**CUSTOMER LO QUE HACE ES UNICAMENTE DEVOLVER ACCIONES */
/**Este es llamado desde el dispatch para generar la accion */
export function createProduct(codigoSri, descripcion, valor, iva) {
  return {
    type: "producto/crearProducto",
    payload: { codigoSri, descripcion, valor, iva },
  };
}

/**
 * Configurar el store de redux,
 * Y llamar desde la interfaz
 */
