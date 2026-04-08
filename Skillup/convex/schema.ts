import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    user_profiles: defineTable({
        userId: v.string(),
        email: v.string(),
        credits: v.number(),
        lastCreditReset: v.number(),
        membership: v.union(v.literal("free"), v.literal("pro"), v.literal("elite")),
        createdAt: v.number(),
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
        })),
        explanation: v.optional(v.object({
            factors: v.array(v.string()),
            coreCoverage: v.number(),
            secondaryCoverage: v.number(),
            bonusCoverage: v.number(),
            experienceFactor: v.number(),
        })),
        resumeText: v.optional(v.string()),
        createdAt: v.number(),
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
            })),
            youtubePlaylists: v.array(v.object({
                title: v.string(),
                channel: v.string(),
                url: v.string(),
                videos: v.number(),
            })),
        })),
    }).index("by_userId", ["userId"]),
});
