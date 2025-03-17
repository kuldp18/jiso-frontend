import { useState, JSX } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavLinkItem {
  path: string;
  label: string;
}

interface NavLinkProps extends NavLinkItem {
  className?: string;
}

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const navLinks: NavLinkItem[] = [
  { path: "/", label: "Home" },
  { path: "/features", label: "Features" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const Navbar = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = (): void => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  const NavLink = ({
    path,
    label,
    className = "",
  }: NavLinkProps): JSX.Element => (
    <Link
      to={path}
      className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${className}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full h-[64px] border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="h-full mx-auto max-w-screen-xl">
        <div className="flex items-center h-full">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-primary"
            >
              Jiso
            </Link>
          </div>

          {/* Desktop navigation - centered */}
          <ul className="hidden md:flex flex-1 items-center justify-center space-x-6 list-none">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink path={link.path} label={link.label} />
              </li>
            ))}
          </ul>

          {/* Actions */}
          <section className="hidden md:flex flex-1 items-center justify-end space-x-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Signup</Button>
            </Link>
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </section>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center ml-auto space-x-2">
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              className="flex items-center justify-center"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <aside className="md:hidden bg-background border-b border-border">
          <nav className="space-y-1 px-4 py-3">
            <ul className="list-none space-y-1">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    path={link.path}
                    label={link.label}
                    className="block py-2"
                  />
                </li>
              ))}
            </ul>
            <section className="pt-2 pb-1 flex flex-col space-y-2">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full">Signup</Button>
              </Link>
            </section>
          </nav>
        </aside>
      )}
    </header>
  );
};

// Extracted theme toggle component to avoid duplication
const ThemeToggle = ({
  isDarkMode,
  toggleTheme,
}: ThemeToggleProps): JSX.Element => (
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleTheme}
    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    className="flex items-center justify-center"
  >
    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </Button>
);

export default Navbar;
