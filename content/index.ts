// Bundled library content. Every deck lives in its own JSON file under
// content/decks/<category>/; categories.json lists the categories in display
// order. These files are the source of truth for built-in content: edit them
// directly, and add a new deck file to DECK_FILES below to ship it.
//
// Ids must never change once shipped: user progress and edits are keyed by them.
import type { ContentCategory, ContentDeck } from "@/lib/contentTypes";
import categories from "./categories.json";
import d1 from "./decks/emotions-and-feelings/chapter-1-naming-what-you-feel.json";
import d2 from "./decks/travel-and-places/chapter-1-on-the-road.json";
import d3 from "./decks/everyday-conversation/chapter-1-sounding-natural.json";
import d4 from "./decks/story/micro-fiction.json";
import d5 from "./decks/pm-interview-cases/product-sense-cases.json";
import c1 from "./decks/pm-interview-cases/metrics-and-growth-cases.json";
import c2 from "./decks/pm-interview-cases/engineering-and-incident-cases.json";
import d6 from "./decks/english-sentence-patterns/comparison-and-emphasis.json";
import d7 from "./decks/everyday-japanese/workplace-phrases.json";
import d8 from "./decks/trivia-and-knowledge/world-capitals.json";
import q1 from "./decks/trivia-and-knowledge/science-and-nature.json";
import q2 from "./decks/trivia-and-knowledge/history-and-geography.json";
import d9 from "./decks/python-idioms/core-idioms.json";
import d10 from "./decks/speeches-and-talks/keynote-the-attention-economy.json";
import d11 from "./decks/data-structures/stack-lifo.json";
import d12 from "./decks/shayari-and-poems/original-verses.json";
import d13 from "./decks/professional-email-templates/everyday-requests.json";
import e1 from "./decks/professional-email-templates/follow-ups-and-status-updates.json";
import e2 from "./decks/professional-email-templates/escalations-and-difficult-conversations.json";
import d14 from "./decks/software-engineering-vocab/engineer-s-lexicon.json";
import d15 from "./decks/humanities-vocab/words-for-thinkers.json";
import d16 from "./decks/phrasal-verbs/most-used-phrasal-verbs.json";
import d17 from "./decks/proverbs/proverbs-and-meanings.json";
import d18 from "./decks/motivation-quotes/words-to-move-you.json";
import d19 from "./decks/newspaper-reading/newspaper-politics-and-government.json";
import d20 from "./decks/newspaper-reading/newspaper-economy-and-business.json";
import d21 from "./decks/newspaper-reading/newspaper-law-courts-and-crime.json";
import d22 from "./decks/newspaper-reading/newspaper-science-tech-and-health.json";
import d23 from "./decks/newspaper-reading/newspaper-society-education-and-culture.json";
import d24 from "./decks/speaking-fluency/speaking-connectors-and-fluent-phrases.json";
import d25 from "./decks/speaking-fluency/speaking-powerful-adjectives.json";
import d26 from "./decks/speaking-fluency/speaking-action-and-reporting-verbs.json";
import d27 from "./decks/speaking-fluency/speaking-abstract-nouns-and-ideas.json";
import d28 from "./decks/speaking-fluency/speaking-workplace-and-daily-life.json";
import d29 from "./decks/english-hindi-guide/1-society-politics-capitalism-socialism-and-ideology.json";
import d30 from "./decks/english-hindi-guide/2-constitution-and-constitutional-knowledge.json";
import d31 from "./decks/english-hindi-guide/3-human-rights-and-law.json";
import d32 from "./decks/english-hindi-guide/4-media-and-propaganda.json";
import d33 from "./decks/english-hindi-guide/5-political-economy-and-ideologies.json";
import d34 from "./decks/english-hindi-guide/6-human-nature.json";
import d35 from "./decks/english-hindi-guide/7-psychology-and-behavior.json";
import d36 from "./decks/english-hindi-guide/8-environment-and-climate.json";
import d37 from "./decks/english-hindi-guide/9-technology-and-society.json";
import d38 from "./decks/english-hindi-guide/10-international-relations.json";
import d39 from "./decks/english-hindi-guide/11-education-and-knowledge.json";
import d40 from "./decks/english-hindi-guide/12-health-and-society.json";
import d41 from "./decks/english-hindi-guide/13-economy-and-development.json";
import d42 from "./decks/english-hindi-guide/14-social-justice.json";
import d43 from "./decks/english-hindi-guide/15-moral-education-and-responsibilities.json";
import d44 from "./decks/english-hindi-guide/16-parenting-and-kids-education.json";
import d45 from "./decks/english-hindi-guide/17-social-responsibility.json";
import d46 from "./decks/english-hindi-guide/18-careers-and-growth.json";
import d47 from "./decks/english-hindi-guide/19-positivity.json";
import d48 from "./decks/english-hindi-guide/20-struggle-and-overcoming.json";
import d49 from "./decks/workplace-communication/stand-up-meetings.json";
import d50 from "./decks/workplace-communication/software-product-demo.json";
import d51 from "./decks/workplace-communication/convey-a-message.json";
import d52 from "./decks/workplace-communication/convey-ideas.json";
import d53 from "./decks/english-expressions/newspaper-headlines-and-reporting.json";
import d54 from "./decks/english-expressions/more-phrasal-verbs.json";
import d55 from "./decks/english-expressions/idioms.json";
import d56 from "./decks/english-expressions/proverbs-and-sayings.json";
import d57 from "./decks/infographics/everyday-processes.json";
import d58 from "./decks/infographics/picture-vocabulary.json";
import d59 from "./decks/infographics/picture-stories.json";
import d60 from "./decks/workplace-english/work-and-engineering-communication.json";
import d61 from "./decks/workplace-english/discussion-and-meeting-vocabulary.json";
import d62 from "./decks/workplace-english/leadership-influence-and-career-growth.json";
import d63 from "./decks/workplace-english/problem-solving-and-critical-thinking.json";
import d64 from "./decks/tech-and-finance-domain/architecture-design-and-trade-offs.json";
import d65 from "./decks/tech-and-finance-domain/finance-business-and-asset-management.json";
import d66 from "./decks/ielts-and-academic-vocabulary/society-education-and-technology.json";
import d67 from "./decks/ielts-and-academic-vocabulary/environment-health-and-economy.json";
import d68 from "./decks/ielts-and-academic-vocabulary/precise-expression-words.json";
import d69 from "./decks/idioms-phrasal-verbs-and-proverbs/idioms-and-collocations.json";
import d70 from "./decks/idioms-phrasal-verbs-and-proverbs/phrasal-verbs-in-action.json";
import d71 from "./decks/idioms-phrasal-verbs-and-proverbs/proverbs-in-use.json";
import d72 from "./decks/meeting-phrases-say-it/opinions-agreement-and-disagreement.json";
import d73 from "./decks/meeting-phrases-say-it/proposing-probing-and-checking.json";
import d74 from "./decks/meeting-phrases-say-it/linking-steering-and-summing-up.json";

export const CONTENT_CATEGORIES = categories as ContentCategory[];

const DECK_FILES: unknown[] = [
  d1,
  d2,
  d3,
  d4,
  d5,
  c1,
  c2,
  d6,
  d7,
  d8,
  q1,
  q2,
  d9,
  d10,
  d11,
  d12,
  d13,
  e1,
  e2,
  d14,
  d15,
  d16,
  d17,
  d18,
  d19,
  d20,
  d21,
  d22,
  d23,
  d24,
  d25,
  d26,
  d27,
  d28,
  d29,
  d30,
  d31,
  d32,
  d33,
  d34,
  d35,
  d36,
  d37,
  d38,
  d39,
  d40,
  d41,
  d42,
  d43,
  d44,
  d45,
  d46,
  d47,
  d48,
  d49,
  d50,
  d51,
  d52,
  d53,
  d54,
  d55,
  d56,
  d57,
  d58,
  d59,
  d60,
  d61,
  d62,
  d63,
  d64,
  d65,
  d66,
  d67,
  d68,
  d69,
  d70,
  d71,
  d72,
  d73,
  d74,
];

export const CONTENT_DECKS = DECK_FILES as ContentDeck[];
