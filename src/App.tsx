import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckIcon, XIcon, BrainCircuit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const MarkingAssistant = () => {
  const [formData, setFormData] = useState({
    question: '',
    totalMarks: '',
    studentAnswer: '',
    markingGuide: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMarks = async () => {
    setLoading(true);
    setError(null);

    // Simulated response for demo purposes
    setTimeout(() => {
      setResult({
        mark: 7,
        totalMarks: 10,
        percentage: 70,
        breakdown: [
          { point: "Correct definition", earned: true, value: 2.0 },
          { point: "Clear explanation", earned: true, value: 2.0 },
          { point: "Proper examples", earned: false, value: 2.0 },
          { point: "Logical structure", earned: true, value: 2.0 },
          { point: "Proper conclusion", earned: true, value: 2.0 }
        ],
        feedback: "Good attempt! Your answer shows a clear understanding of the core concepts. To improve, consider including more specific examples to support your explanations. The logical flow is well-maintained throughout your response."
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6" />
            Marking Assistant
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
              className="min-h-20"
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
              className="min-h-32"
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
              className="min-h-32"
            />
          </div>

          <Button 
            onClick={calculateMarks}
            className="w-full bg-[#1382DA] hover:bg-[#1382DA]/90"
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
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Score: {result.mark}/{result.totalMarks}
              </CardTitle>
              <CardDescription className="text-center text-lg">
                <span className={`
                  font-semibold
                  ${result.percentage >= 85 ? 'text-green-600' : ''}
                  ${result.percentage >= 70 && result.percentage < 85 ? 'text-blue-600' : ''}
                  ${result.percentage >= 50 && result.percentage < 70 ? 'text-yellow-600' : ''}
                  ${result.percentage < 50 ? 'text-red-600' : ''}
                `}>
                  {result.percentage}%
                </span>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Mark Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {result.breakdown.map((item, index) => (
                  <div key={index} 
                    className={`
                      p-3 rounded-lg flex items-center gap-3
                      ${item.earned ? 'bg-green-50' : 'bg-red-50'}
                      transition-all duration-200 hover:scale-[1.02]
                    `}
                  >
                    <div className={`
                      rounded-full p-1
                      ${item.earned ? 'bg-green-100' : 'bg-red-100'}
                    `}>
                      {item.earned ? (
                        <CheckIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <XIcon className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <span className="flex-grow">{item.point}</span>
                    <span className={`
                      font-medium px-2 py-1 rounded-full text-sm
                      ${item.earned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {item.value.toFixed(1)} marks
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1382DA]/10 to-blue-50 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-medium">AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/50 p-4 rounded-lg backdrop-blur-sm">
                <div className="whitespace-pre-wrap">
                  {result.feedback}
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold">
                Sign up to Marking.ai to mark entire assessments at once
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upgrade to Marking.ai Pro</DialogTitle>
                <DialogDescription>
                  Get access to bulk marking, advanced analytics, and more with Marking.ai Pro.
                  <div className="mt-4">
                    <Button className="w-full" onClick={() => window.open('https://marking.ai/signup', '_blank')}>
                      Start Free Trial
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default MarkingAssistant;