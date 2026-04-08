import { mutation } from "./_generated/server";

const DOMAINS = [
    { 
        id: "frontend", 
        title: "Frontend Developer", 
        skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "HTML", "CSS", "Jest", "Framer Motion", "Redux", "GraphQL"] 
    },
    { 
        id: "backend", 
        title: "Backend Developer", 
        skills: ["Node.js", "Python", "SQL", "PostgreSQL", "Redis", "Docker", "Microservices", "REST APIs", "Go", "System Design"] 
    },
    { 
        id: "fullstack", 
        title: "Full Stack Developer", 
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "Prisma", "Next.js", "FastAPI", "MongoDB"] 
    },
    { 
        id: "data-science", 
        title: "Data Scientist", 
        skills: ["Python", "SQL", "NumPy", "Pandas", "Scikit-Learn", "PyTorch", "TensorFlow", "Matplotlib", "Statistics", "Big Data"] 
    },
    { 
        id: "devops", 
        title: "DevOps Engineer", 
        skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Ansible", "Prometheus", "Bash", "GitHub Actions"] 
    }
];

const LEVELS = [
    { id: "intern", range: "0-6 months", title: "Intern" },
    { id: "junior", range: "0-2 years", title: "Junior" },
    { id: "mid", range: "2-5 years", title: "Mid-Level" },
    { id: "senior", range: "5-10 years", title: "Senior" }
];

export const seedUsers = mutation({
    args: {},
    handler: async (ctx) => {
        // Clear previous mock users
        const existing = await ctx.db.query("user_profiles").collect();
        for (const user of existing) {
            if (user.userId.startsWith("mock_")) {
                // Delete associated role and analysis too
                const roles = await ctx.db.query("job_role_selections").withIndex("by_userId", q => q.eq("userId", user.userId)).collect();
                for (const r of roles) await ctx.db.delete(r._id);
                
                const analyses = await ctx.db.query("analyses").withIndex("by_userId", q => q.eq("userId", user.userId)).collect();
                for (const a of analyses) await ctx.db.delete(a._id);

                await ctx.db.delete(user._id);
            }
        }

        let totalSeeded = 0;

        for (const domain of DOMAINS) {
            for (const level of LEVELS) {
                // Generate 3 tiers of users for each combination
                const tiers = [
                    { suffix: "top", score: 92 + Math.floor(Math.random() * 6), skillCount: 10 },
                    { suffix: "mid", score: 68 + Math.floor(Math.random() * 12), skillCount: 6 },
                    { suffix: "entry", score: 35 + Math.floor(Math.random() * 15), skillCount: 3 }
                ];

                for (const tier of tiers) {
                    const userId = `mock_${domain.id}_${level.id}_${tier.suffix}_${Math.random().toString(36).substr(2, 4)}`;
                    const email = `${domain.id}-${level.id}-${tier.suffix}@skillup-mock.com`;
                    const userSkills = domain.skills.slice(0, tier.skillCount);

                    // 1. User Profile
                    await ctx.db.insert("user_profiles", {
                        userId,
                        email,
                        credits: 3,
                        membership: "free",
                        createdAt: Date.now(),
                    });

                    // 2. Role Selection
                    await ctx.db.insert("job_role_selections", {
                        userId,
                        domain: domain.id,
                        roleLevel: level.id,
                        experienceRange: level.range,
                        employmentType: "full-time",
                        responsibilities: [`Build premium ${domain.title} solutions`, `Collaborate with ${level.title} teams`],
                        coreSkills: userSkills,
                        bonusSkills: [],
                    });

                    // 3. Analysis
                    await ctx.db.insert("analyses", {
                        userId,
                        roleSnapshot: {
                            domain: domain.id,
                            roleLevel: level.id,
                            title: domain.title,
                        },
                        readinessScore: tier.score,
                        readinessStatus: tier.score > 85 ? "Ready" : tier.score > 60 ? "Developing" : "Learning",
                        matchedSkills: userSkills,
                        missingSkills: domain.skills.slice(tier.skillCount),
                        resumeFitScore: tier.score - (Math.random() * 10),
                        scoreBreakdown: userSkills.map((s, i) => ({
                            skill: s,
                            impact: 10,
                            status: "Matched",
                            scoreBoost: 5,
                            marketImportance: 8 - (i * 0.5)
                        })),
                        createdAt: Date.now(),
                    });

                    totalSeeded++;
                }
            }
        }

        return `Successfully seeded ${totalSeeded} users across all roles and levels.`;
    },
});
