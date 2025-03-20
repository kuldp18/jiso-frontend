import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const UnauthenticatedNavLinks = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => {
  const classes = isMobile ? "w-full" : "h-9 rounded-none";

  return (
    <>
      <Link to="/login">
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          className={classes}
        >
          Login
        </Button>
      </Link>
      <Link to="/signup">
        <Button size={isMobile ? "default" : "sm"} className={classes}>
          Signup
        </Button>
      </Link>
    </>
  );
};

export const AuthenticatedNavLinks = ({
  isMobile = false,
}: {
  isMobile?: boolean;
}) => {
  const classes = isMobile ? "w-full" : "h-9 rounded-none";

  return (
    <>
      <Link to="/dashboard">
        <Button size={isMobile ? "default" : "sm"} className={classes}>
          Dashboard
        </Button>
      </Link>

      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className={classes}
      >
        Logout
      </Button>
    </>
  );
};

export const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? (
    <AuthenticatedNavLinks isMobile={isMobile} />
  ) : (
    <UnauthenticatedNavLinks isMobile={isMobile} />
  );
};

export default NavLinks;
