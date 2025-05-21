
// This is a mock/simulation of the Gemini API service
// In a real application, this would make requests to the actual Gemini API

interface AnalyzeResumeResponse {
  improvements: Array<{
    section: string;
    original: string;
    suggestion: string;
    reason: string;
  }>;
  improvedContent: Record<string, string>;
}

interface AnalyzeJobDescriptionResponse {
  matches: Array<{
    skill: string;
    confidence: number;
  }>;
  gaps: Array<{
    skill: string;
    importance: 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  overallMatch: number;
}

interface EvaluateAnswerResponse {
  evaluation: string;
  improvementPoints: string[];
  score: number;
}

interface InterviewQuestionWithHint {
  question: string;
  hint: string;
}

export const geminiApi = {
  // Mock function to analyze resume content
  analyzeResume: async (resumeContent: Record<string, string>): Promise<AnalyzeResumeResponse> => {
    console.log('Analyzing resume:', resumeContent);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response for demonstration
    const response: AnalyzeResumeResponse = {
      improvements: [],
      improvedContent: {}
    };
    
    // Generate mock improvements for each section
    Object.entries(resumeContent).forEach(([section, content]) => {
      // Skip if content is empty
      if (!content.trim()) return;
      
      const lines = content.split('\n').filter(line => line.trim());
      
      // Add section to improved content
      response.improvedContent[section] = content;
      
      // Generate 1-2 improvements per section
      if (lines.length > 0) {
        const line = lines[Math.floor(Math.random() * lines.length)];
        
        if (section.toLowerCase().includes('kinh nghiệm') || 
            section.toLowerCase().includes('experience')) {
          
          response.improvements.push({
            section,
            original: line,
            suggestion: line.replace(/đã làm việc với/i, 'đã phát triển và triển khai'),
            reason: 'Sử dụng từ ngữ chủ động và cụ thể hơn để thể hiện vai trò của bạn.'
          });
          
          // Replace in improved content
          response.improvedContent[section] = response.improvedContent[section]
            .replace(line, line.replace(/đã làm việc với/i, 'đã phát triển và triển khai'));
        }
        
        else if (section.toLowerCase().includes('kỹ năng') || 
                 section.toLowerCase().includes('skills')) {
          
          response.improvements.push({
            section,
            original: line,
            suggestion: line + ' (có kinh nghiệm thực tế 2+ năm)',
            reason: 'Thêm thông tin cụ thể về mức độ thành thạo để làm nổi bật kỹ năng của bạn.'
          });
          
          // Replace in improved content
          response.improvedContent[section] = response.improvedContent[section]
            .replace(line, line + ' (có kinh nghiệm thực tế 2+ năm)');
        }
        
        else {
          response.improvements.push({
            section,
            original: line,
            suggestion: line.replace(/tốt$|good$/i, 'xuất sắc, đứng đầu 10% sinh viên'),
            reason: 'Sử dụng thông tin cụ thể và có thể đo lường được để làm nổi bật thành tích của bạn.'
          });
          
          // Replace in improved content
          response.improvedContent[section] = response.improvedContent[section]
            .replace(line, line.replace(/tốt$|good$/i, 'xuất sắc, đứng đầu 10% sinh viên'));
        }
      }
    });
    
    return response;
  },
  
  // Mock function to analyze job description against resume
  analyzeJobDescription: async (
    resumeContent: Record<string, string>, 
    jobDescription: string
  ): Promise<AnalyzeJobDescriptionResponse> => {
    console.log('Analyzing job description against resume:', { resumeContent, jobDescription });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response data
    return {
      matches: [
        { skill: 'React', confidence: 0.9 },
        { skill: 'JavaScript', confidence: 0.95 },
        { skill: 'TypeScript', confidence: 0.8 },
        { skill: 'Team collaboration', confidence: 0.85 }
      ],
      gaps: [
        { 
          skill: 'GraphQL', 
          importance: 'high',
          suggestion: 'Nêu bật bất kỳ dự án nào có sử dụng REST API và nhấn mạnh khả năng học công nghệ mới nhanh chóng.'
        },
        { 
          skill: 'Docker', 
          importance: 'medium',
          suggestion: 'Nếu có kinh nghiệm với công cụ CI/CD hoặc triển khai, hãy nhấn mạnh điều đó trong CV của bạn.'
        }
      ],
      overallMatch: 0.78
    };
  },
  
  // Mock function to get interview questions based on job type
  getInterviewQuestions: async (jobType: string): Promise<InterviewQuestionWithHint[]> => {
    console.log('Getting interview questions for job type:', jobType);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Default questions if job type is not specific
    const defaultQuestions: InterviewQuestionWithHint[] = [
      {
        question: 'Hãy giới thiệu về bản thân và kinh nghiệm làm việc của bạn.',
        hint: 'Tập trung vào kỹ năng và kinh nghiệm liên quan đến vị trí. Giữ câu trả lời ngắn gọn trong khoảng 2 phút.'
      },
      {
        question: 'Điểm mạnh và điểm yếu lớn nhất của bạn là gì?',
        hint: 'Khi nói về điểm yếu, hãy đề cập đến cách bạn đang cải thiện nó.'
      },
      {
        question: 'Tại sao bạn muốn làm việc cho công ty chúng tôi?',
        hint: 'Nghiên cứu về công ty trước và nêu ra những điểm cụ thể về văn hóa, sản phẩm hoặc sứ mệnh của họ mà bạn ngưỡng mộ.'
      },
      {
        question: 'Mô tả một tình huống khó khăn trong công việc và cách bạn giải quyết nó.',
        hint: 'Sử dụng phương pháp STAR: Situation, Task, Action, Result (Tình huống, Nhiệm vụ, Hành động, Kết quả).'
      },
      {
        question: 'Bạn nhìn thấy mình ở đâu trong 5 năm tới?',
        hint: 'Liên kết mục tiêu nghề nghiệp của bạn với vị trí và cơ hội phát triển tại công ty.'
      }
    ];
    
    // Return default questions for now - in a real implementation, 
    // this would return questions tailored to the job type
    return defaultQuestions;
  },
  
  // Mock function to evaluate interview answer
  evaluateAnswer: async (question: string, answer: string): Promise<EvaluateAnswerResponse> => {
    console.log('Evaluating answer:', { question, answer });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock scores based on answer length for demonstration
    const score = Math.min(Math.max(answer.length / 100, 0.5), 0.95);
    
    // Basic evaluation based on answer length
    let evaluation = '';
    let improvementPoints: string[] = [];
    
    if (answer.length < 50) {
      evaluation = 'Câu trả lời quá ngắn và thiếu chi tiết cụ thể.';
      improvementPoints = [
        'Mở rộng câu trả lời với ví dụ cụ thể',
        'Thêm thông tin về kết quả đạt được',
        'Sử dụng phương pháp STAR để cấu trúc câu trả lời'
      ];
    } else if (answer.length < 200) {
      evaluation = 'Câu trả lời có độ dài vừa phải nhưng có thể bổ sung thêm chi tiết.';
      improvementPoints = [
        'Thêm dữ liệu cụ thể hoặc số liệu để củng cố các điểm chính',
        'Nhấn mạnh thêm về kỹ năng liên quan đến vị trí'
      ];
    } else {
      evaluation = 'Câu trả lời đầy đủ và chi tiết, thể hiện sự chuẩn bị kỹ lưỡng.';
      improvementPoints = [
        'Đảm bảo câu trả lời súc tích và tập trung vào những điểm quan trọng nhất',
        'Sử dụng ngôn ngữ cơ thể và giọng điệu tự tin khi phỏng vấn thực tế'
      ];
    }
    
    return {
      evaluation,
      improvementPoints,
      score
    };
  }
};
