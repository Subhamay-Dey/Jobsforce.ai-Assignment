"use client"
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import htmlToMd from "html-to-md";
import { Book, Clock, CheckCircle } from "lucide-react";

function ProblemDescription({ questionTitle }: { questionTitle: any }) {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const difficultyColors = {
    Easy: 'text-green-500',
    Medium: 'text-yellow-500',
    Hard: 'text-red-500'
  };

  useEffect(() => {
    if (!questionTitle) return;
    const fetchProblemDescription = async () => {
      try {
        const response = await fetch(`/api/leetcode?questionName=${encodeURIComponent(questionTitle.toLowerCase())}`);
        
        const data = await response.json();
        if (data.description) {
          // Convert HTML to Markdown format
          const markdown = htmlToMd(data.description);
          setDescription(markdown);
          
          // Optional: Set difficulty based on API response or default
          setDifficulty(data.difficulty || 'Medium');
        } else {
          setDescription("Problem not found.");
        }
      } catch (error) {
        setDescription("Error fetching problem.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblemDescription();
  }, [questionTitle]);

  return (
    <div className="h-[800px] overflow-y-auto text-gray-100 px-6 pb-5">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{questionTitle}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`flex items-center ${difficultyColors[difficulty]}`}>
                <CheckCircle className="mr-2 w-5 h-5" />
                {difficulty} Difficulty
              </span>
              <span className="flex items-center text-gray-400">
                <Clock className="mr-2 w-5 h-5" />
                Estimated Time: 45 mins
              </span>
            </div>
          </div>
          <Book className="w-8 h-8 text-gray-500" />
        </div>

        {/* Description Section */}
        <div className="p-6">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-lg text-gray-300">
              <ReactMarkdown>{description || "No description available."}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-700 flex justify-between items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Start Solving
          </button>
          <div className="text-gray-500">
            Solve this problem to improve your skills
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;


















































// import CircleSkeleton from "@/components/Skeletons/CircleSkeleton";
// import RectangleSkeleton from "@/components/Skeletons/RectangleSkeleton";
// import { DBProblem, Problem } from "@/utils/types/problem";
// import { useEffect, useState } from "react";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { AiFillLike, AiFillDislike, AiOutlineLoading3Quarters, AiFillStar } from "react-icons/ai";
// import { BsCheck2Circle } from "react-icons/bs";
// import { TiStarOutline } from "react-icons/ti";
// import { toast } from "react-toastify";

// type ProblemDescriptionProps = {
// 	problem: Problem;
// 	_solved: boolean;
// };

// const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, _solved }) => {
// 	const [user] = useAuthState(auth);
// 	const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } = useGetCurrentProblem(problem.id);
// 	const { liked, disliked, solved, setData, starred } = useGetUsersDataOnProblem(problem.id);
// 	const [updating, setUpdating] = useState(false);

// 	const returnUserDataAndProblemData = async (transaction: any) => {
// 		const userRef = doc(firestore, "users", user!.uid);
// 		const problemRef = doc(firestore, "problems", problem.id);
// 		const userDoc = await transaction.get(userRef);
// 		const problemDoc = await transaction.get(problemRef);
// 		return { userDoc, problemDoc, userRef, problemRef };
// 	};

// 	const handleLike = async () => {
// 		if (!user) {
// 			toast.error("You must be logged in to like a problem", { position: "top-left", theme: "dark" });
// 			return;
// 		}
// 		if (updating) return;
// 		setUpdating(true);
// 		await runTransaction(firestore, async (transaction) => {
// 			const { problemDoc, userDoc, problemRef, userRef } = await returnUserDataAndProblemData(transaction);

// 			if (userDoc.exists() && problemDoc.exists()) {
// 				if (liked) {
// 					// remove problem id from likedProblems on user document, decrement likes on problem document
// 					transaction.update(userRef, {
// 						likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
// 					});
// 					transaction.update(problemRef, {
// 						likes: problemDoc.data().likes - 1,
// 					});

// 					setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes - 1 } : null));
// 					setData((prev) => ({ ...prev, liked: false }));
// 				} else if (disliked) {
// 					transaction.update(userRef, {
// 						likedProblems: [...userDoc.data().likedProblems, problem.id],
// 						dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
// 					});
// 					transaction.update(problemRef, {
// 						likes: problemDoc.data().likes + 1,
// 						dislikes: problemDoc.data().dislikes - 1,
// 					});

// 					setCurrentProblem((prev) =>
// 						prev ? { ...prev, likes: prev.likes + 1, dislikes: prev.dislikes - 1 } : null
// 					);
// 					setData((prev) => ({ ...prev, liked: true, disliked: false }));
// 				} else {
// 					transaction.update(userRef, {
// 						likedProblems: [...userDoc.data().likedProblems, problem.id],
// 					});
// 					transaction.update(problemRef, {
// 						likes: problemDoc.data().likes + 1,
// 					});
// 					setCurrentProblem((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
// 					setData((prev) => ({ ...prev, liked: true }));
// 				}
// 			}
// 		});
// 		setUpdating(false);
// 	};

// 	const handleDislike = async () => {
// 		if (!user) {
// 			toast.error("You must be logged in to dislike a problem", { position: "top-left", theme: "dark" });
// 			return;
// 		}
// 		if (updating) return;
// 		setUpdating(true);
// 		await runTransaction(firestore, async (transaction) => {
// 			const { problemDoc, userDoc, problemRef, userRef } = await returnUserDataAndProblemData(transaction);
// 			if (userDoc.exists() && problemDoc.exists()) {
// 				// already disliked, already liked, not disliked or liked
// 				if (disliked) {
// 					transaction.update(userRef, {
// 						dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
// 					});
// 					transaction.update(problemRef, {
// 						dislikes: problemDoc.data().dislikes - 1,
// 					});
// 					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes - 1 } : null));
// 					setData((prev) => ({ ...prev, disliked: false }));
// 				} else if (liked) {
// 					transaction.update(userRef, {
// 						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
// 						likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
// 					});
// 					transaction.update(problemRef, {
// 						dislikes: problemDoc.data().dislikes + 1,
// 						likes: problemDoc.data().likes - 1,
// 					});
// 					setCurrentProblem((prev) =>
// 						prev ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 } : null
// 					);
// 					setData((prev) => ({ ...prev, disliked: true, liked: false }));
// 				} else {
// 					transaction.update(userRef, {
// 						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
// 					});
// 					transaction.update(problemRef, {
// 						dislikes: problemDoc.data().dislikes + 1,
// 					});
// 					setCurrentProblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes + 1 } : null));
// 					setData((prev) => ({ ...prev, disliked: true }));
// 				}
// 			}
// 		});
// 		setUpdating(false);
// 	};

// 	const handleStar = async () => {
// 		if (!user) {
// 			toast.error("You must be logged in to star a problem", { position: "top-left", theme: "dark" });
// 			return;
// 		}
// 		if (updating) return;
// 		setUpdating(true);

// 		if (!starred) {
// 			const userRef = doc(firestore, "users", user.uid);
// 			await updateDoc(userRef, {
// 				starredProblems: arrayUnion(problem.id),
// 			});
// 			setData((prev) => ({ ...prev, starred: true }));
// 		} else {
// 			const userRef = doc(firestore, "users", user.uid);
// 			await updateDoc(userRef, {
// 				starredProblems: arrayRemove(problem.id),
// 			});
// 			setData((prev) => ({ ...prev, starred: false }));
// 		}

// 		setUpdating(false);
// 	};

// 	return (
// 		<div className='bg-dark-layer-1'>
// 			{/* TAB */}
// 			<div className='flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden'>
// 				<div className={"bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
// 					Description
// 				</div>
// 			</div>

// 			<div className='flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto'>
// 				<div className='px-5'>
// 					{/* Problem heading */}
// 					<div className='w-full'>
// 						<div className='flex space-x-4'>
// 							<div className='flex-1 mr-2 text-lg text-white font-medium'>{problem?.title}</div>
// 						</div>
// 						{!loading && currentProblem && (
// 							<div className='flex items-center mt-3'>
// 								<div
// 									className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
// 								>
// 									{currentProblem.difficulty}
// 								</div>
// 								{(solved || _solved) && (
// 									<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
// 										<BsCheck2Circle />
// 									</div>
// 								)}
// 								<div
// 									className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'
// 									onClick={handleLike}
// 								>
// 									{liked && !updating && <AiFillLike className='text-dark-blue-s' />}
// 									{!liked && !updating && <AiFillLike />}
// 									{updating && <AiOutlineLoading3Quarters className='animate-spin' />}

// 									<span className='text-xs'>{currentProblem.likes}</span>
// 								</div>
// 								<div
// 									className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6'
// 									onClick={handleDislike}
// 								>
// 									{disliked && !updating && <AiFillDislike className='text-dark-blue-s' />}
// 									{!disliked && !updating && <AiFillDislike />}
// 									{updating && <AiOutlineLoading3Quarters className='animate-spin' />}

// 									<span className='text-xs'>{currentProblem.dislikes}</span>
// 								</div>
// 								<div
// 									className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '
// 									onClick={handleStar}
// 								>
// 									{starred && !updating && <AiFillStar className='text-dark-yellow' />}
// 									{!starred && !updating && <TiStarOutline />}
// 									{updating && <AiOutlineLoading3Quarters className='animate-spin' />}
// 								</div>
// 							</div>
// 						)}

// 						{loading && (
// 							<div className='mt-3 flex space-x-2'>
// 								<RectangleSkeleton />
// 								<CircleSkeleton />
// 								<RectangleSkeleton />
// 								<RectangleSkeleton />
// 								<CircleSkeleton />
// 							</div>
// 						)}

// 						{/* Problem Statement(paragraphs) */}
// 						<div className='text-white text-sm'>
// 							<div dangerouslySetInnerHTML={{ __html: problem.problemStatement }} />
// 						</div>

// 						{/* Examples */}
// 						<div className='mt-4'>
// 							{problem.examples.map((example, index) => (
// 								<div key={example.id}>
// 									<p className='font-medium text-white '>Example {index + 1}: </p>
// 									{example.img && <img src={example.img} alt='' className='mt-3' />}
// 									<div className='example-card'>
// 										<pre>
// 											<strong className='text-white'>Input: </strong> {example.inputText}
// 											<br />
// 											<strong>Output:</strong>
// 											{example.outputText} <br />
// 											{example.explanation && (
// 												<>
// 													<strong>Explanation:</strong> {example.explanation}
// 												</>
// 											)}
// 										</pre>
// 									</div>
// 								</div>
// 							))}
// 						</div>

// 						{/* Constraints */}
// 						<div className='my-8 pb-4'>
// 							<div className='text-white text-sm font-medium'>Constraints:</div>
// 							<ul className='text-white ml-5 list-disc '>
// 								<div dangerouslySetInnerHTML={{ __html: problem.constraints }} />
// 							</ul>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };
// export default ProblemDescription;

// function useGetCurrentProblem(problemId: string) {
// 	const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
// 	const [loading, setLoading] = useState<boolean>(true);
// 	const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");

// 	useEffect(() => {
// 		// Get problem from DB
// 		const getCurrentProblem = async () => {
// 			setLoading(true);
// 			const docRef = doc(firestore, "problems", problemId);
// 			const docSnap = await getDoc(docRef);
// 			if (docSnap.exists()) {
// 				const problem = docSnap.data();
// 				setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem);
// 				// easy, medium, hard
// 				setProblemDifficultyClass(
// 					problem.difficulty === "Easy"
// 						? "bg-olive text-olive"
// 						: problem.difficulty === "Medium"
// 						? "bg-dark-yellow text-dark-yellow"
// 						: " bg-dark-pink text-dark-pink"
// 				);
// 			}
// 			setLoading(false);
// 		};
// 		getCurrentProblem();
// 	}, [problemId]);

// 	return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
// }

// function useGetUsersDataOnProblem(problemId: string) {
// 	const [data, setData] = useState({ liked: false, disliked: false, starred: false, solved: false });
// 	const [user] = useAuthState(auth);

// 	useEffect(() => {
// 		const getUsersDataOnProblem = async () => {
// 			const userRef = doc(firestore, "users", user!.uid);
// 			const userSnap = await getDoc(userRef);
// 			if (userSnap.exists()) {
// 				const data = userSnap.data();
// 				const { solvedProblems, likedProblems, dislikedProblems, starredProblems } = data;
// 				setData({
// 					liked: likedProblems.includes(problemId), // likedProblems["two-sum","jump-game"]
// 					disliked: dislikedProblems.includes(problemId),
// 					starred: starredProblems.includes(problemId),
// 					solved: solvedProblems.includes(problemId),
// 				});
// 			}
// 		};

// 		if (user) getUsersDataOnProblem();
// 		return () => setData({ liked: false, disliked: false, starred: false, solved: false });
// 	}, [problemId, user]);

// 	return { ...data, setData };
// }