# Visionix Dashboard Improvements Tracking

This document tracks the identified improvements, data consistency fixes, and personalization enhancements for the Visionix Dashboard. It serves as a future-work reference before proceeding to subsequent implementation phases.

---

## Permanent Design Constraints

> [!IMPORTANT]
> **Dashboard Design is Locked**
> - The existing dashboard visual design, layout, spacing, typography, gradients, borders, responsive styling, and animations are **locked** and must not be changed.
> - Cards must not be redesigned, replaced, or removed without explicit approval.
> - All improvements must focus purely on **personalization correctness, verified data integrity, backend service mapping, and dynamic empty-state behaviors**.

---

## Confirmed Dashboard Personalization & Data Issues

### 1. Global Personalization Rule
- The entire dashboard must consistently derive its domain, nomenclature, and contextual suggestions from the user's actual profile fields:
  - `education.stream` (Degree Program)
  - `education.branchSpecialization` (Specialization)
  - `careerGoals.interests` (Area of Interest)
  - `skills.technicalSkills` (Current Skills)
  - `careerGoals.dreamCareer` (Dream Career)
- Fallbacks must resolve to clean empty/neutral states instead of falling back to default AI/ML values.

### 2. Stats Grid Cards Details
- **AI Career Match Card:**
  - Must reflect the user's actual matching career path and industry (e.g., *Civil Engineer* in *Civil Engineering / Construction*).
  - Match score, confidence, rank, and experience indicators must use verified metrics from the recommendation engine without fabricated values.
- **Current Progress Card:**
  - Remove all seeded values (*6 / 24*, *42 hrs*, *Neural Networks*, *24%*, *76%*, *2 Lessons*).
  - Must query the actual `LearningProgress` and `CareerProgress` collections in MongoDB.
  - If no progress exists, render a zero/neutral state (e.g. *0% progress*, *0 completed modules*).
- **Skills Learned Card:**
  - Use the user's actual verified technical skills. Do not display recommended/target skills as "learned" or display default AI/ML topics (*PyTorch*, *TensorFlow*).
  - If no verified skills are learned, show *0 verified* or a neutral state.
- **Certificates Card:**
  - Remove seeded certificate references (*ML Foundations*, *Coursera*, *AWS ML*).
  - Query actual user certification collections. If none exist, show *0 Earned* and clear issued dates, provider, and next goals.

### 3. Recommended Career Card
- Exclude internal snake_case identifiers (such as `civil_engineer`) and replace with clean, capitalized labels (e.g. `Civil Engineer`).
- Generate description from actual profile recommendations instead of exposing raw internal debugging transcripts (like conversation summaries, raw QA records, or motivation fields).
- Growth, difficulty, time required, and salary fields must resolve to `Not Specified` or empty values unless verified data exists.

### 4. Roadmap Card
- Match the roadmap title to the active domain (e.g., `Civil Engineer Career Roadmap` instead of `AI & Machine Learning Engineer`).
- Ensure all roadmap phases and key skills match the target domain, drawing directly from the career recommendation service.
- Derive completion percentages from actual `CareerProgress` milestone logs rather than hardcoding progress.

### 5. Career Assistant Card
- Dynamic assistant message context must reference the user's active profile, avoiding hardcoded default greetings.

### 6. YouTube Learning No-API-Key Behavior
- Ensure that if `YOUTUBE_API_KEY` is missing or fails:
  - The endpoint `/api/personalization/youtube` successfully returns a clean empty list `[]`.
  - The frontend card displays: *"YouTube learning tutorials are currently unavailable."* without displaying mock videos or broken thumbnail images.

---

## Future Enhancements
- **On-Chain Certification Verification:** Connect the Certificates card to real-world certificate verification protocols or document uploads in the database.
- **Granular Study Logs:** Extend the study hours metrics in `LearningProgress` to aggregate actual session durations instead of returning default averages.
