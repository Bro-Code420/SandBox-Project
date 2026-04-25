import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserProgress = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const progress = await ctx.db
            .query("user_progress")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();
            
        if (!progress) {
            return {
                userId: args.userId,
                current_day: 1,
                streak: 0,
                longest_streak: 0,
                readiness_score: 0,
                next_difficulty: "intermediate",
                last_test_date: undefined
            };
        }
        return progress;
    },
});

export const getDailyTests = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("daily_tests")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("asc")
            .collect();
    },
});

export const getTestResults = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("test_results")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

export const generateDailyTest = mutation({
    args: { userId: v.string(), day: v.number(), skill: v.string(), difficulty: v.string() },
    handler: async (ctx, args) => {
        // Check if test for this day already exists
        const existingTest = await ctx.db
            .query("daily_tests")
            .withIndex("by_userId_and_day", (q) => q.eq("userId", args.userId).eq("day", args.day))
            .first();
            
        if (existingTest) {
            return existingTest;
        }

        // Mock test generation based on skill and day
        const newTest = {
            userId: args.userId,
            day: args.day,
            skill: args.skill,
            difficulty: args.difficulty,
            status: "available",
            questions: [
                {
                    type: "mcq",
                    question: `What is the primary purpose of ${args.skill}?`,
                    options: [
                        "To style the user interface",
                        `To handle core logic for ${args.skill}`,
                        "To manage databases",
                        "None of the above"
                    ],
                    correct_answer: `To handle core logic for ${args.skill}`
                },
                {
                    type: "mcq",
                    question: `When implementing ${args.skill}, which practice is recommended?`,
                    options: [
                        "Ignoring error handling",
                        "Following established patterns and best practices",
                        "Writing all code in a single file",
                        "Avoiding documentation"
                    ],
                    correct_answer: "Following established patterns and best practices"
                },
                {
                    type: "mcq",
                    question: `Which of these is a common challenge with ${args.skill}?`,
                    options: [
                        "It is too fast",
                        "It requires no memory",
                        "Managing state and side effects effectively",
                        "It only works on Windows"
                    ],
                    correct_answer: "Managing state and side effects effectively"
                },
                {
                    type: "concept",
                    question: `Describe a scenario where ${args.skill} would be the optimal choice.`,
                    expected_points: ["performance", "scalability", "specific use case"]
                },
                {
                    type: "concept",
                    question: `How would you optimize an application that uses ${args.skill}?`,
                    expected_points: ["caching", "lazy loading", "efficient queries"]
                }
            ],
            createdAt: Date.now(),
        };

        const testId = await ctx.db.insert("daily_tests", newTest);
        return await ctx.db.get(testId);
    }
});

export const submitDailyTest = mutation({
    args: {
        userId: v.string(),
        testId: v.id("daily_tests"),
        answers: v.array(v.object({
            questionIndex: v.number(),
            answer: v.string()
        }))
    },
    handler: async (ctx, args) => {
        const test = await ctx.db.get(args.testId);
        if (!test) throw new Error("Test not found");

        let correct = 0;
        const strengths: string[] = [];
        const weaknesses: string[] = [];

        args.answers.forEach(ans => {
            const q = test.questions[ans.questionIndex];
            if (q.type === "mcq") {
                if (q.correct_answer === ans.answer) {
                    correct++;
                    if (!strengths.includes(test.skill)) strengths.push(test.skill);
                } else {
                    if (!weaknesses.includes(test.skill)) weaknesses.push(test.skill);
                }
            } else if (q.type === "concept") {
                const matches = (q.expected_points || []).filter(p => ans.answer.toLowerCase().includes(p.toLowerCase()));
                if (matches.length > 0) {
                    correct++;
                } else {
                    if (!weaknesses.includes("Conceptual explanation")) weaknesses.push("Conceptual explanation");
                }
            }
        });

        const score = Math.round((correct / test.questions.length) * 100);
        let confidence = score > 80 ? 90 : score >= 50 ? 60 : 30;
        let feedback = score > 80 ? "Excellent understanding! You've mastered this day's skill." : score >= 50 ? "Good effort, but there's room for improvement. Review the concepts." : "Needs review. Consider revisiting the learning materials for this skill.";
        
        let impact = score > 80 ? 4 : score >= 50 ? 1 : -2;

        const resultId = await ctx.db.insert("test_results", {
            userId: args.userId,
            testId: args.testId,
            day: test.day,
            skill: test.skill,
            score,
            confidence,
            strengths,
            weaknesses,
            feedback,
            readiness_impact: impact,
            attempted_at: Date.now()
        });

        // Update test status to completed
        await ctx.db.patch(test._id, { status: "completed" });

        // Update user progress
        let progress = await ctx.db
            .query("user_progress")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (progress) {
            // Calculate streak
            const now = new Date();
            const todayStr = now.toDateString();
            
            let newStreak = progress.streak;
            if (progress.last_test_date) {
                const lastDate = new Date(progress.last_test_date);
                const diffTime = Math.abs(now.getTime() - lastDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (lastDate.toDateString() !== todayStr) {
                    if (diffDays === 1) {
                        newStreak += 1;
                    } else if (diffDays > 1) {
                        newStreak = 1; // reset streak
                    }
                }
            } else {
                newStreak = 1;
            }

            // Determine adaptive difficulty for tomorrow
            let newDifficulty = progress.next_difficulty || "intermediate";
            if (score > 80) {
                newDifficulty = newDifficulty === "beginner" ? "intermediate" : "advanced";
            } else if (score < 50) {
                newDifficulty = newDifficulty === "advanced" ? "intermediate" : "beginner";
            }

            await ctx.db.patch(progress._id, {
                streak: newStreak,
                longest_streak: Math.max(progress.longest_streak, newStreak),
                current_day: Math.max(progress.current_day, test.day + 1), // unlock next day
                readiness_score: Math.min(100, Math.max(0, progress.readiness_score + impact)),
                next_difficulty: newDifficulty,
                last_test_date: Date.now(),
            });
        } else {
            let newDifficulty = "intermediate";
            if (score > 80) newDifficulty = "advanced";
            if (score < 50) newDifficulty = "beginner";

            await ctx.db.insert("user_progress", {
                userId: args.userId,
                current_day: test.day + 1,
                streak: 1,
                longest_streak: 1,
                readiness_score: Math.max(0, impact),
                next_difficulty: newDifficulty,
                last_test_date: Date.now(),
            });
        }

        // Also optionally update the general analysis readiness score to reflect global impact
        const analysis = await ctx.db
            .query("analyses")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .first();

        if (analysis && impact !== 0) {
            const updates: any = {
                readinessScore: Math.min(100, Math.max(0, analysis.readinessScore + impact))
            };
            if (analysis.potentialScore !== undefined) {
                updates.potentialScore = Math.min(100, Math.max(0, analysis.potentialScore + impact));
            }
            await ctx.db.patch(analysis._id, updates);
        }

        return await ctx.db.get(resultId);
    }
});
