import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { PROFILE } from "../utils/urls";

const isBrowser = () => typeof window !== "undefined";

const ProtectedRoute = ({ children }: { children: any }) => {
  const router = useRouter();
  const isAuthenticated = getCookie("session") != null;
  const unprotectedRoutes = new Set<string>(["/"]);

  if (
    isBrowser() &&
    !isAuthenticated &&
    !unprotectedRoutes.has(router.pathname)
  ) {
    console.log(`Not authenticated, redirected path '${router}'`);
    router.push("/");
  }

  if (isBrowser() && isAuthenticated && unprotectedRoutes.has(router.pathname)) {
    router.push(PROFILE)
  }

  return children;
};

export default ProtectedRoute;