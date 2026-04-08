import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveRoadmap = mutation({
    args: {
        analysisId: v.id("analyses"),
        weeks: v.array(v.object({
            weekNumber: v.number(),
            focusSkill: v.string(),
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
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        return await ctx.db.insert("roadmaps", {
            userId: identity.subject,
            ...args,
        });
    },
});

export const getRoadmapByAnalysisId = query({
    args: { analysisId: v.id("analyses") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("roadmaps")
            .filter((q) => q.eq(q.field("analysisId"), args.analysisId))
            .unique();
    },
});

export const getLatestRoadmap = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("roadmaps")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .order("desc")
            .first();
    },
});

export const toggleWeekCompletion = mutation({
    args: { roadmapId: v.id("roadmaps"), weekNumber: v.number() },
    handler: async (ctx, args) => {
        const roadmap = await ctx.db.get(args.roadmapId);
        if (!roadmap) throw new Error("Roadmap not found");

        const newWeeks = roadmap.weeks.map((w) => {
            if (w.weekNumber === args.weekNumber) {
                return { ...w, completed: !w.completed };
            }
            return w;
        });

        await ctx.db.patch(args.roadmapId, { weeks: newWeeks });
        return true;
    },
});
