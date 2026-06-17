---
name: report-generator
description: Generate structured, professional reports from raw data, notes, or conversation context. Trigger this skill whenever the user asks to "generate a report", "create a report", "彙整報告", "製作報告", "產生報告", or needs data synthesized into a formal document.
---

# Report Generator Skill

This skill is designed to take raw inputs (such as meeting notes, data points, or user instructions) and transform them into a well-structured, professional report.

## When to use

Use this skill when the user provides data or context and explicitly asks for a "report", "summary document", or "formal breakdown" of the information.

## How to generate the report

1. **Analyze the Input**: Carefully review the data, notes, or context provided by the user. Identify the core message, key metrics, and actionable items.
2. **Determine the Format**: Unless the user specifies a different format (like a CSV or a specific template), default to a structured **Markdown** report.
3. **Structure the Report**: Always use the following template as a baseline (you can add or remove sections if the user requests specific things):

## Default Report Template

```markdown
# [Report Title]

**Date**: [Current Date]
**Author**: [Your Name/AI]

## Executive Summary
[A brief, 1-2 paragraph high-level overview of what this report is about and its most critical conclusions. Someone should be able to read just this and understand the gist.]

## Background / Context
[Brief explanation of why this report was generated or the origin of the data.]

## Key Findings
- **[Finding 1]**: [Explanation or supporting data]
- **[Finding 2]**: [Explanation or supporting data]
- **[Finding 3]**: [Explanation or supporting data]

## Detailed Analysis
[A deeper dive into the provided data. This is where you can include tables, lists, or detailed paragraphs explaining the nuances of the information.]

## Recommendations / Next Steps
1. [Actionable step 1]
2. [Actionable step 2]
```

## Tone and Style
- Use a professional, objective, and analytical tone.
- Avoid fluff; be concise and to the point.
- Use formatting (bolding, lists, tables) to make the report scannable and easy to read.

## Output
Output the final report directly to the user in the chat, or if the user asks you to save it, use the appropriate file writing tool to save it as a `.md` file (or another requested format).
