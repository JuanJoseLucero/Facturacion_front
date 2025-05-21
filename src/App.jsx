import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home";
import Emisor from "./features/configuracion/Emisor";
import NuevoCliente, {
  action as NuevoClienteAction,
} from "./features/administracion/cliente/NuevoCliente";
import AppLayout from "./ui/AppLayout";
import NuevoProducto, {
  action as NuevoProductoAction,
  loader as loaderEditarProducto,
} from "./features/administracion/productos/NuevoProducto";
import Factura, {
  loader as facturaLoader,
} from "./features/comprobantes/Factura";
import ListarRide from "./features/procesos/ListarRide";
import { KeycloakProvider } from "./features/auth/KeycloakProvider";
import PrivateRoute from "./features/auth/PrivateRoute";
import ListarClientes, {
  loader as listarClientesLoader,
} from "./features/administracion/cliente/ListarClientes";
import ListarProductos, {
  loader as listarProductosLoader,
} from "./features/administracion/productos/ListarProductos";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/configuracion/emisor",
            element: <Emisor />,
          },
          {
            path: "/cliente/nuevocliente",
            element: <NuevoCliente />,
            action: NuevoClienteAction,
          },
          {
            path: "/cliente/listarClientes",
            element: <ListarClientes />,
            loader: listarClientesLoader,
          },
          {
            path: "/producto/nuevoproducto",
            element: <NuevoProducto key="nuevo" />,
            action: NuevoProductoAction,
          },
          {
            path: "/producto/listarProductos",
            element: <ListarProductos />,
            loader: listarProductosLoader,
          },
          {
            path: "/producto/editar/:id",
            element: <NuevoProducto key="editar" />,
            loader: loaderEditarProducto,
            action: NuevoProductoAction,
          },
          {
            path: "/comprobantes/factura",
            element: <Factura />,
            loader: facturaLoader,
          },
          {
            path: "/procesos/listarRide",
            element: <ListarRide />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <div>
      <KeycloakProvider>
        <RouterProvider router={router} />
      </KeycloakProvider>
    </div>
  );
}
