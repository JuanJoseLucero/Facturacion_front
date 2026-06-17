import { useAuth } from "../features/auth/KeycloakProvider";

export default function Home() {
  const { keycloak } = useAuth();
  const username = keycloak?.tokenParsed?.preferred_username || "Usuario";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#2563eb" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>

      <h2 className="mb-2 text-2xl font-bold text-gray-800">
        Bienvenido, {username}
      </h2>
      <p className="mb-8 text-gray-500 max-w-md">
        Sistema de Facturaci&oacute;n Electr&oacute;nica &mdash; SRI Ecuador
      </p>

      <div className="rounded-2xl bg-white p-8 shadow-md border border-gray-200 max-w-lg">
        <p className="text-gray-600 leading-relaxed">
          Selecciona una opci&oacute;n en el men&uacute; lateral para comenzar.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-gray-600">
            <span className="text-blue-600 font-bold">&#9881;</span> Configuraci&oacute;n
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-gray-600">
            <span className="text-blue-600 font-bold">&#128100;</span> Clientes
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-gray-600">
            <span className="text-blue-600 font-bold">&#128230;</span> Productos
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-gray-600">
            <span className="text-blue-600 font-bold">&#128203;</span> Facturaci&oacute;n
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-400">
        &copy; CJ CONFECCIONES
      </p>
    </div>
  );
}
