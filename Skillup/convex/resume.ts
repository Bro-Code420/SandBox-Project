import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getResume = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("resumes")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();
    },
});

export const saveResume = mutation({
    args: {
        userId: v.string(),
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
        location: v.string(),
        summary: v.string(),
        experience: v.string(),
        education: v.string(),
        template: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("resumes")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                fullName: args.fullName,
                email: args.email,
                phone: args.phone,
                location: args.location,
                summary: args.summary,
                experience: args.experience,
                education: args.education,
                template: args.template,
            });
            return existing._id;
        } else {
            return await ctx.db.insert("resumes", {
                userId: args.userId,
                fullName: args.fullName,
                email: args.email,
                phone: args.phone,
                location: args.location,
                summary: args.summary,
                experience: args.experience,
                education: args.education,
                template: args.template,
            });
        }
    }
});
