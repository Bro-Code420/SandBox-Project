import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTests = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tests")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

export const getTestAttempts = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("test_attempts")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

export const generateMockTest = mutation({
    args: { userId: v.string(), skill: v.string(), difficulty: v.string() },
    handler: async (ctx, args) => {
        // In a real app, this would be an action calling an LLM
        // Here we mock the generation
        const newTest = {
            userId: args.userId,
            skill: args.skill,
            difficulty: args.difficulty,
            questions: [
                {
                    type: "mcq",
                    question: `Which of the following is a key feature of ${args.skill}?`,
                    options: [
                        "It is only used for styling.",
                        `It provides core functionality for ${args.skill}.`,
                        "It is a deprecated tool.",
                        "None of the above."
                    ],
                    correct_answer: `It provides core functionality for ${args.skill}.`
                },
                {
                    type: "mcq",
                    question: `When should you use ${args.skill} in a real-world project?`,
                    options: [
                        "For every single microservice.",
                        "When specific requirements match its strengths.",
                        "Only in monolithic applications.",
                        "Only when using Python."
                    ],
                    correct_answer: "When specific requirements match its strengths."
                },
                {
                    type: "concept",
                    question: `Explain how you would optimize a system using ${args.skill}.`,
                    expected_points: ["caching", "load balancing", "efficient querying"]
                }
            ],
            createdAt: Date.now(),
        };

        const testId = await ctx.db.insert("tests", newTest);
        return await ctx.db.get(testId);
    }
});

export const submitTestAttempt = mutation({
    args: {
        userId: v.string(),
        testId: v.id("tests"),
        skill: v.string(),
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

        // Basic Evaluation Logic
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
                // Mock concept evaluation: check if answer includes keywords
                const matches = (q.expected_points || []).filter(p => ans.answer.toLowerCase().includes(p.toLowerCase()));
                if (matches.length > 0) {
                    correct++;
                } else {
                    if (!weaknesses.includes("Conceptual understanding")) weaknesses.push("Conceptual understanding");
                }
            }
        });

        const score = Math.round((correct / test.questions.length) * 100);
        let confidence = score > 80 ? 90 : score > 50 ? 60 : 30;
        let feedback = score > 80 ? "Excellent understanding." : "Needs review.";
        
        // Adaptive Readiness Impact
        let impact = 0;
        if (score > 80) impact = 5;
        else if (score < 50) impact = -2;

        const attemptId = await ctx.db.insert("test_attempts", {
            userId: args.userId,
            testId: args.testId,
            skill: args.skill,
            score,
            confidence,
            strengths,
            weaknesses,
            feedback,
            readiness_impact: impact,
            completedAt: Date.now()
        });

        // Optionally update the analysis score here
        // We will just fetch the latest analysis and update it directly to simulate score boost
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

        return await ctx.db.get(attemptId);
    }
});
