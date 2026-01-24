import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const isAdmin = localStorage.getItem("veloria_admin") === "true";

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
