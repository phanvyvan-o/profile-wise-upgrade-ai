
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import useLocalStorage from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

const Upload = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [resumeSections, setResumeSections] = useLocalStorage<ResumeSection[]>("resumeSections", []);

  const handleFileUpload = (file: File) => {
    setResumeFile(file);
    
    // In a real application, we would parse the file content
    // For now, let's just simulate creating sections from an uploaded file
    const mockResumeSections = [
      {
        id: uuidv4(),
        title: "Kinh nghiệm làm việc",
        content: "Senior Developer tại ABC Tech (2018-Hiện tại)\n• Đã làm việc với React và TypeScript để phát triển ứng dụng web\n• Đã thực hiện tái cấu trúc codebase và tối ưu hóa hiệu suất\n\nDeveloper tại XYZ Solutions (2015-2018)\n• Phát triển các ứng dụng web sử dụng JavaScript và jQuery\n• Hợp tác với đội ngũ thiết kế để tạo giao diện người dùng"
      },
      {
        id: uuidv4(),
        title: "Học vấn",
        content: "Cử nhân Khoa học Máy tính\nĐại học ABC (2011-2015)\nTốt nghiệp loại giỏi"
      },
      {
        id: uuidv4(),
        title: "Kỹ năng",
        content: "JavaScript, TypeScript, React, Node.js, HTML, CSS, Git, Agile"
      }
    ];
    
    setResumeSections(mockResumeSections);
    toast.success("CV đã được tải lên và phân tích thành công");
  };

  const handleJobDescriptionFileUpload = (file: File) => {
    setJobDescriptionFile(file);
    
    // Simulate reading the file content
    setJobDescriptionText("Position: Senior Frontend Developer\n\nResponsibilities:\n• Develop and maintain web applications using React, TypeScript, and GraphQL\n• Collaborate with designers and backend developers\n• Create reusable UI components\n\nRequirements:\n• 3+ years of experience with React\n• Strong knowledge of JavaScript and TypeScript\n• Experience with GraphQL and RESTful APIs\n• Experience with version control systems like Git\n• Knowledge of Docker is a plus");
    
    toast.success("Mô tả công việc đã được tải lên thành công");
  };

  const handleEvaluate = () => {
    // Check if resume sections exist
    if (resumeSections.length === 0) {
      toast.error("Vui lòng tải lên CV trước");
      return;
    }
    
    // Save to localStorage for use in evaluation page
    localStorage.setItem("resumeSectionsForEval", JSON.stringify(resumeSections));
    localStorage.setItem("jobDescription", jobDescriptionText);
    
    // Navigate to evaluation page
    navigate("/evaluation");
  };

  const handleStartMockInterview = () => {
    // Check if resume sections exist
    if (resumeSections.length === 0) {
      toast.error("Vui lòng tải lên CV trước");
      return;
    }
    
    // Save to localStorage for use in mock interview
    localStorage.setItem("resumeSectionsForInterview", JSON.stringify(resumeSections));
    
    // Navigate to mock interview page
    navigate("/mock-interview");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Tải lên hồ sơ của bạn</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Hồ sơ của bạn</h2>
            
            <FileUpload
              acceptedTypes=".pdf,.doc,.docx"
              onFileUpload={handleFileUpload}
              label="Tải lên CV của bạn"
            />
            
            {resumeSections.length > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✓ CV đã được tải lên thành công</p>
                <p className="text-green-600 text-sm mt-1">
                  Đã phân tích {resumeSections.length} phần từ CV của bạn
                </p>
              </div>
            )}
          </div>
          
          {/* Job Description Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Mô tả công việc (tùy chọn)</h2>
            
            <Tabs defaultValue="upload">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Tải lên JD</TabsTrigger>
                <TabsTrigger value="paste">Dán văn bản</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <FileUpload
                  acceptedTypes=".pdf,.doc,.docx"
                  onFileUpload={handleJobDescriptionFileUpload}
                  label="Tải lên mô tả công việc"
                />
              </TabsContent>
              
              <TabsContent value="paste" className="mt-4">
                <Textarea
                  placeholder="Dán mô tả công việc vào đây..."
                  className="min-h-[300px]"
                  value={jobDescriptionText}
                  onChange={(e) => setJobDescriptionText(e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button onClick={handleEvaluate} size="lg" className="gap-2">
            <span>Đánh giá hồ sơ</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button onClick={handleStartMockInterview} variant="outline" size="lg" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Bắt đầu phỏng vấn thử</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Upload;
