
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, MessageSquare, Book } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b">
      <div className="flex items-center gap-2">
        <div className="flex gap-1 items-center">
          <span className="font-bold text-2xl text-resume-primary">Resume</span>
          <span className="font-bold text-2xl">AI</span>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <Button 
          onClick={() => navigate("/")}
          variant={location.pathname === "/" ? "default" : "ghost"} 
          className="gap-2"
        >
          <FileText size={18} />
          <span>Hồ sơ</span>
        </Button>
        <Button 
          onClick={() => navigate("/jd-analysis")}
          variant={location.pathname === "/jd-analysis" ? "default" : "ghost"} 
          className="gap-2"
        >
          <Book size={18} />
          <span>JD Phân tích</span>
        </Button>
        <Button 
          onClick={() => navigate("/mock-interview")}
          variant={location.pathname === "/mock-interview" ? "default" : "ghost"} 
          className="gap-2"
        >
          <MessageSquare size={18} />
          <span>Phỏng vấn</span>
        </Button>
      </nav>
      
      <div className="md:hidden">
        <Button 
          onClick={() => {}}
          variant="ghost"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
}

export default Header;
