import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

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

export const optimizeResume = mutation({
    args: {
        userId: v.string(),
        jobDescription: v.optional(v.string()),
        targetRole: v.optional(v.string()),
        resumeId: v.optional(v.id("resumes")),
    },
    handler: async (ctx, args) => {
        const resume = await ctx.db
            .query("resumes")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (!resume) throw new Error("Resume not found");

        const analysis = await ctx.db
            .query("analyses")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .first();

        const progress = await ctx.db
            .query("user_progress")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        const targetRole = args.targetRole || analysis?.roleSnapshot?.title || "Software Engineer";
        const readinessScore = progress?.readiness_score || 50;

        // Smart Bullet Generator & Text Optimizer (Heuristic ML Simulation)
        let newExperience = resume.experience;
        const weakVerbs = ["Built", "Made", "Did", "Worked on", "Helped with", "Fixed", "built", "made", "did", "worked on", "helped with", "fixed"];
        const strongVerbs = ["Engineered", "Architected", "Executed", "Spearheaded", "Collaborated on", "Resolved"];
        
        weakVerbs.forEach((verb, idx) => {
            const regex = new RegExp(`\\b${verb}\\b`, "g");
            newExperience = newExperience.replace(regex, strongVerbs[idx % strongVerbs.length]);
        });

        // Add metrics heuristically if missing
        if (!newExperience.includes("%") && readinessScore > 60) {
            newExperience += `\n- Improved system performance and reduced latency by 25%.`;
        }

        // Skill Gap Integration & Job-Targeted Optimization
        let recommendedSkills = analysis?.missingSkills?.slice(0, 3) || [];
        if (args.jobDescription) {
            const keywords = ["React", "Node", "Python", "Docker", "AWS", "SQL", "GraphQL", "TypeScript", "System Design", "Microservices"];
            const desc = args.jobDescription.toLowerCase();
            recommendedSkills = keywords.filter(k => desc.includes(k.toLowerCase()));
        }

        // ATS Scoring Engine
        let atsScore = 60; // Base score
        let missingKeywords: string[] = [];
        let strengths: string[] = [];
        let weaknesses: string[] = [];
        let recommendedChanges: string[] = [];

        if (resume.summary.length > 50) {
            atsScore += 10;
            strengths.push("Comprehensive professional summary.");
        } else {
            weaknesses.push("Professional summary is too short.");
            recommendedChanges.push("Expand your summary to highlight key achievements.");
        }

        if (newExperience.split("-").length > 3) {
            atsScore += 15;
            strengths.push("Good amount of bullet points in experience.");
        } else {
            weaknesses.push("Lack of detailed experience bullets.");
            recommendedChanges.push("Add more bullet points with measurable impacts.");
        }

        if (resume.phone && resume.email) {
            atsScore += 5;
        } else {
            weaknesses.push("Missing contact information.");
        }

        const roleKeywords = targetRole.split(" ");
        const hasKeywords = roleKeywords.some(k => resume.summary.includes(k) || newExperience.includes(k));
        if (hasKeywords) {
            atsScore += 10;
        } else {
            missingKeywords.push(...roleKeywords);
            recommendedChanges.push(`Include keywords related to '${targetRole}'.`);
        }

        // Cap ATS score
        atsScore = Math.min(100, Math.max(0, atsScore));

        // Multi-Version / Role-Based Tuning
        let optimizedSummary = resume.summary;
        if (targetRole.toLowerCase().includes("frontend")) {
            if (!optimizedSummary.includes("UI/UX")) optimizedSummary += " Passionate about crafting intuitive UI/UX.";
        } else if (targetRole.toLowerCase().includes("backend")) {
            if (!optimizedSummary.includes("API")) optimizedSummary += " Focused on designing scalable APIs and system architecture.";
        }

        // Readiness feedback
        if (readinessScore < 40) {
            recommendedChanges.push("Focus on highlighting active learning and personal projects.");
        } else if (readinessScore > 80) {
            strengths.push("High readiness score—emphasize advanced projects and leadership.");
        }

        return {
            optimized_resume: {
                ...resume,
                summary: optimizedSummary,
                experience: newExperience,
            },
            ats_analysis: {
                ats_score: atsScore,
                strengths,
                weaknesses,
                missing_keywords: missingKeywords,
                recommended_changes: recommendedChanges,
            },
            suggestions: {
                suggested_skills: recommendedSkills,
                reason: "High demand in target role and improves ATS score."
            }
        };
    }
});
