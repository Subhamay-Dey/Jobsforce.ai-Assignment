
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  examples: string[];
  constraints: string[];
  solution?: string;
}

interface JobInfo {
  title: string;
  organization: string;
  description: string;
  seniority: string;
}

const AiMockInterview = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null);

  useEffect(() => {
    const fetchInterviewQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/ai-interview/${jobId}`);
        setQuestions(response.data.questions);
        setJobInfo(response.data.job);
      } catch (err) {
        console.error("Error fetching interview questions:", err);
        setError("Failed to load interview questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchInterviewQuestions();
    }
  }, [jobId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatExample = (example: string) => {
    return example.split('\n').map((line, index) => (
      <p key={index} className="my-1">{line}</p>
    ));
  };

  if (loading) return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
      <p className="text-xl">Loading your interview questions...</p>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">AI Technical Interview</CardTitle>
          {jobInfo && (
            <CardDescription>
              <div className="mt-2">
                <p className="text-lg font-semibold">{jobInfo.title}</p>
                <p className="text-gray-600">{jobInfo.organization} • {jobInfo.seniority}</p>
              </div>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Below are 10 data structure and algorithm questions tailored for this position.
            The questions include 3 easy, 5 medium, and 2 hard problems to test your coding skills.
          </p>
          <Button onClick={() => router.back()} className="mb-4">Back to Job Listings</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {questions.map((question) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{question.title}</CardTitle>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{question.description}</p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="examples">
                  <AccordionTrigger>Examples</AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {question.examples.map((example, idx) => (
                        <div key={idx} className="mb-3">
                          {formatExample(example)}
                          {idx < question.examples.length - 1 && <Separator className="my-2" />}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="constraints">
                  <AccordionTrigger>Constraints</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {question.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AiMockInterview;