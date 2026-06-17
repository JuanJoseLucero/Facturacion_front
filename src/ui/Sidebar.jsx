import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/KeycloakProvider";
import {
  IconConfig,
  IconUserPlus,
  IconUsers,
  IconBoxPlus,
  IconPackage,
  IconReceipt,
  IconFileText,
  IconLogout,
  IconHome,
  IconMenu,
  IconX,
} from "./icons";

const navItems = [
  { to: "/", icon: IconHome, label: "Inicio", exact: true },
  { to: "/configuracion/emisor", icon: IconConfig, label: "Configuraci\u00f3n", prefix: "/configuracion" },
  { to: "/cliente/nuevocliente", icon: IconUserPlus, label: "Nuevo Cliente", prefix: "/cliente" },
  { to: "/cliente/listarClientes", icon: IconUsers, label: "Listar Clientes", prefix: "/cliente" },
  { to: "/producto/nuevoproducto", icon: IconBoxPlus, label: "Nuevo Producto", prefix: "/producto" },
  { to: "/producto/listarProductos", icon: IconPackage, label: "Listar Productos", prefix: "/producto" },
  { to: "/comprobantes/factura", icon: IconReceipt, label: "Factura", prefix: "/comprobantes" },
  { to: "/procesos/listarRide", icon: IconFileText, label: "Listar Rides", prefix: "/procesos" },
];

export default function Sidebar({ isOpen, onToggle, isMobile }) {
  const { keycloak, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return item.prefix ? location.pathname.startsWith(item.prefix) : location.pathname.startsWith(item.to);
  };

  const sidebarContent = (
    <div className={`flex h-full flex-col bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? "w-60" : "w-16"}`}>
      <div className={`flex items-center border-b border-gray-200 ${isOpen ? "justify-between px-4" : "justify-center"} h-14`}>
        {isOpen && (
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-600">
            <IconHome size={22} />
            <span>FE</span>
          </Link>
        )}
        {!isOpen && (
          <Link to="/" className="flex items-center">
            <IconHome size={22} className="text-blue-600" />
          </Link>
        )}
        <button onClick={onToggle} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors">
          {isOpen ? <IconX size={18} /> : <IconMenu size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => isMobile && onToggle()}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              } ${!isOpen && "justify-center"}`}
              title={item.label}
            >
              <span className={active ? "text-blue-600" : "text-gray-500"}>
                <Icon size={20} />
              </span>
              {isOpen && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isAuthenticated && (
        <div className={`border-t border-gray-200 ${isOpen ? "px-4" : "px-2"} py-3`}>
          {isOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-xs font-semibold text-blue-600">
                    {keycloak?.tokenParsed?.preferred_username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="truncate text-sm text-gray-600">
                  {keycloak?.tokenParsed?.preferred_username}
                </span>
              </div>
              <button
                onClick={() => keycloak?.logout()}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <IconLogout size={16} />
                Cerrar sesi&oacute;n
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xs font-semibold text-blue-600">
                  {keycloak?.tokenParsed?.preferred_username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => keycloak?.logout()}
                className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                title="Cerrar sesi\u00f3n"
              >
                <IconLogout size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={onToggle} />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
}
