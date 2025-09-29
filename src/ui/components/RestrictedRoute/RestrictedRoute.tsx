import { Navigate } from "react-router-dom";
import { useMainDataContext } from "../Context/useMainDataContext";
import { use, useEffect, useState } from "react";
import { Loader } from "../Loader/Loader";
/**
 * - If the route is restricted and the user is logged in, render a <Navigate> to redirectTo
 * - Otherwise render the component
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
