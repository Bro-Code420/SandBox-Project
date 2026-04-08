# Role Definitions

This document describes all available job roles and their skill requirements at each experience level.

## Overview

The system supports **5 job roles** with **4 experience levels** each, totaling 20 unique role configurations.

### Experience Levels

| Level | Experience Range | Description |
|-------|------------------|-------------|
| `intern` | 0-1 years | Entry-level, learning fundamentals |
| `junior` | 0-2 years | Early career, building proficiency |
| `mid` | 2-5 years | Experienced, independent contributor |
| `senior` | 5-10 years | Expert, technical leadership |

### Skill Categories

| Category | Weight | Description |
|----------|--------|-------------|
| **Core** | 1.0 | Essential skills - must have |
| **Secondary** | 0.6 | Important skills - should have |
| **Bonus** | 0.3 | Nice-to-have skills - differentiators |

---

## Frontend Developer

**Domain:** Web Development

### Intern
- **Experience:** 0-1 years
- **Core:** html, css, javascript
- **Secondary:** react, git
- **Bonus:** typescript, tailwind

### Junior
- **Experience:** 0-2 years
- **Core:** html, css, javascript, react
- **Secondary:** typescript, git, rest api
- **Bonus:** next.js, tailwind, testing

### Mid
- **Experience:** 2-5 years
- **Core:** html, css, javascript, react, typescript
- **Secondary:** next.js, rest api, git, testing
- **Bonus:** graphql, webpack, ci/cd

### Senior
- **Experience:** 5-10 years
- **Core:** javascript, typescript, react, next.js
- **Secondary:** graphql, testing, ci/cd, docker
- **Bonus:** aws, kubernetes, leadership

---

## Backend Developer

**Domain:** Web Development

### Intern
- **Experience:** 0-1 years
- **Core:** python, sql
- **Secondary:** git, rest api
- **Bonus:** docker, linux

### Junior
- **Experience:** 0-2 years
- **Core:** python, sql, rest api
- **Secondary:** git, docker, postgresql
- **Bonus:** redis, testing, linux

### Mid
- **Experience:** 2-5 years
- **Core:** python, sql, rest api, docker
- **Secondary:** postgresql, redis, testing, ci/cd
- **Bonus:** kubernetes, aws, graphql

### Senior
- **Experience:** 5-10 years
- **Core:** python, sql, docker, kubernetes
- **Secondary:** aws, ci/cd, graphql, redis
- **Bonus:** terraform, leadership, elasticsearch

---

## Full Stack Developer

**Domain:** Web Development

### Intern
- **Experience:** 0-1 years
- **Core:** html, css, javascript
- **Secondary:** python, sql, git
- **Bonus:** react, node.js

### Junior
- **Experience:** 0-2 years
- **Core:** javascript, react, node.js, sql
- **Secondary:** typescript, rest api, git, docker
- **Bonus:** mongodb, postgresql, testing

### Mid
- **Experience:** 2-5 years
- **Core:** javascript, typescript, react, node.js, sql
- **Secondary:** docker, rest api, postgresql, testing
- **Bonus:** aws, ci/cd, graphql

### Senior
- **Experience:** 5-10 years
- **Core:** typescript, react, node.js, docker
- **Secondary:** aws, kubernetes, ci/cd, graphql
- **Bonus:** terraform, leadership, elasticsearch

---

## Data Scientist

**Domain:** Data Science

### Intern
- **Experience:** 0-1 years
- **Core:** python, pandas, numpy
- **Secondary:** sql, data visualization
- **Bonus:** scikit-learn, git

### Junior
- **Experience:** 0-2 years
- **Core:** python, pandas, numpy, scikit-learn
- **Secondary:** sql, data visualization, machine learning
- **Bonus:** tensorflow, git, docker

### Mid
- **Experience:** 2-5 years
- **Core:** python, pandas, scikit-learn, machine learning
- **Secondary:** tensorflow, sql, docker, deep learning
- **Bonus:** pytorch, aws, nlp

### Senior
- **Experience:** 5-10 years
- **Core:** python, machine learning, deep learning, tensorflow
- **Secondary:** pytorch, aws, docker, kubernetes
- **Bonus:** nlp, computer vision, leadership

---

## DevOps Engineer

**Domain:** Infrastructure

### Intern
- **Experience:** 0-1 years
- **Core:** linux, git
- **Secondary:** python, docker
- **Bonus:** aws, ci/cd

### Junior
- **Experience:** 0-2 years
- **Core:** linux, docker, git, ci/cd
- **Secondary:** python, aws, kubernetes
- **Bonus:** terraform, jenkins

### Mid
- **Experience:** 2-5 years
- **Core:** docker, kubernetes, aws, ci/cd
- **Secondary:** terraform, linux, python
- **Bonus:** azure, gcp, elasticsearch

### Senior
- **Experience:** 5-10 years
- **Core:** kubernetes, aws, terraform, ci/cd
- **Secondary:** docker, python, azure
- **Bonus:** gcp, leadership, elasticsearch

---

## Skill Taxonomy

### Programming Languages
python, javascript, typescript, java, c++, c#, go, rust, ruby, php, swift, kotlin

### Frontend
html, css, react, angular, vue, next.js, tailwind, sass, webpack, vite

### Backend
node.js, express, fastapi, django, flask, spring boot, asp.net, graphql, rest api

### Databases
sql, mysql, postgresql, mongodb, redis, elasticsearch, firebase

### Cloud & DevOps
aws, azure, gcp, docker, kubernetes, ci/cd, terraform, jenkins, github actions

### Data & ML
pandas, numpy, scikit-learn, tensorflow, pytorch, machine learning, deep learning, data analysis, data visualization, nlp, computer vision

### Tools & Practices
git, linux, agile, scrum, jira, testing, unit testing, tdd

---

## Adding New Roles

To add a new role, edit `data/role_definitions.py`:

```python
ROLE_DEFINITIONS["new_role_id"] = {
    "title": "New Role Title",
    "domain": "Domain Name",
    "levels": {
        "intern": {
            "experience_range": (0, 1),
            "skills": {
                "core": ["skill1", "skill2"],
                "secondary": ["skill3"],
                "bonus": ["skill4"],
            },
            "readiness_threshold": 0.6,
        },
        # ... other levels
    },
}
```

Make sure all skills are in the skill taxonomy (`data/skill_taxonomy.py`).
