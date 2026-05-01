import type { TemplateDefinition } from "@/lib/types";

export const TEMPLATES: Record<string, TemplateDefinition> = {
  vocabulary: {
    id: "vocabulary",
    name: "Vocabulary List",
    description: "Build word lists with definitions, parts of speech, and example sentences.",
    icon: "📖",
    fields: [
      { key: "word",            label: "Word",             placeholder: "e.g. ephemeral",           required: true,  multiline: false },
      { key: "definition",      label: "Definition",       placeholder: "Lasting for a short time", required: true,  multiline: true  },
      { key: "partOfSpeech",    label: "Part of Speech",   placeholder: "e.g. adjective",           required: false, multiline: false },
      { key: "exampleSentence", label: "Example Sentence", placeholder: "Use it in a sentence…",   required: false, multiline: true  },
    ],
    emptyCard: () => ({ word: "", definition: "", partOfSpeech: "", exampleSentence: "" }),
  },
  flashcard: {
    id: "flashcard",
    name: "Flashcard (Q&A)",
    description: "Classic question-and-answer cards. Tap to flip.",
    icon: "🃏",
    fields: [
      { key: "front", label: "Front (Question)", placeholder: "What is…?",      required: true, multiline: true },
      { key: "back",  label: "Back (Answer)",    placeholder: "The answer is…", required: true, multiline: true },
    ],
    emptyCard: () => ({ front: "", back: "" }),
  },
  definition: {
    id: "definition",
    name: "Definition Cards",
    description: "Glossary-style cards with a term on the front and full definition on the back.",
    icon: "📚",
    fields: [
      { key: "term",       label: "Term",       placeholder: "e.g. Photosynthesis",          required: true, multiline: false },
      { key: "definition", label: "Definition", placeholder: "The process by which plants…", required: true, multiline: true  },
    ],
    emptyCard: () => ({ term: "", definition: "" }),
  },
  "word-examples": {
    id: "word-examples",
    name: "Word & Examples",
    description: "Show a word with its meaning and multiple example sentences as bullet points.",
    icon: "✏️",
    fields: [
      { key: "word",     label: "Word",     placeholder: "e.g. persevere",                        required: true,  multiline: false },
      { key: "meaning",  label: "Meaning",  placeholder: "To continue despite difficulty…",        required: true,  multiline: true  },
      { key: "examples", label: "Examples (one per line)", placeholder: "She persevered through the hardship.\nHe never stopped persevering.", required: true, multiline: true },
    ],
    emptyCard: () => ({ word: "", meaning: "", examples: "" }),
  },
  ielts: {
    id: "ielts",
    name: "IELTS Practice",
    description: "Practice IELTS questions with model answers and band score tips.",
    icon: "🎓",
    fields: [
      { key: "questionType", label: "Question Type",  placeholder: "e.g. Task 2 Essay, Speaking Part 2", required: true,  multiline: false },
      { key: "prompt",       label: "Prompt",         placeholder: "Some people think… Do you agree?",   required: true,  multiline: true  },
      { key: "modelAnswer",  label: "Model Answer",   placeholder: "Write the model answer here…",       required: true,  multiline: true  },
      { key: "bandTips",     label: "Band Score Tips", placeholder: "Use cohesive devices, vary vocabulary…", required: false, multiline: true },
    ],
    emptyCard: () => ({ questionType: "", prompt: "", modelAnswer: "", bandTips: "" }),
  },
  "software-concept": {
    id: "software-concept",
    name: "Software Concept",
    description: "Learn software engineering concepts with explanations and code examples.",
    icon: "💻",
    fields: [
      { key: "concept",     label: "Concept",      placeholder: "e.g. Dependency Injection",          required: true,  multiline: false },
      { key: "explanation", label: "Explanation",  placeholder: "A design pattern where…",             required: true,  multiline: true  },
      { key: "codeExample", label: "Code Example", placeholder: "const service = new Service(dep);",  required: false, multiline: true  },
    ],
    emptyCard: () => ({ concept: "", explanation: "", codeExample: "" }),
  },
  "physics-formula": {
    id: "physics-formula",
    name: "Physics Formula",
    description: "Memorize physics formulas with variable definitions and context notes.",
    icon: "⚛️",
    fields: [
      { key: "formulaName", label: "Formula Name", placeholder: "e.g. Newton's Second Law",      required: true,  multiline: false },
      { key: "formula",     label: "Formula",      placeholder: "F = ma",                        required: true,  multiline: false },
      { key: "variables",   label: "Variables (one per line)", placeholder: "F: Force (Newtons)\nm: mass (kg)\na: acceleration (m/s²)", required: true, multiline: true },
      { key: "notes",       label: "Notes",        placeholder: "Applies to classical mechanics…", required: false, multiline: true },
    ],
    emptyCard: () => ({ formulaName: "", formula: "", variables: "", notes: "" }),
  },
  "math-problem": {
    id: "math-problem",
    name: "Math Problem",
    description: "Practice math problems with step-by-step solutions and hints.",
    icon: "🧮",
    fields: [
      { key: "problem",  label: "Problem",               placeholder: "Solve: 2x² + 5x − 3 = 0",              required: true,  multiline: true  },
      { key: "solution", label: "Solution (step by step)", placeholder: "Step 1: Factor…\nStep 2: …\nAnswer: x = …", required: true, multiline: true },
      { key: "hint",     label: "Hint",                  placeholder: "Try factoring or the quadratic formula", required: false, multiline: true  },
    ],
    emptyCard: () => ({ problem: "", solution: "", hint: "" }),
  },
  "case-study": {
    id: "case-study",
    name: "Case Study",
    description: "Analyze real-world scenarios with structured breakdowns and key takeaways.",
    icon: "📋",
    fields: [
      { key: "title",     label: "Title",            placeholder: "e.g. Netflix's Pivot to Streaming",   required: true,  multiline: false },
      { key: "scenario",  label: "Scenario",         placeholder: "Describe the situation or problem…",  required: true,  multiline: true  },
      { key: "analysis",  label: "Analysis",         placeholder: "Key decisions, challenges, outcomes…", required: true,  multiline: true  },
      { key: "takeaways", label: "Takeaways (one per line)", placeholder: "Adapt early to disruption.\nData-driven decisions matter.", required: false, multiline: true },
    ],
    emptyCard: () => ({ title: "", scenario: "", analysis: "", takeaways: "" }),
  },
  "english-grammar": {
    id: "english-grammar",
    name: "English Grammar",
    description: "Master grammar rules with clear explanations, examples, and common mistake warnings.",
    icon: "📝",
    fields: [
      { key: "rule",          label: "Rule / Pattern",    placeholder: "e.g. Present Perfect vs Simple Past", required: true,  multiline: false },
      { key: "explanation",   label: "Explanation",       placeholder: "Use Present Perfect when…",           required: true,  multiline: true  },
      { key: "examples",      label: "Examples (one per line)", placeholder: "I have visited Paris.\nShe visited Paris last year.", required: true, multiline: true },
      { key: "commonMistake", label: "Common Mistake",   placeholder: "Don't say: I have seen him yesterday", required: false, multiline: true  },
    ],
    emptyCard: () => ({ rule: "", explanation: "", examples: "", commonMistake: "" }),
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES);
