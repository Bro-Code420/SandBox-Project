import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DAILY_FREE_CREDITS = 3;

export const storeUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            console.error("storeUser: No identity found.");
            throw new Error("Called storeUser without authentication");
        }

        // Check if we've already stored this user.
        const user = await ctx.db
            .query("user_profiles")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (user !== null) {
            return user._id;
        }

        // Initialize new user with 3 free credits
        return await ctx.db.insert("user_profiles", {
            userId: identity.subject,
            email: identity.email ?? "unknown",
            credits: DAILY_FREE_CREDITS,
            lastCreditReset: Date.now(),
            membership: "free",
            createdAt: Date.now(),
        });
    },
});

export const getProfile = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("user_profiles")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) return null;

        // Auto-reset logic if it's a new day
        const now = Date.now();
        const lastReset = new Date(user.lastCreditReset);
        const today = new Date(now);
        
        if (lastReset.toDateString() !== today.toDateString() && user.membership === "free") {
            // This is a query, so we can't mutate here directly.
            // In a real app, you might trigger a mutation or just return the "would-be" credits.
            // For now, let's just return the profile.
            return {
                ...user,
                credits: DAILY_FREE_CREDITS, // Return reset credits for the UI
            };
        }

        return user;
    },
});

export const useCredit = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Auth required");

        const user = await ctx.db
            .query("user_profiles")
            .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
            .unique();

        if (!user) throw new Error("User not found");
        
        if (user.membership === "free") {
            if (user.credits <= 0) {
                // Check if we should reset
                const now = Date.now();
                const lastReset = new Date(user.lastCreditReset);
                if (lastReset.toDateString() !== new Date(now).toDateString()) {
                    await ctx.db.patch(user._id, {
                        credits: DAILY_FREE_CREDITS - 1,
                        lastCreditReset: now
                    });
                    return true;
                }
                throw new Error("Out of credits");
            }

            await ctx.db.patch(user._id, {
                credits: user.credits - 1,
            });
        }
        
        return true;
    }
});
