import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveJobRole = mutation({
    args: {
        domain: v.string(),
        roleLevel: v.string(),
        experienceRange: v.string(),
        employmentType: v.string(),
        responsibilities: v.array(v.string()),
        coreSkills: v.array(v.string()),
        bonusSkills: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            console.error("saveJobRole: Unauthenticated");
            throw new Error("Unauthenticated");
        }

        const existing = await ctx.db
            .query("job_role_selections")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { ...args });
            return existing._id;
        } else {
            return await ctx.db.insert("job_role_selections", {
                userId: identity.subject,
                ...args,
            });
        }
    },
});

export const saveUserSkills = mutation({
    args: {
        skills: v.array(v.string()),
        resumeText: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            console.error("saveUserSkills: Unauthenticated");
            throw new Error("Unauthenticated");
        }

        const existing = await ctx.db
            .query("user_skills")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                skills: args.skills,
                resumeText: args.resumeText
            });
            return existing._id;
        } else {
            return await ctx.db.insert("user_skills", {
                userId: identity.subject,
                skills: args.skills,
                resumeText: args.resumeText,
            });
        }
    },
});

export const getJobRole = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("job_role_selections")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();
    },
});

export const getUserSkills = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("user_skills")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();
    },
});
