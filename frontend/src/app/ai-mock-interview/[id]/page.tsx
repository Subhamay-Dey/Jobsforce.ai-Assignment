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
import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs";

interface Question {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  examples: string[];
  constraints: string[];
  solution?: string;
  category?: string;
  status?: string;
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
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchInterviewQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/ai-interview/${jobId}`);
        
        // Add a category and status property to each question
        const questionsWithCategory = response.data.questions.map((q: Question) => ({
          ...q,
          category: determineCategoryFromQuestion(q),
          status: "unsolved"
        }));
        
        setQuestions(questionsWithCategory);
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

  // A helper function to determine question category based on title/description
  const determineCategoryFromQuestion = (question: Question) => {
    const title = question.title.toLowerCase();
    const description = question.description.toLowerCase();
    
    if (title.includes("array") || description.includes("array")) return "Array";
    if (title.includes("string") || description.includes("string")) return "String";
    if (title.includes("tree") || description.includes("tree") || description.includes("binary tree")) return "Tree";
    if (title.includes("graph") || description.includes("graph")) return "Graph";
    if (title.includes("dynamic") || description.includes("dynamic programming")) return "Dynamic Programming";
    if (title.includes("backtrack") || description.includes("backtrack")) return "Backtracking";
    if (title.includes("sort") || description.includes("sort")) return "Sorting";
    if (title.includes("linked list") || description.includes("linked list")) return "Linked List";
    if (title.includes("stack") || description.includes("stack")) return "Stack";
    if (title.includes("queue") || description.includes("queue")) return "Queue";
    if (title.includes("heap") || description.includes("heap")) return "Heap";
    if (title.includes("hash") || description.includes("hash")) return "Hash Table";
    
    return "Algorithm";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'hard':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
      {/* Keep the original header card */}
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

      {/* LeetCode-style table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-3 text-center w-10">Status</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Difficulty</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Solution</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, idx) => (
              <tr 
                key={question.id} 
                className={`border-b hover:bg-gray-50 cursor-pointer ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}
                onClick={() => setSelectedQuestion(question)}
              >
                <td className="px-2 py-4 text-center">
                  {question.status === "solved" ? (
                    <BsCheckCircle className="mx-auto text-green-500" size={18} />
                  ) : (
                    <div className="w-5 h-5 mx-auto"></div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium">
                  <div className="hover:text-blue-600">
                    {question.title}
                  </div>
                </td>
                <td className={`px-6 py-4 ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </td>
                <td className="px-6 py-4">{question.category}</td>
                <td className="px-6 py-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Question details modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{selectedQuestion.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className={`${getDifficultyColor(selectedQuestion.difficulty)} bg-opacity-20`}>
                      {selectedQuestion.difficulty}
                    </Badge>
                    <span className="text-gray-600">{selectedQuestion.category}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedQuestion(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="prose max-w-none">
                <p className="mb-6">{selectedQuestion.description}</p>
                
                <h3 className="font-medium text-lg mb-2">Examples:</h3>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  {selectedQuestion.examples.map((example, idx) => (
                    <div key={idx} className="mb-3">
                      {formatExample(example)}
                      {idx < selectedQuestion.examples.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
                
                <h3 className="font-medium text-lg mb-2">Constraints:</h3>
                <ul className="list-disc pl-5 space-y-1 mb-6">
                  {selectedQuestion.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
                
                {selectedQuestion.solution && (
                  <>
                    <h3 className="font-medium text-lg mb-2">Solution:</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <pre className="whitespace-pre-wrap">{selectedQuestion.solution}</pre>
                    </div>
                  </>
                )}
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => {
                    setQuestions(questions.map(q => 
                      q.id === selectedQuestion.id ? {...q, status: "solved"} : q
                    ));
                    setSelectedQuestion(null);
                  }}>
                    Mark as Solved
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiMockInterview;