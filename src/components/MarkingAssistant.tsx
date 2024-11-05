import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrainCircuit, CheckIcon, XIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { markAnswer } from '@/lib/mockApi';
import type { MarkingRequest } from '@/lib/mockApi';

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

export function MarkingAssistant() {
  const [formData, setFormData] = useState<MarkingRequest>({
    question: '',
    totalMarks: '',
    studentAnswer: '',
    markingGuide: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MarkingResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMarks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await markAnswer(formData);
      setResult(data);
      toast.success('Marking completed successfully!');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to generate marking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Marking Assistant</h1>
        <p className="text-gray-600">AI-Powered Assessment Tool</p>
      </div>

      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
            Question Details
          </CardTitle>
          <CardDescription>Enter the question details and student response to generate feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              name="question"
              placeholder="Enter the question..."
              value={formData.question}
              onChange={handleInputChange}
              className="min-h-20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalMarks">Total Marks</Label>
            <Input
              id="totalMarks"
              name="totalMarks"
              type="number"
              placeholder="Enter total marks..."
              value={formData.totalMarks}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentAnswer">Student Answer</Label>
            <Textarea
              id="studentAnswer"
              name="studentAnswer"
              placeholder="Paste student's answer here..."
              value={formData.studentAnswer}
              onChange={handleInputChange}
              className="min-h-32 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="markingGuide">Marking Guide (one point per line)</Label>
            <Textarea
              id="markingGuide"
              name="markingGuide"
              placeholder="Enter marking points, one per line..."
              value={formData.markingGuide}
              onChange={handleInputChange}
              className="min-h-32 resize-none"
            />
          </div>

          <Button 
            onClick={calculateMarks}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!formData.question || !formData.totalMarks || !formData.studentAnswer || !formData.markingGuide || loading}
          >
            {loading ? "Analyzing..." : "Generate Marking"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-center text-3xl">
                Score: {result.mark.toFixed(1)}/{result.totalMarks}
              </CardTitle>
              <CardDescription className="text-center text-xl">
                <span className={cn(
                  "font-semibold",
                  result.percentage >= 85 ? "text-green-600" : "",
                  result.percentage >= 70 && result.percentage < 85 ? "text-blue-600" : "",
                  result.percentage >= 50 && result.percentage < 70 ? "text-yellow-600" : "",
                  result.percentage < 50 ? "text-red-600" : ""
                )}>
                  {result.percentage.toFixed(1)}%
                </span>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-xl font-medium">Mark Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {result.breakdown.map((item, index) => (
                  <div key={index} 
                    className={cn(
                      "p-3 rounded-lg flex items-center gap-3",
                      item.earned ? "bg-green-50" : "bg-red-50",
                      "transition-all duration-200 hover:scale-[1.01]"
                    )}
                  >
                    <div className={cn(
                      "rounded-full p-1",
                      item.earned ? "bg-green-100" : "bg-red-100"
                    )}>
                      {item.earned ? (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <XIcon className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <span className="flex-grow">{item.point}</span>
                    <span className={cn(
                      "font-medium px-2 py-1 rounded-full text-sm",
                      item.earned ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {item.value.toFixed(1)} marks
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-50 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-medium">AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                <div className="whitespace-pre-wrap">
                  {result.feedback}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Want to mark entire assessments at once?</span>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => window.open('https://marking.ai/signup', '_blank')}
              >
                Sign up to Marking.ai
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}