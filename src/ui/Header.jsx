import { useAuth } from "../features/auth/KeycloakProvider";
import { IconLogout } from "./icons";

export default function Header() {
  const { keycloak, isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center justify-end rounded-xl bg-white px-6 py-3 shadow-sm border border-gray-100">
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">
                {keycloak?.tokenParsed?.preferred_username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {keycloak?.tokenParsed?.preferred_username}
            </span>
          </div>
          <button
            onClick={() => keycloak?.logout()}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <IconLogout />
            Cerrar sesi&oacute;n
          </button>
        </div>
      )}
    </nav>
  );
}
