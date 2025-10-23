import { useLocation } from "react-router-dom";

export function useValidatorRoute() {
    const location = useLocation();
    const publicRoutes = ["/login", "/register", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    const adminRoutes = ["/admin", "/admin/users", "/admin/settings"];
    const isAdminRoute = adminRoutes.includes(location.pathname);

    const userRoutes = ["/profile", "/settings", "/", "/about", "/"];
    const isUserRoute = userRoutes.includes(location.pathname);
    return { isPublicRoute, isAdminRoute, isUserRoute };
}