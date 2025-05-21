
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import HighlightedText from "@/components/HighlightedText";
import ImprovedTextSection from "@/components/ImprovedTextSection";
import { geminiApi } from "@/services/geminiApi";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

interface Improvement {
  section: string;
  original: string;
  suggestion: string;
  reason: string;
}

interface JobMatch {
  skill: string;
  confidence: number;
}

interface JobGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  suggestion: string;
}

const Evaluation = () => {
  const navigate = useNavigate();
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [improvedContent, setImprovedContent] = useState<Record<string, string>>({});
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [gaps, setGaps] = useState<JobGap[]>([]);
  const [overallMatch, setOverallMatch] = useState(0);
  
  useEffect(() => {
    // Load data from localStorage
    const resumeData = localStorage.getItem("resumeSectionsForEval");
    const jdData = localStorage.getItem("jobDescription");
    
    if (resumeData) {
      setResumeSections(JSON.parse(resumeData));
    } else {
      toast.error("Không tìm thấy dữ liệu hồ sơ. Vui lòng quay lại trang tải lên.");
      navigate("/upload");
      return;
    }
    
    if (jdData) {
      setJobDescription(jdData);
    }
    
    // Convert resume sections to the format expected by the API
    const resumeContent: Record<string, string> = {};
    JSON.parse(resumeData).forEach((section: ResumeSection) => {
      resumeContent[section.title] = section.content;
    });
    
    // Analyze resume with mock API
    const analyzeResume = async () => {
      try {
        const resumeAnalysis = await geminiApi.analyzeResume(resumeContent);
        setImprovements(resumeAnalysis.improvements);
        setImprovedContent(resumeAnalysis.improvedContent);
        
        // If job description exists, analyze it against the resume
        if (jdData && jdData.trim() !== "") {
          const jdAnalysis = await geminiApi.analyzeJobDescription(resumeContent, jdData);
          setMatches(jdAnalysis.matches);
          setGaps(jdAnalysis.gaps);
          setOverallMatch(jdAnalysis.overallMatch);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error analyzing resume:", error);
        toast.error("Đã xảy ra lỗi khi phân tích hồ sơ. Vui lòng thử lại.");
        setIsLoading(false);
      }
    };
    
    analyzeResume();
  }, [navigate]);
  
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-blue-600';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/upload")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Kết quả đánh giá</h1>
        </div>
        
        <Tabs defaultValue="resume" className="mt-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="resume">Cải thiện hồ sơ</TabsTrigger>
            <TabsTrigger value="jd" disabled={!jobDescription}>
              Phân tích JD
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="resume">
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="mb-4 text-lg font-medium">Đang phân tích hồ sơ của bạn...</div>
                <Progress value={45} className="w-full max-w-md mx-auto" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Original Resume Content */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Hồ sơ gốc</h2>
                  
                  <div className="space-y-6 p-6 border rounded-lg resume-container">
                    {resumeSections.map((section) => (
                      <div key={section.id} className="mb-6">
                        <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          <HighlightedText
                            originalText={section.content}
                            improvements={improvements.filter(
                              (improvement) => improvement.section === section.title
                            ).map((improvement) => ({
                              original: improvement.original,
                              suggestion: improvement.suggestion,
                              reason: improvement.reason
                            }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>* Di chuột qua văn bản được đánh dấu để xem các đề xuất cải thiện</p>
                  </div>
                </div>
                
                {/* Improved Resume Content */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Hồ sơ được cải thiện</h2>
                  
                  <div className="space-y-4 resume-container">
                    {Object.entries(improvedContent).map(([title, content]) => (
                      <ImprovedTextSection
                        key={title}
                        title={title}
                        content={content}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="jd">
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="mb-4 text-lg font-medium">Đang phân tích mức độ phù hợp với công việc...</div>
                <Progress value={65} className="w-full max-w-md mx-auto" />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Mức độ phù hợp tổng thể</h2>
                  <div className="relative w-full max-w-md mx-auto h-4 bg-gray-200 rounded-full overflow-hidden mt-4">
                    <div 
                      className="absolute top-0 left-0 h-full bg-resume-primary"
                      style={{ width: `${overallMatch * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-lg font-medium">
                    {Math.round(overallMatch * 100)}%
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Skills Matches */}
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Kỹ năng phù hợp</h3>
                    
                    <div className="space-y-4">
                      {matches.map((match, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{match.skill}</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(match.confidence * 100)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${match.confidence * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Skills Gaps */}
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Kỹ năng cần cải thiện</h3>
                    
                    <div className="space-y-6">
                      {gaps.map((gap, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{gap.skill}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getImportanceColor(gap.importance)} bg-opacity-20`}>
                              {gap.importance === 'high' ? 'Quan trọng' : 
                               gap.importance === 'medium' ? 'Trung bình' : 'Thấp'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{gap.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Evaluation;
