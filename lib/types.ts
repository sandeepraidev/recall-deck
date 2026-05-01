export type TemplateId = "vocabulary" | "flashcard" | "definition" | "word-examples" | "ielts" | "software-concept" | "physics-formula" | "math-problem" | "case-study" | "english-grammar";

export type TextAlign = "left" | "center" | "right";

export interface VocabularyCard {
  id: string;
  word: string;
  definition: string;
  partOfSpeech?: string;
  exampleSentence?: string;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
}

export interface DefinitionCard {
  id: string;
  term: string;
  definition: string;
}

export interface WordExamplesCard {
  id: string;
  word: string;
  meaning: string;
  examples: string; // newline-separated list of example sentences
}

export interface IELTSCard {
  id: string;
  questionType: string; // e.g. "Task 2 Essay", "Speaking Part 2"
  prompt: string;
  modelAnswer: string;
  bandTips?: string;
}

export interface SoftwareConceptCard {
  id: string;
  concept: string;
  explanation: string;
  codeExample?: string;
}

export interface PhysicsFormulaCard {
  id: string;
  formulaName: string;
  formula: string;
  variables: string; // newline-separated "symbol: meaning"
  notes?: string;
}

export interface MathProblemCard {
  id: string;
  problem: string;
  solution: string; // step-by-step, newline-separated
  hint?: string;
}

export interface CaseStudyCard {
  id: string;
  title: string;
  scenario: string;
  analysis: string;
  takeaways?: string; // newline-separated
}

export interface EnglishGrammarCard {
  id: string;
  rule: string;
  explanation: string;
  examples: string; // newline-separated
  commonMistake?: string;
}

export type Card = VocabularyCard | FlashCard | DefinitionCard | WordExamplesCard | IELTSCard | SoftwareConceptCard | PhysicsFormulaCard | MathProblemCard | CaseStudyCard | EnglishGrammarCard;

export interface TemplateField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  multiline: boolean;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  fields: TemplateField[];
  emptyCard: () => Omit<Card, "id">;
}

export interface Deck {
  id: string;
  name: string;
  templateId: TemplateId;
  color: string;
  textAlign: TextAlign;
  createdAt: string;
  updatedAt: string;
  cards: Card[];
}

export function isVocabularyCard(_card: Card, tid: TemplateId): _card is VocabularyCard {
  return tid === "vocabulary";
}

export function isFlashCard(_card: Card, tid: TemplateId): _card is FlashCard {
  return tid === "flashcard";
}

export function isDefinitionCard(_card: Card, tid: TemplateId): _card is DefinitionCard {
  return tid === "definition";
}

export function isWordExamplesCard(_card: Card, tid: TemplateId): _card is WordExamplesCard {
  return tid === "word-examples";
}

export function isIELTSCard(_card: Card, tid: TemplateId): _card is IELTSCard {
  return tid === "ielts";
}

export function isSoftwareConceptCard(_card: Card, tid: TemplateId): _card is SoftwareConceptCard {
  return tid === "software-concept";
}

export function isPhysicsFormulaCard(_card: Card, tid: TemplateId): _card is PhysicsFormulaCard {
  return tid === "physics-formula";
}

export function isMathProblemCard(_card: Card, tid: TemplateId): _card is MathProblemCard {
  return tid === "math-problem";
}

export function isCaseStudyCard(_card: Card, tid: TemplateId): _card is CaseStudyCard {
  return tid === "case-study";
}

export function isEnglishGrammarCard(_card: Card, tid: TemplateId): _card is EnglishGrammarCard {
  return tid === "english-grammar";
}
