import { useState, JSX } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLinks from "@/components/app/NavLinks";

interface NavLinkItem {
  path: string;
  label: string;
}

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const navLinks: NavLinkItem[] = [
  { path: "#home", label: "Home" },
  { path: "#about", label: "About" },
  { path: "#features", label: "Features" },
];

const Navbar = (): JSX.Element => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto px-3 sm:px-4">
        <div className="relative flex items-center justify-between h-16 w-full px-2">
          {/* Left - Logo */}
          <div className="flex items-center h-full">
            <Link
              to="/"
              className="text-xl font-bold text-primary leading-none flex items-center"
            >
              Jiso
            </Link>
          </div>

          {/* Center - Nav links (only on landing page) */}
          {isLandingPage && (
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full items-center">
              <ul className="flex gap-6 items-center h-full">
                {navLinks.map((link) => (
                  <li key={link.path} className="flex items-center h-full">
                    <a href={link.path}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Right - Buttons (Mobile) */}
          <div className="flex md:hidden items-center gap-2 h-full">
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              className="h-9 w-9 flex items-center justify-center"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Right (Desktop) */}
          <div className="hidden md:flex items-center gap-3 h-full">
            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <NavLinks />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <aside className="md:hidden bg-background border-t border-border">
          <nav className="px-3 sm:px-4 py-3">
            {isLandingPage && (
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <a href={link.path} className="block py-2">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div
              className={`${
                isLandingPage ? "pt-3" : "pt-0"
              } flex flex-col gap-2`}
            >
              <NavLinks isMobile />
            </div>
          </nav>
        </aside>
      )}
    </header>
  );
};

const ThemeToggle = ({
  isDarkMode,
  toggleTheme,
}: ThemeToggleProps): JSX.Element => (
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleTheme}
    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    className="h-9 w-9 flex items-center justify-center"
  >
    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </Button>
);

export default Navbar;
