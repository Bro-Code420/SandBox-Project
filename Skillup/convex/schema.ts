import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    user_profiles: defineTable({
        userId: v.string(),
        email: v.string(),
        credits: v.optional(v.number()),
        lastCreditReset: v.optional(v.number()),
        membership: v.optional(v.union(v.literal("free"), v.literal("pro"), v.literal("elite"))),
        createdAt: v.any(),
    }).index("by_userId", ["userId"]),

    job_role_selections: defineTable({
        userId: v.string(),
        domain: v.string(),
        roleLevel: v.string(),
        experienceRange: v.string(),
        employmentType: v.string(),
        responsibilities: v.array(v.string()),
        coreSkills: v.array(v.string()),
        bonusSkills: v.array(v.string()),
        targetJobDescription: v.optional(v.string()),
    }).index("by_userId", ["userId"]),

    user_skills: defineTable({
        userId: v.string(),
        skills: v.array(v.string()),
        resumeText: v.optional(v.string()),
    }).index("by_userId", ["userId"]),

    analyses: defineTable({
        userId: v.string(),
        roleSnapshot: v.object({
            domain: v.string(),
            roleLevel: v.string(),
            title: v.string(),
        }),
        readinessScore: v.number(),
        readinessStatus: v.string(),
        matchedSkills: v.array(v.string()),
        missingSkills: v.array(v.string()),
        resumeFitScore: v.number(),
        scoreBreakdown: v.array(v.object({
            skill: v.string(),
            impact: v.number(),
            status: v.string(),
            scoreBoost: v.optional(v.number()),
            marketImportance: v.optional(v.number()),
        })),
        explanation: v.optional(v.object({
            factors: v.array(v.string()),
            coreCoverage: v.number(),
            secondaryCoverage: v.number(),
            bonusCoverage: v.number(),
            experienceFactor: v.number(),
        })),
        potentialScore: v.optional(v.number()),
        confidenceScore: v.optional(v.number()),
        resumeText: v.optional(v.string()),
        createdAt: v.any(),
    }).index("by_userId", ["userId"]),

    roadmaps: defineTable({
        userId: v.string(),
        analysisId: v.id("analyses"),
        weeks: v.array(v.object({
            weekNumber: v.number(),
            focusSkill: v.string(),
            skills: v.optional(v.array(v.string())),
            courses: v.array(v.object({
                title: v.string(),
                platform: v.string(),
                url: v.string(),
                duration: v.string(),
                reason: v.optional(v.string()),
            })),
            youtubePlaylists: v.array(v.object({
                title: v.string(),
                channel: v.string(),
                url: v.string(),
                videos: v.number(),
                reason: v.optional(v.string()),
            })),
            completed: v.optional(v.boolean()),
        })),
    }).index("by_userId", ["userId"]),
    
    tests: defineTable({
        userId: v.string(),
        skill: v.string(),
        difficulty: v.string(),
        questions: v.array(v.object({
            type: v.string(), // "mcq" | "concept"
            question: v.string(),
            options: v.optional(v.array(v.string())),
            correct_answer: v.optional(v.string()),
            expected_points: v.optional(v.array(v.string())),
        })),
        createdAt: v.any(),
    }).index("by_userId", ["userId"]),

    test_attempts: defineTable({
        userId: v.string(),
        testId: v.id("tests"),
        skill: v.string(),
        score: v.number(),
        confidence: v.number(),
        strengths: v.array(v.string()),
        weaknesses: v.array(v.string()),
        feedback: v.string(),
        readiness_impact: v.optional(v.number()),
        completedAt: v.any(),
    }).index("by_userId", ["userId"]).index("by_userId_and_skill", ["userId", "skill"]),

    daily_tests: defineTable({
        userId: v.string(),
        day: v.number(),
        skill: v.string(),
        difficulty: v.string(),
        questions: v.array(v.object({
            type: v.string(), // "mcq" | "concept" | "coding"
            question: v.string(),
            options: v.optional(v.array(v.string())),
            correct_answer: v.optional(v.string()),
            expected_points: v.optional(v.array(v.string())),
        })),
        status: v.string(), // "locked", "available", "completed"
        createdAt: v.any(),
    }).index("by_userId", ["userId"]).index("by_userId_and_day", ["userId", "day"]),

    test_results: defineTable({
        userId: v.string(),
        testId: v.id("daily_tests"),
        day: v.number(),
        skill: v.string(),
        score: v.number(),
        confidence: v.number(),
        strengths: v.array(v.string()),
        weaknesses: v.array(v.string()),
        feedback: v.string(),
        readiness_impact: v.optional(v.number()),
        attempted_at: v.any(),
    }).index("by_userId", ["userId"]).index("by_userId_and_day", ["userId", "day"]),

    user_progress: defineTable({
        userId: v.string(),
        current_day: v.number(),
        streak: v.number(),
        longest_streak: v.number(),
        readiness_score: v.number(),
        next_difficulty: v.optional(v.string()), // "beginner", "intermediate", "advanced"
        last_test_date: v.optional(v.number()), // timestamp to track streak
    }).index("by_userId", ["userId"]),

    resumes: defineTable({
        userId: v.string(),
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
        location: v.string(),
        summary: v.string(),
        experience: v.string(),
        education: v.string(),
        template: v.string(),
    }).index("by_userId", ["userId"]),
});
