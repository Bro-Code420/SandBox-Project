import type { JobDomain } from './types'

export const jobDomains: JobDomain[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: 'Layout',
    roles: {
      intern: {
        title: 'Frontend Developer Intern',
        experienceRange: '0-6 months',
        responsibilities: [
          'Assist in building UI components',
          'Learn and apply HTML, CSS, JavaScript',
          'Participate in code reviews',
          'Fix minor bugs and issues',
        ],
        coreSkills: ['HTML', 'CSS', 'JavaScript', 'Git'],
        bonusSkills: ['React Basics', 'Responsive Design'],
      },
      junior: {
        title: 'Junior Frontend Developer',
        experienceRange: '0-2 years',
        responsibilities: [
          'Build responsive web interfaces',
          'Implement UI designs from mockups',
          'Write clean, maintainable code',
          'Collaborate with designers and backend developers',
          'Debug and fix frontend issues',
        ],
        coreSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design'],
        bonusSkills: ['TypeScript', 'Next.js', 'Testing', 'Tailwind CSS'],
      },
      mid: {
        title: 'Mid-Level Frontend Developer',
        experienceRange: '2-5 years',
        responsibilities: [
          'Lead frontend feature development',
          'Mentor junior developers',
          'Optimize application performance',
          'Architect scalable frontend solutions',
          'Review code and ensure quality standards',
        ],
        coreSkills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Testing', 'Git', 'State Management'],
        bonusSkills: ['GraphQL', 'CI/CD', 'Performance Optimization', 'Accessibility'],
      },
      senior: {
        title: 'Senior Frontend Developer',
        experienceRange: '5+ years',
        responsibilities: [
          'Define frontend architecture and standards',
          'Lead technical decisions',
          'Mentor and grow the frontend team',
          'Drive innovation and best practices',
          'Collaborate with stakeholders on product direction',
        ],
        coreSkills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Testing', 'Architecture', 'Performance', 'Accessibility', 'Leadership'],
        bonusSkills: ['GraphQL', 'Micro-frontends', 'Design Systems', 'DevOps'],
      },
    },
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: 'Server',
    roles: {
      intern: {
        title: 'Backend Developer Intern',
        experienceRange: '0-6 months',
        responsibilities: [
          'Learn server-side programming',
          'Assist with API development',
          'Write basic database queries',
          'Participate in code reviews',
        ],
        coreSkills: ['Python', 'SQL', 'Git', 'REST APIs'],
        bonusSkills: ['Node.js', 'Docker Basics'],
      },
      junior: {
        title: 'Junior Backend Developer',
        experienceRange: '0-2 years',
        responsibilities: [
          'Build and maintain APIs',
          'Write database queries and manage data',
          'Implement business logic',
          'Write unit tests',
          'Debug and fix backend issues',
        ],
        coreSkills: ['Python', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Databases'],
        bonusSkills: ['Docker', 'Cloud Basics', 'Testing', 'Message Queues'],
      },
      mid: {
        title: 'Mid-Level Backend Developer',
        experienceRange: '2-5 years',
        responsibilities: [
          'Design and implement scalable APIs',
          'Optimize database performance',
          'Lead backend feature development',
          'Mentor junior developers',
          'Implement security best practices',
        ],
        coreSkills: ['Python', 'Node.js', 'SQL', 'NoSQL', 'REST APIs', 'Docker', 'Cloud Services', 'Testing', 'Security'],
        bonusSkills: ['Kubernetes', 'Microservices', 'GraphQL', 'Message Queues'],
      },
      senior: {
        title: 'Senior Backend Developer',
        experienceRange: '5+ years',
        responsibilities: [
          'Define system architecture',
          'Lead technical decisions',
          'Scale systems for growth',
          'Mentor and grow the backend team',
          'Drive engineering excellence',
        ],
        coreSkills: ['System Design', 'Microservices', 'Cloud Architecture', 'Security', 'Performance', 'Leadership', 'DevOps'],
        bonusSkills: ['ML/AI Integration', 'Event-Driven Architecture', 'Platform Engineering'],
      },
    },
  },
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    icon: 'Layers',
    roles: {
      intern: {
        title: 'Full Stack Developer Intern',
        experienceRange: '0-6 months',
        responsibilities: [
          'Learn both frontend and backend technologies',
          'Assist with full feature development',
          'Write basic tests',
          'Participate in code reviews',
        ],
        coreSkills: ['HTML', 'CSS', 'JavaScript', 'Python', 'SQL', 'Git'],
        bonusSkills: ['React Basics', 'Node.js Basics'],
      },
      junior: {
        title: 'Junior Full Stack Developer',
        experienceRange: '0-2 years',
        responsibilities: [
          'Build end-to-end features',
          'Develop frontend and backend code',
          'Write and maintain tests',
          'Deploy applications',
          'Debug issues across the stack',
        ],
        coreSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs'],
        bonusSkills: ['TypeScript', 'Docker', 'Cloud Basics', 'NoSQL'],
      },
      mid: {
        title: 'Mid-Level Full Stack Developer',
        experienceRange: '2-5 years',
        responsibilities: [
          'Lead full feature development',
          'Optimize both frontend and backend',
          'Mentor junior developers',
          'Design scalable solutions',
          'Implement CI/CD pipelines',
        ],
        coreSkills: ['TypeScript', 'React', 'Node.js', 'SQL', 'NoSQL', 'Docker', 'Cloud Services', 'Testing', 'CI/CD'],
        bonusSkills: ['Kubernetes', 'GraphQL', 'Microservices', 'Performance'],
      },
      senior: {
        title: 'Senior Full Stack Developer',
        experienceRange: '5+ years',
        responsibilities: [
          'Define technical architecture',
          'Lead engineering initiatives',
          'Mentor and grow the team',
          'Drive best practices',
          'Collaborate with product and design',
        ],
        coreSkills: ['System Design', 'Architecture', 'TypeScript', 'React', 'Node.js', 'Cloud', 'DevOps', 'Leadership'],
        bonusSkills: ['ML/AI', 'Platform Engineering', 'Product Strategy'],
      },
    },
  },
  {
    id: 'data',
    name: 'Data Science',
    icon: 'BarChart',
    roles: {
      intern: {
        title: 'Data Science Intern',
        experienceRange: '0-6 months',
        responsibilities: [
          'Learn data analysis techniques',
          'Assist with data cleaning and preparation',
          'Create basic visualizations',
          'Learn ML fundamentals',
        ],
        coreSkills: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
        bonusSkills: ['Pandas', 'NumPy', 'Jupyter'],
      },
      junior: {
        title: 'Junior Data Scientist',
        experienceRange: '0-2 years',
        responsibilities: [
          'Analyze datasets and derive insights',
          'Build basic ML models',
          'Create data visualizations and reports',
          'Clean and preprocess data',
          'Collaborate with stakeholders',
        ],
        coreSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'Data Visualization'],
        bonusSkills: ['TensorFlow', 'Deep Learning', 'Big Data', 'A/B Testing'],
      },
      mid: {
        title: 'Mid-Level Data Scientist',
        experienceRange: '2-5 years',
        responsibilities: [
          'Develop and deploy ML models',
          'Design experiments and A/B tests',
          'Lead data-driven projects',
          'Mentor junior data scientists',
          'Present insights to leadership',
        ],
        coreSkills: ['Python', 'ML Algorithms', 'Deep Learning', 'SQL', 'Statistics', 'MLOps', 'Communication'],
        bonusSkills: ['NLP', 'Computer Vision', 'Cloud ML', 'Leadership'],
      },
      senior: {
        title: 'Senior Data Scientist',
        experienceRange: '5+ years',
        responsibilities: [
          'Define data science strategy',
          'Lead ML architecture decisions',
          'Mentor and grow the data team',
          'Drive innovation with AI/ML',
          'Collaborate with executives',
        ],
        coreSkills: ['ML Strategy', 'Deep Learning', 'MLOps', 'Leadership', 'Communication', 'Research'],
        bonusSkills: ['Product Strategy', 'Business Development', 'Patents'],
      },
    },
  },
  {
    id: 'devops',
    name: 'DevOps Engineering',
    icon: 'Cloud',
    roles: {
      intern: {
        title: 'DevOps Intern',
        experienceRange: '0-6 months',
        responsibilities: [
          'Learn cloud platforms and tools',
          'Assist with CI/CD pipelines',
          'Learn containerization basics',
          'Monitor system health',
        ],
        coreSkills: ['Linux', 'Git', 'Bash', 'Docker Basics'],
        bonusSkills: ['AWS Basics', 'Python'],
      },
      junior: {
        title: 'Junior DevOps Engineer',
        experienceRange: '0-2 years',
        responsibilities: [
          'Build and maintain CI/CD pipelines',
          'Manage cloud infrastructure',
          'Containerize applications',
          'Monitor and troubleshoot systems',
          'Write automation scripts',
        ],
        coreSkills: ['Linux', 'Docker', 'CI/CD', 'Cloud (AWS/GCP/Azure)', 'Git', 'Scripting'],
        bonusSkills: ['Kubernetes', 'Terraform', 'Monitoring', 'Security'],
      },
      mid: {
        title: 'Mid-Level DevOps Engineer',
        experienceRange: '2-5 years',
        responsibilities: [
          'Design infrastructure architecture',
          'Implement Infrastructure as Code',
          'Optimize CI/CD processes',
          'Lead DevOps projects',
          'Mentor junior engineers',
        ],
        coreSkills: ['Kubernetes', 'Terraform', 'Cloud Architecture', 'CI/CD', 'Monitoring', 'Security', 'IaC'],
        bonusSkills: ['Service Mesh', 'GitOps', 'Platform Engineering', 'SRE'],
      },
      senior: {
        title: 'Senior DevOps Engineer',
        experienceRange: '5+ years',
        responsibilities: [
          'Define DevOps strategy and standards',
          'Lead platform engineering initiatives',
          'Scale infrastructure for growth',
          'Mentor and grow the DevOps team',
          'Drive reliability and efficiency',
        ],
        coreSkills: ['Platform Engineering', 'Cloud Architecture', 'SRE', 'Leadership', 'Security', 'Cost Optimization'],
        bonusSkills: ['Multi-cloud', 'FinOps', 'Compliance'],
      },
    },
  },
]

