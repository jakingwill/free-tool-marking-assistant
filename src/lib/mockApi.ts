import { z } from 'zod';

// Validation schema
const MarkingRequestSchema = z.object({
  question: z.string().min(1, "Question is required"),
  totalMarks: z.string().min(1, "Total marks is required"),
  studentAnswer: z.string().min(1, "Student answer is required"),
  markingGuide: z.string().min(1, "Marking guide is required")
});

export type MarkingRequest = z.infer<typeof MarkingRequestSchema>;

interface MarkingResult {
  mark: number;
  totalMarks: number;
  percentage: number;
  breakdown: Array<{
    point: string;
    earned: boolean;
    value: number;
  }>;
  feedback: string;
}

// Simulated AI marking logic
function analyzeAnswer(request: MarkingRequest): MarkingResult {
  const markingPoints = request.markingGuide
    .split('\n')
    .filter(point => point.trim())
    .map(point => point.trim());

  const totalMarks = parseFloat(request.totalMarks);
  const pointValue = totalMarks / markingPoints.length;

  // Analyze each point (simulated AI analysis)
  const breakdown = markingPoints.map(point => {
    const earned = analyzePoint(request.studentAnswer, point);
    return {
      point,
      earned,
      value: pointValue
    };
  });

  const earnedMarks = breakdown.reduce((sum, point) => 
    sum + (point.earned ? point.value : 0), 0);
  const percentage = (earnedMarks / totalMarks) * 100;

  return {
    mark: earnedMarks,
    totalMarks,
    percentage,
    breakdown,
    feedback: generateFeedback(percentage, breakdown)
  };
}

// Simulated point analysis (replace with actual AI logic)
function analyzePoint(answer: string, point: string): boolean {
  // Simple simulation - randomly determine if point was earned
  // In a real implementation, this would use AI to analyze the answer
  return Math.random() > 0.3;
}

// Generate feedback based on performance
function generateFeedback(percentage: number, breakdown: Array<{ point: string; earned: boolean }>): string {
  const strengths = breakdown
    .filter(p => p.earned)
    .map(p => p.point);
  
  const weaknesses = breakdown
    .filter(p => !p.earned)
    .map(p => p.point);

  let feedback = `Overall Assessment:\n\n`;
  
  if (percentage >= 85) {
    feedback += `Excellent work! Your response demonstrates comprehensive understanding of the topic. `;
  } else if (percentage >= 70) {
    feedback += `Good effort! Your response shows solid understanding with some room for improvement. `;
  } else if (percentage >= 50) {
    feedback += `Fair attempt. Your response demonstrates basic understanding but needs more development. `;
  } else {
    feedback += `Your response needs significant improvement. Please review the topic carefully. `;
  }

  if (strengths.length > 0) {
    feedback += `\n\nStrengths:\n`;
    feedback += strengths.map(s => `✓ ${s}`).join('\n');
  }

  if (weaknesses.length > 0) {
    feedback += `\n\nAreas for Improvement:\n`;
    feedback += weaknesses.map(w => `• ${w}`).join('\n');
  }

  feedback += `\n\nRecommendations:\n`;
  feedback += `• Review the marking points you missed above.\n`;
  feedback += `• Provide more specific examples to support your answers.\n`;
  feedback += `• Ensure your response directly addresses each marking criterion.`;

  return feedback;
}

// Main API function
export async function markAnswer(request: MarkingRequest): Promise<MarkingResult> {
  try {
    // Validate request
    MarkingRequestSchema.parse(request);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Process the marking
    return analyzeAnswer(request);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors[0].message}`);
    }
    throw error;
  }
}