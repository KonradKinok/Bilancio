import { Navigate } from "react-router-dom";
import { useMainDataContext } from "../Context/useMainDataContext";
import { Loader } from "../Loader/Loader";
/**
 * Komponent chronionej trasy.
 * - Jeśli użytkownik jest zalogowany, renderuje przekazany komponent.
 * - Jeśli użytkownik nie jest zalogowany, przekierowuje na podany adres (redirectTo).
 * - Jeśli trwa ładowanie stanu uwierzytelnienia, pokazuje Loader.
 */
export interface RouteProps {
  component: React.ElementType;
  redirectTo?: string;
}

export const RestrictedRoute: React.FC<RouteProps> = ({
  component: Component,
  redirectTo = "/",
}) => {
  const { auth } = useMainDataContext();
  const { userDb, loadingAuth } = auth;

  if (loadingAuth) {
    return <Loader />;
  }
  return userDb ? <Component /> : <Navigate to={redirectTo} />;
};