export const allSkills = [
  // Frontend
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte',
  'Tailwind CSS', 'SASS/SCSS', 'Bootstrap', 'Responsive Design', 'Accessibility', 'SEO',
  'State Management', 'Redux', 'Zustand', 'GraphQL Client', 'REST API Integration',
  'Testing', 'Jest', 'Cypress', 'Playwright', 'Performance Optimization',
  
  // Backend
  'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'PHP', 'Ruby',
  'Express.js', 'Fastify', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'REST APIs', 'GraphQL', 'gRPC', 'WebSockets',
  'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'ORMs', 'Prisma', 'Sequelize', 'SQLAlchemy',
  
  // DevOps
  'Git', 'GitHub', 'GitLab', 'CI/CD', 'Docker', 'Kubernetes', 'Terraform',
  'AWS', 'GCP', 'Azure', 'Linux', 'Bash', 'Shell Scripting',
  'Monitoring', 'Prometheus', 'Grafana', 'ELK Stack',
  'Security', 'OWASP', 'SSL/TLS',
  
  // Data Science
  'Statistics', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
  'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch',
  'Data Visualization', 'Tableau', 'Power BI', 'Matplotlib', 'Seaborn',
  'Big Data', 'Spark', 'Hadoop', 'Kafka',
  'A/B Testing', 'MLOps', 'Feature Engineering',
  
  // Soft Skills
  'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Agile', 'Scrum',
]

