---
name: question-sweeper
description: Systematically sweeps through specific chapters of a subject, generating exhaustive exams covering all question types based on the user's Learning_Status.md. After grading, it consolidates the results into a unified tracking file across all subjects.
---

# Question Sweeper (掃題大師) Skill

This skill is designed to perform a comprehensive, topic-by-topic "sweep" (掃題) of a subject's chapters. It ensures the user has thoroughly mastered every possible question type within a specific chapter before moving on.

## Workflow

When the user triggers this skill (e.g., by asking "幫我掃題", "排查章節", "sweep questions"), follow these steps strictly:

### 1. Identify Target and Scope
1. Determine which subject and chapter the user wants to sweep. If they don't specify, read the `Consolidated_Learning_Status.md` or their subject-specific `Learning_Status.md` to suggest the next un-tested (`⚪`) or weak (`🔴`) chapter.
2. Acknowledge the target chapter and briefly outline the types of questions (題型) that will be covered in the sweep.

### 2. Generate the "Sweep Exam" (掃題考卷)
1. Generate an exhaustive exam specifically for the target chapter. 
2. The exam **MUST** cover every single common and advanced question type (題型) typically found in that chapter.
3. The difficulty and scale MUST align with the standard of the target exam (e.g., 台聯大模擬考).
4. Present the exam to the user and wait for them to provide their answers. 
5. **DO NOT** provide the answer key until the user has submitted their answers or explicitly requested to give up/see the answers.

### 3. Review and Analyze
1. Once the user submits their answers, review them meticulously.
2. Provide step-by-step corrections and explanations for any mistakes.
3. Identify exactly which specific sub-topics or question types the user is weak at within this chapter.

### 4. Consolidate and Update Learning Status
1. Determine the updated mastery status for the tested chapter based on the results:
   - 🟢 熟悉 (Familiar - Concepts clear, calculations stable)
   - 🟡 尚可 (Okay - Understands concepts, but makes careless mistakes)
   - 🔴 弱點 (Weakness - Concepts unclear, stuck frequently)
2. Update the newly assessed status, along with specific "易錯觀念 / 常錯題型" (Common pitfalls / Weak question types) into the **unified learning status file**:
   `c:\Users\Cupid\Downloads\台聯大模擬\Exam_paper\Consolidated_Learning_Status.md`.
3. If the user specifies updating the subject-specific `Learning_Status.md` as well, do so to keep everything synchronized.
4. Conclude by summarizing the updated status and suggesting the next chapter to sweep.
