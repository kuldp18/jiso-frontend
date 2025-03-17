import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center px-4">
        {/* Logo */}
        <div className="flex-1 flex justify-start">
          <a
            href="/"
            className="flex items-center text-xl font-bold text-primary"
          >
            Jiso
          </a>
        </div>

        {/* Desktop navigation - centered */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-6">
          <a
            href="/"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="/features"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="/about"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Actions */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="flex items-center justify-center"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" size="sm">
            Login
          </Button>
          <Button size="sm">Signup</Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center ml-auto space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="flex items-center justify-center"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="space-y-1 px-4 py-3">
            <a
              href="/"
              className="block text-sm font-medium py-2 text-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="/features"
              className="block text-sm font-medium py-2 text-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="/about"
              className="block text-sm font-medium py-2 text-foreground hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="/contact"
              className="block text-sm font-medium py-2 text-foreground hover:text-primary transition-colors"
            >
              Contact
            </a>
            <div className="pt-2 pb-1 flex flex-col space-y-2">
              <Button variant="outline" className="w-full">
                Login
              </Button>
              <Button className="w-full">Signup</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
