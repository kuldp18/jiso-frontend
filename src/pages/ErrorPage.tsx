import ErrorSvg from "@/assets/404.svg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-background text-foreground">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
        {/* Image */}
        <div className="relative w-full max-w-xs md:max-w-sm">
          <img
            src={ErrorSvg}
            alt="404 Error Illustration"
            className="w-full h-auto drop-shadow-md"
          />

          {/* Animated elements - optional */}
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-primary/10 animate-pulse" />
          <div
            className="absolute -bottom-2 -left-4 w-8 h-8 rounded-full bg-primary/20 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Oops! Page not found
          </h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button className="flex-1 gap-2" onClick={() => navigate("/")}>
            <Home size={16} />
            Home
          </Button>
        </div>

        {/* Help text */}
        <p className="text-sm text-muted-foreground pt-8">
          Need help?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
