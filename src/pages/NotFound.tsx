
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-resume-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Trang không tồn tại</p>
        <Button href="/" variant="default" className="gap-2">
          <Home className="h-4 w-4" />
          <span>Quay lại trang chủ</span>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
