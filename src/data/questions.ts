import { Question } from '../types/assessment';

export const assessmentQuestions: Question[] = [
  { id: 1, text: "I step forward and take charge in leaderless situations.", category: "E", categoryName: "Surgency / Extraversion" },
  { id: 2, text: "I am concerned about getting along well with others.", category: "A", categoryName: "Agreeableness" },
  { id: 3, text: "I have good self-control; I don't get emotional and get angry and yell.", category: "N", categoryName: "Adjustment / Emotional Stability" },
  { id: 4, text: "I'm dependable; when I say I will do something, it's done well and on time.", category: "C", categoryName: "Conscientiousness" },
  { id: 5, text: "I try to do things differently to improve my performance.", category: "O", categoryName: "Openness to Experience" },
  { id: 6, text: "I enjoy competing and winning; losing bothers me.", category: "E", categoryName: "Surgency / Extraversion" },
  { id: 7, text: "I enjoy having lots of friends and going to parties.", category: "A", categoryName: "Agreeableness" },
  { id: 8, text: "I perform well under pressure.", category: "N", categoryName: "Adjustment / Emotional Stability" },
  { id: 9, text: "I work hard to be successful.", category: "C", categoryName: "Conscientiousness" },
  { id: 10, text: "I go to new places and enjoy traveling.", category: "O", categoryName: "Openness to Experience" },
  { id: 11, text: "I am outgoing and willing to confront people when in conflict.", category: "E", categoryName: "Surgency / Extraversion" },
  { id: 12, text: "I try to see things from other people's points of view.", category: "A", categoryName: "Agreeableness" },
  { id: 13, text: "I am an optimistic person who sees the positive side of situations (the cup is half full).", category: "N", categoryName: "Adjustment / Emotional Stability" },
  { id: 14, text: "I am a well-organized person.", category: "C", categoryName: "Conscientiousness" },
  { id: 15, text: "When I go to a new restaurant, I order foods I haven't tried.", category: "O", categoryName: "Openness to Experience" },
  { id: 16, text: "I want to climb the corporate ladder to as high a level of management as I can.", category: "E", categoryName: "Surgency / Extraversion" },
  { id: 17, text: "I want other people to like me and to be viewed as very friendly.", category: "A", categoryName: "Agreeableness" },
  { id: 18, text: "I give people lots of praise and encouragement; I don't put people down and criticize.", category: "N", categoryName: "Adjustment / Emotional Stability" },
  { id: 19, text: "I conform by following the rules of an organization.", category: "C", categoryName: "Conscientiousness" },
  { id: 20, text: "I volunteer to be the first to learn or do new tasks at work.", category: "O", categoryName: "Openness to Experience" },
  { id: 21, text: "I try to influence other people to get my way.", category: "E", categoryName: "Surgency / Extraversion" },
  { id: 22, text: "I enjoy working with others more than working alone.", category: "A", categoryName: "Agreeableness" },
  { id: 23, text: "I view myself as being relaxed and secure, rather than nervous and insecure.", category: "N", categoryName: "Adjustment / Emotional Stability" },
  { id: 24, text: "I am considered credible because I do a good job and come through for people.", category: "C", categoryName: "Conscientiousness" },
  { id: 25, text: "When people suggest doing things differently, I support them and help bring about change; I don't make statements such as, \"It will not work,\" \"We never did it before,\" \"Who else did it?\" or \"We can't do it.\"", category: "O", categoryName: "Openness to Experience" }
];

export const oceanCategoryDescriptions = {
  O: {
    title: "Openness to Experience",
    short: "Intellectual curiosity, creativity, and receptivity to new ideas.",
    description: "Reflects intellectual curiosity, creativity, and openness to novel methods (Items 5, 10, 15, 20, 25).",
    color: "#38BDF8",
  },
  C: {
    title: "Conscientiousness",
    short: "Self-discipline, organization, dependability, and rule compliance.",
    description: "Reflects dependability, work ethic, organization, and credibility (Items 4, 9, 14, 19, 24).",
    color: "#8B5CF6",
  },
  E: {
    title: "Surgency / Extraversion",
    short: "Leadership initiative, assertiveness, ambition, and social influence.",
    description: "Reflects willingness to take charge, compete, assert influence, and lead (Items 1, 6, 11, 16, 21).",
    color: "#F59E0B",
  },
  A: {
    title: "Agreeableness",
    short: "Compassion, empathy, interpersonal harmony, and affiliation.",
    description: "Reflects empathy, concern for others, friendliness, and collaboration (Items 2, 7, 12, 17, 22).",
    color: "#10B981",
  },
  N: {
    title: "Adjustment / Emotional Stability",
    short: "Calmness, self-control, composure under pressure, and optimism.",
    description: "Reflects self-control, pressure tolerance, optimism, and security (Items 3, 8, 13, 18, 23).",
    color: "#EC4899",
  }
};
