import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveAnalysis = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        return await ctx.db.insert("analyses", {
            userId: identity.subject,
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const getLatestAnalysis = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("analyses")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .first();
    },
});

export const listAnalyses = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        return await ctx.db
            .query("analyses")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .take(10);
    },
});
export const getAnalysisById = query({
    args: { id: v.id("analyses") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const analysis = await ctx.db.get(args.id);
        if (!analysis || analysis.userId !== identity.subject) return null;

        return analysis;
    },
});
