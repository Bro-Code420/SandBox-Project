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

        const targetRole = args.targetRole || (analysis as any)?.roleSnapshot?.title || "Software Engineer";
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
        const hasKeywords = roleKeywords.some((k: string) => resume.summary.includes(k) || newExperience.includes(k));
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

export const predictCareerOutcome = mutation({
    args: {
        userId: v.string(),
        targetRole: v.string(),
        atsScore: v.number(),
    },
    handler: async (ctx, args) => {
        // Fetch necessary data
        const analysis = await ctx.db
            .query("analyses")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .first();

        const progress = await ctx.db
            .query("user_progress")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        const testResults = await ctx.db
            .query("test_results")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .collect();

        // 1. Calculate Leaderboard Rank and Total Users
        const allProgress = await ctx.db.query("user_progress").collect();
        const safe_total_users = Math.max(allProgress.length, 10); // Assume at least 10 users for mock
        const sortedProgress = [...allProgress].sort((a, b) => b.readiness_score - a.readiness_score);
        let rank = sortedProgress.findIndex(p => p.userId === args.userId) + 1;
        if (rank === 0) rank = Math.floor(safe_total_users / 2); // Default to middle if not found

        const readiness_score = progress?.readiness_score || 50;
        const percentile = Math.round(((safe_total_users - rank + 0.5) / safe_total_users) * 100);
        const final_percentile = Math.min(99, Math.max(1, percentile));

        // 2. Identify Top Skills in Role & Missing
        const matchedSkills = analysis?.matchedSkills || [];
        const top_skills_in_role = ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "SQL"];
        const missing_from_top = top_skills_in_role.filter(skill => !matchedSkills.includes(skill));

        // 3. Skill Validation (Truth Engine)
        const risk_skills: string[] = [];
        const unverified_skills: string[] = [];

        matchedSkills.forEach((skill: string) => {
            const testsForSkill = testResults.filter((t: any) => t.skill === skill);
            if (testsForSkill.length > 0) {
                const avgConfidence = testsForSkill.reduce((acc: number, t: any) => acc + t.confidence, 0) / testsForSkill.length;
                if (avgConfidence < 50) risk_skills.push(skill);
            } else {
                unverified_skills.push(skill);
            }
        });

        // 4. Interview Probability Calculation
        const atsWeight = 0.40;
        const readinessWeight = 0.35;
        const percentileWeight = 0.10;
        const confidenceWeight = 0.15;
        
        let avgConfidence = 50;
        if (testResults.length > 0) {
            avgConfidence = testResults.reduce((acc: number, t: any) => acc + t.confidence, 0) / testResults.length;
        }

        const baseProbability = (args.atsScore * atsWeight) + 
                              (readiness_score * readinessWeight) + 
                              (final_percentile * percentileWeight) + 
                              (avgConfidence * confidenceWeight);
                              
        const interview_probability = Math.round(Math.min(95, Math.max(5, baseProbability)));

        // 5. What-If Simulation Engine
        const simulations = [];
        const skillsToSimulate = analysis?.missingSkills?.slice(0, 3) || missing_from_top.slice(0, 3);
        
        for (const skill of skillsToSimulate) {
            const ats_boost = args.atsScore >= 85 ? 2 : 8;
            const simulated_ats = Math.min(100, args.atsScore + ats_boost);
            
            const readiness_boost = readiness_score >= 85 ? 3 : 10;
            const simulated_readiness = Math.min(100, readiness_score + readiness_boost);
            
            const simulated_percentile = Math.min(99, final_percentile + 5);
            
            const new_probability = Math.round((simulated_ats * atsWeight) + 
                                             (simulated_readiness * readinessWeight) + 
                                             (simulated_percentile * percentileWeight) + 
                                             (avgConfidence * confidenceWeight));
            
            simulations.push({
                skill,
                new_ats_score: simulated_ats,
                new_readiness: simulated_readiness,
                new_rank: Math.max(1, rank - 2),
                new_probability: Math.min(95, new_probability)
            });
        }

        // 6. Final Insights Generation
        let summary = "";
        const next_steps: string[] = [];

        if (interview_probability < 40) {
            summary = "Your profile is currently below industry benchmarks for this role. Major skill gaps and low ATS alignment are holding you back.";
            next_steps.push(`Focus intensely on acquiring ${missing_from_top[0] || 'core backend skills'}.`);
            next_steps.push("Improve your resume format to boost your ATS score above 70.");
        } else if (interview_probability < 75) {
            summary = "You have a solid foundation but face stiff competition. Missing a few key market-demanded skills.";
            if (skillsToSimulate.length > 0) {
                next_steps.push(`Learn ${skillsToSimulate[0]} to steadily boost your interview chances.`);
            }
        } else {
            summary = "You are a highly competitive candidate. Your readiness and ATS scores align closely with top industry standards.";
            next_steps.push("Start applying directly to senior or specialized roles.");
        }

        // Add verification steps
        if (risk_skills.length > 0) {
            next_steps.push(`Retake tests for ${risk_skills.slice(0, 2).join(", ")} to repair your confidence score.`);
        } else if (unverified_skills.length > 0) {
            next_steps.push(`Take skill tests for ${unverified_skills.slice(0, 2).join(", ")} to verify your resume claims.`);
        }

        return {
            interview_probability,
            percentile: final_percentile,
            missing_from_top,
            risk_skills,
            unverified_skills,
            simulations,
            insights: {
                summary,
                next_steps
            }
        };
    }
});