export const skillDependencies: Record<string, string[]> = {
  'React': ['JavaScript', 'HTML', 'CSS'],
  'Next.js': ['React', 'JavaScript'],
  'TypeScript': ['JavaScript'],
  'Redux': ['React', 'JavaScript'],
  'GraphQL Client': ['JavaScript', 'REST API Integration'],
  'Node.js': ['JavaScript'],
  'Express.js': ['Node.js', 'JavaScript'],
  'Django': ['Python'],
  'Flask': ['Python'],
  'FastAPI': ['Python'],
  'Prisma': ['Node.js', 'SQL'],
  'Docker': ['Linux', 'Bash'],
  'Kubernetes': ['Docker', 'Linux'],
  'Terraform': ['Cloud Basics', 'Linux'],
  'TensorFlow': ['Python', 'Machine Learning'],
  'PyTorch': ['Python', 'Machine Learning'],
  'Deep Learning': ['Machine Learning', 'Statistics'],
  'Machine Learning': ['Python', 'Statistics'],
  'MLOps': ['Machine Learning', 'Docker', 'CI/CD'],
}

export const courseRecommendations: Record<string, { title: string; platform: string; url: string; duration: string }[]> = {
  'TypeScript': [
    { title: 'TypeScript for Beginners', platform: 'Udemy', url: '#', duration: '8 hours' },
    { title: 'Understanding TypeScript', platform: 'Coursera', url: '#', duration: '12 hours' },
  ],
  'React': [
    { title: 'React - The Complete Guide', platform: 'Udemy', url: '#', duration: '48 hours' },
    { title: 'React Basics', platform: 'Coursera', url: '#', duration: '20 hours' },
  ],
  'Next.js': [
    { title: 'Next.js & React - The Complete Guide', platform: 'Udemy', url: '#', duration: '25 hours' },
    { title: 'Learn Next.js', platform: 'Vercel', url: '#', duration: '10 hours' },
  ],
  'Testing': [
    { title: 'JavaScript Testing Introduction', platform: 'Udemy', url: '#', duration: '8 hours' },
    { title: 'React Testing Library', platform: 'Testing JavaScript', url: '#', duration: '15 hours' },
  ],
  'Docker': [
    { title: 'Docker Mastery', platform: 'Udemy', url: '#', duration: '20 hours' },
    { title: 'Intro to Containers', platform: 'Coursera', url: '#', duration: '12 hours' },
  ],
  'Kubernetes': [
    { title: 'Kubernetes for Developers', platform: 'Udemy', url: '#', duration: '15 hours' },
    { title: 'Getting Started with Kubernetes', platform: 'Coursera', url: '#', duration: '18 hours' },
  ],
}

