"""Learning resources database for skill-based recommendations.

Maps skills to curated courses and YouTube playlists.
"""

from typing import Dict, List, Any

# Resource database: skill -> list of resources
LEARNING_RESOURCES: Dict[str, List[Dict[str, Any]]] = {
    "python": [
        {
            "type": "course",
            "title": "Python for Everybody",
            "provider": "Coursera",
            "url": "https://www.coursera.org/specializations/python",
            "difficulty": "beginner",
            "duration_hours": 40,
        },
        {
            "type": "youtube",
            "title": "Python Tutorial for Beginners",
            "channel": "Programming with Mosh",
            "url": "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
            "difficulty": "beginner",
            "duration_hours": 6,
        },
    ],
    "javascript": [
        {
            "type": "course",
            "title": "JavaScript: Understanding the Weird Parts",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/understand-javascript/",
            "difficulty": "intermediate",
            "duration_hours": 12,
        },
        {
            "type": "youtube",
            "title": "JavaScript Full Course",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            "difficulty": "beginner",
            "duration_hours": 3,
        },
    ],
    "typescript": [
        {
            "type": "course",
            "title": "Understanding TypeScript",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/understanding-typescript/",
            "difficulty": "intermediate",
            "duration_hours": 15,
        },
        {
            "type": "youtube",
            "title": "TypeScript Tutorial for Beginners",
            "channel": "Academind",
            "url": "https://www.youtube.com/watch?v=BwuLxPH8IDs",
            "difficulty": "beginner",
            "duration_hours": 3,
        },
    ],
    "react": [
        {
            "type": "course",
            "title": "React - The Complete Guide",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
            "difficulty": "intermediate",
            "duration_hours": 48,
        },
        {
            "type": "youtube",
            "title": "React JS Full Course",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=bMknfKXIFA8",
            "difficulty": "beginner",
            "duration_hours": 12,
        },
    ],
    "node.js": [
        {
            "type": "course",
            "title": "The Complete Node.js Developer Course",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/",
            "difficulty": "intermediate",
            "duration_hours": 35,
        },
        {
            "type": "youtube",
            "title": "Node.js Tutorial for Beginners",
            "channel": "Programming with Mosh",
            "url": "https://www.youtube.com/watch?v=TlB_eWDSMt4",
            "difficulty": "beginner",
            "duration_hours": 1,
        },
    ],
    "sql": [
        {
            "type": "course",
            "title": "The Complete SQL Bootcamp",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/",
            "difficulty": "beginner",
            "duration_hours": 9,
        },
        {
            "type": "youtube",
            "title": "SQL Tutorial - Full Database Course",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
            "difficulty": "beginner",
            "duration_hours": 4,
        },
    ],
    "docker": [
        {
            "type": "course",
            "title": "Docker Mastery",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/docker-mastery/",
            "difficulty": "intermediate",
            "duration_hours": 20,
        },
        {
            "type": "youtube",
            "title": "Docker Tutorial for Beginners",
            "channel": "TechWorld with Nana",
            "url": "https://www.youtube.com/watch?v=3c-iBn73dDE",
            "difficulty": "beginner",
            "duration_hours": 3,
        },
    ],
    "aws": [
        {
            "type": "course",
            "title": "AWS Certified Solutions Architect",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate/",
            "difficulty": "intermediate",
            "duration_hours": 27,
        },
        {
            "type": "youtube",
            "title": "AWS Tutorial For Beginners",
            "channel": "Simplilearn",
            "url": "https://www.youtube.com/watch?v=k1RI5locZE4",
            "difficulty": "beginner",
            "duration_hours": 4,
        },
    ],
    "kubernetes": [
        {
            "type": "course",
            "title": "Kubernetes for the Absolute Beginners",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/learn-kubernetes/",
            "difficulty": "beginner",
            "duration_hours": 6,
        },
        {
            "type": "youtube",
            "title": "Kubernetes Tutorial for Beginners",
            "channel": "TechWorld with Nana",
            "url": "https://www.youtube.com/watch?v=X48VuDVv0do",
            "difficulty": "beginner",
            "duration_hours": 4,
        },
    ],
    "git": [
        {
            "type": "course",
            "title": "Git Complete: The definitive guide",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/git-complete/",
            "difficulty": "beginner",
            "duration_hours": 6,
        },
        {
            "type": "youtube",
            "title": "Git and GitHub for Beginners",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=RGOj5yH7evk",
            "difficulty": "beginner",
            "duration_hours": 1,
        },
    ],
    "machine learning": [
        {
            "type": "course",
            "title": "Machine Learning by Andrew Ng",
            "provider": "Coursera",
            "url": "https://www.coursera.org/learn/machine-learning",
            "difficulty": "intermediate",
            "duration_hours": 60,
        },
        {
            "type": "youtube",
            "title": "Machine Learning Course for Beginners",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=NWONeJKn6kc",
            "difficulty": "beginner",
            "duration_hours": 10,
        },
    ],
    "pandas": [
        {
            "type": "course",
            "title": "Data Analysis with Pandas and Python",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/data-analysis-with-pandas/",
            "difficulty": "beginner",
            "duration_hours": 19,
        },
        {
            "type": "youtube",
            "title": "Pandas Tutorial",
            "channel": "Corey Schafer",
            "url": "https://www.youtube.com/watch?v=ZyhVh-qRZPA",
            "difficulty": "beginner",
            "duration_hours": 6,
        },
    ],
    "scikit-learn": [
        {
            "type": "course",
            "title": "Scikit-Learn For Machine Learning",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/machine-learning-with-scikit-learn/",
            "difficulty": "intermediate",
            "duration_hours": 8,
        },
        {
            "type": "youtube",
            "title": "Scikit-Learn Tutorial",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=0B5eIE_1vpU",
            "difficulty": "beginner",
            "duration_hours": 3,
        },
    ],
    "tensorflow": [
        {
            "type": "course",
            "title": "TensorFlow Developer Certificate",
            "provider": "Coursera",
            "url": "https://www.coursera.org/professional-certificates/tensorflow-in-practice",
            "difficulty": "intermediate",
            "duration_hours": 40,
        },
        {
            "type": "youtube",
            "title": "TensorFlow 2.0 Complete Course",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=tPYj3fFJGjk",
            "difficulty": "intermediate",
            "duration_hours": 7,
        },
    ],
    "next.js": [
        {
            "type": "course",
            "title": "Next.js & React - The Complete Guide",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/nextjs-react-the-complete-guide/",
            "difficulty": "intermediate",
            "duration_hours": 25,
        },
        {
            "type": "youtube",
            "title": "Next.js Tutorial for Beginners",
            "channel": "Traversy Media",
            "url": "https://www.youtube.com/watch?v=mTz0GXj8NN0",
            "difficulty": "beginner",
            "duration_hours": 1,
        },
    ],
    "rest api": [
        {
            "type": "youtube",
            "title": "REST API Design Best Practices",
            "channel": "Traversy Media",
            "url": "https://www.youtube.com/watch?v=Q-BpqyOT3a8",
            "difficulty": "beginner",
            "duration_hours": 1,
        },
    ],
    "testing": [
        {
            "type": "course",
            "title": "Testing JavaScript",
            "provider": "TestingJavaScript.com",
            "url": "https://testingjavascript.com/",
            "difficulty": "intermediate",
            "duration_hours": 12,
        },
        {
            "type": "youtube",
            "title": "Unit Testing Tutorial",
            "channel": "Fireship",
            "url": "https://www.youtube.com/watch?v=u6QfIXgjwGQ",
            "difficulty": "beginner",
            "duration_hours": 0.5,
        },
    ],
    "ci/cd": [
        {
            "type": "youtube",
            "title": "CI/CD Pipeline Tutorial",
            "channel": "TechWorld with Nana",
            "url": "https://www.youtube.com/watch?v=scEDHsr3APg",
            "difficulty": "intermediate",
            "duration_hours": 2,
        },
    ],
    "graphql": [
        {
            "type": "course",
            "title": "GraphQL with React: The Complete Developers Guide",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/graphql-with-react-course/",
            "difficulty": "intermediate",
            "duration_hours": 13,
        },
        {
            "type": "youtube",
            "title": "GraphQL Full Course",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=ed8SzALpx1Q",
            "difficulty": "beginner",
            "duration_hours": 4,
        },
    ],
    "linux": [
        {
            "type": "course",
            "title": "Linux Mastery",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/linux-mastery/",
            "difficulty": "beginner",
            "duration_hours": 12,
        },
        {
            "type": "youtube",
            "title": "Linux for Beginners",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=sWbUDq4S6Y8",
            "difficulty": "beginner",
            "duration_hours": 3,
        },
    ],
    "terraform": [
        {
            "type": "course",
            "title": "HashiCorp Certified: Terraform Associate",
            "provider": "Udemy",
            "url": "https://www.udemy.com/course/terraform-beginner-to-advanced/",
            "difficulty": "intermediate",
            "duration_hours": 13,
        },
    ],
    "html": [
        {
            "type": "youtube",
            "title": "HTML Full Course",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=pQN-pnXPaVg",
            "difficulty": "beginner",
            "duration_hours": 2,
        },
    ],
    "css": [
        {
            "type": "youtube",
            "title": "CSS Tutorial - Full Course",
            "channel": "freeCodeCamp",
            "url": "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
            "difficulty": "beginner",
            "duration_hours": 11,
        },
    ],
    "tailwind": [
        {
            "type": "youtube",
            "title": "Tailwind CSS Full Course",
            "channel": "Traversy Media",
            "url": "https://www.youtube.com/watch?v=dFgzHOX84xQ",
            "difficulty": "beginner",
            "duration_hours": 3,
        },
    ],
}

# Default resource for skills without specific entries
DEFAULT_RESOURCE = {
    "type": "search",
    "title": "Search for learning resources",
    "provider": "Google",
    "url": "https://www.google.com/search?q=learn+{skill}",
    "difficulty": "beginner",
    "duration_hours": 10,
}


def get_resources_for_skill(skill: str, max_resources: int = 3) -> List[Dict[str, Any]]:
    """Get learning resources for a skill."""
    skill_lower = skill.lower().strip()
    resources = LEARNING_RESOURCES.get(skill_lower, [])
    
    if not resources:
        # Return default search resource
        default = DEFAULT_RESOURCE.copy()
        default["url"] = default["url"].format(skill=skill_lower.replace(" ", "+"))
        default["title"] = f"Learn {skill}"
        return [default]
    
    return resources[:max_resources]


def get_resources_for_skills(skills: List[str], max_per_skill: int = 2) -> Dict[str, List[Dict[str, Any]]]:
    """Get learning resources for multiple skills."""
    return {
        skill: get_resources_for_skill(skill, max_per_skill)
        for skill in skills
    }