export const youtubeRecommendations: Record<string, { title: string; channel: string; url: string; videos: number }[]> = {
  'TypeScript': [
    { title: 'TypeScript Full Course', channel: 'Traversy Media', url: '#', videos: 1 },
    { title: 'TypeScript Tutorial', channel: 'The Net Ninja', url: '#', videos: 12 },
  ],
  'React': [
    { title: 'React JS Crash Course', channel: 'Traversy Media', url: '#', videos: 1 },
    { title: 'Full React Course', channel: 'freeCodeCamp', url: '#', videos: 1 },
  ],
  'Next.js': [
    { title: 'Next.js 14 Full Course', channel: 'JavaScript Mastery', url: '#', videos: 1 },
    { title: 'Next.js Tutorial for Beginners', channel: 'The Net Ninja', url: '#', videos: 10 },
  ],
  'Testing': [
    { title: 'React Testing Library Tutorial', channel: 'The Net Ninja', url: '#', videos: 8 },
    { title: 'Jest Crash Course', channel: 'Traversy Media', url: '#', videos: 1 },
  ],
  'Docker': [
    { title: 'Docker Tutorial for Beginners', channel: 'TechWorld with Nana', url: '#', videos: 1 },
    { title: 'Docker Crash Course', channel: 'Traversy Media', url: '#', videos: 1 },
  ],
  'Kubernetes': [
    { title: 'Kubernetes Tutorial for Beginners', channel: 'TechWorld with Nana', url: '#', videos: 1 },
    { title: 'Kubernetes Course', channel: 'freeCodeCamp', url: '#', videos: 1 },
  ],
}
