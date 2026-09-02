// Deterministic Backend Scoring & Competency Engine for HRM301 25-Item Big Five Assessment

export const HRM301_QUESTIONS = [
  { id: 1, text: "I step forward and take charge in leaderless situations.", dimension: "E", dimensionName: "Surgency / Extraversion", order: 1, reverse: false },
  { id: 2, text: "I am concerned about getting along well with others.", dimension: "A", dimensionName: "Agreeableness", order: 2, reverse: false },
  { id: 3, text: "I have good self-control; I don't get emotional and get angry and yell.", dimension: "N", dimensionName: "Adjustment / Emotional Stability", order: 3, reverse: false },
  { id: 4, text: "I'm dependable; when I say I will do something, it's done well and on time.", dimension: "C", dimensionName: "Conscientiousness", order: 4, reverse: false },
  { id: 5, text: "I try to do things differently to improve my performance.", dimension: "O", dimensionName: "Openness to Experience", order: 5, reverse: false },
  { id: 6, text: "I enjoy competing and winning; losing bothers me.", dimension: "E", dimensionName: "Surgency / Extraversion", order: 6, reverse: false },
  { id: 7, text: "I enjoy having lots of friends and going to parties.", dimension: "A", dimensionName: "Agreeableness", order: 7, reverse: false },
  { id: 8, text: "I perform well under pressure.", dimension: "N", dimensionName: "Adjustment / Emotional Stability", order: 8, reverse: false },
  { id: 9, text: "I work hard to be successful.", dimension: "C", dimensionName: "Conscientiousness", order: 9, reverse: false },
  { id: 10, text: "I go to new places and enjoy traveling.", dimension: "O", dimensionName: "Openness to Experience", order: 10, reverse: false },
  { id: 11, text: "I am outgoing and willing to confront people when in conflict.", dimension: "E", dimensionName: "Surgency / Extraversion", order: 11, reverse: false },
  { id: 12, text: "I try to see things from other people's points of view.", dimension: "A", dimensionName: "Agreeableness", order: 12, reverse: false },
  { id: 13, text: "I am an optimistic person who sees the positive side of situations (the cup is half full).", dimension: "N", dimensionName: "Adjustment / Emotional Stability", order: 13, reverse: false },
  { id: 14, text: "I am a well-organized person.", dimension: "C", dimensionName: "Conscientiousness", order: 14, reverse: false },
  { id: 15, text: "When I go to a new restaurant, I order foods I haven't tried.", dimension: "O", dimensionName: "Openness to Experience", order: 15, reverse: false },
  { id: 16, text: "I want to climb the corporate ladder to as high a level of management as I can.", dimension: "E", dimensionName: "Surgency / Extraversion", order: 16, reverse: false },
  { id: 17, text: "I want other people to like me and to be viewed as very friendly.", dimension: "A", dimensionName: "Agreeableness", order: 17, reverse: false },
  { id: 18, text: "I give people lots of praise and encouragement; I don't put people down and criticize.", dimension: "N", dimensionName: "Adjustment / Emotional Stability", order: 18, reverse: false },
  { id: 19, text: "I conform by following the rules of an organization.", dimension: "C", dimensionName: "Conscientiousness", order: 19, reverse: false },
  { id: 20, text: "I volunteer to be the first to learn or do new tasks at work.", dimension: "O", dimensionName: "Openness to Experience", order: 20, reverse: false },
  { id: 21, text: "I try to influence other people to get my way.", dimension: "E", dimensionName: "Surgency / Extraversion", order: 21, reverse: false },
  { id: 22, text: "I enjoy working with others more than working alone.", dimension: "A", dimensionName: "Agreeableness", order: 22, reverse: false },
  { id: 23, text: "I view myself as being relaxed and secure, rather than nervous and insecure.", dimension: "N", dimensionName: "Adjustment / Emotional Stability", order: 23, reverse: false },
  { id: 24, text: "I am considered credible because I do a good job and come through for people.", dimension: "C", dimensionName: "Conscientiousness", order: 24, reverse: false },
  { id: 25, text: "When people suggest doing things differently, I support them and help bring about change; I don't make statements such as, \"It will not work,\" \"We never did it before,\" \"Who else did it?\" or \"We can't do it.\"", dimension: "O", dimensionName: "Openness to Experience", order: 25, reverse: false }
];

export function getTraitLevel(percentageScore) {
  if (percentageScore >= 85) return 'Very High';
  if (percentageScore >= 70) return 'High';
  if (percentageScore >= 50) return 'Moderate';
  if (percentageScore >= 35) return 'Low';
  return 'Very Low';
}

export function calculateOceanScores(responses) {
  // Mapping based on HRM301 Industrial Psychology assignment logic
  const categoryMap = {
    E: [1, 6, 11, 16, 21],
    A: [2, 7, 12, 17, 22],
    N: [3, 8, 13, 18, 23],
    C: [4, 9, 14, 19, 24],
    O: [5, 10, 15, 20, 25],
  };

  const getSum = (qIds) => {
    let sum = 0;
    qIds.forEach(id => {
      let val = Number(responses[id]) || Number(responses[String(id)]) || 4; // Default Likert 1-7 is 4
      if (val < 1) val = 1;
      if (val > 7) val = 7;
      sum += val;
    });
    return sum; // Raw sum out of 35 (5 items * 7)
  };

  const rawE = getSum(categoryMap.E);
  const rawA = getSum(categoryMap.A);
  const rawN = getSum(categoryMap.N);
  const rawC = getSum(categoryMap.C);
  const rawO = getSum(categoryMap.O);

  // Normalize (5 to 35 -> 0% to 100%)
  const scoreE = Math.round(((rawE - 5) / 30) * 100);
  const scoreA = Math.round(((rawA - 5) / 30) * 100);
  const scoreN = Math.round(((rawN - 5) / 30) * 100);
  const scoreC = Math.round(((rawC - 5) / 30) * 100);
  const scoreO = Math.round(((rawO - 5) / 30) * 100);

  return {
    O: Math.max(0, Math.min(100, scoreO)),
    C: Math.max(0, Math.min(100, scoreC)),
    E: Math.max(0, Math.min(100, scoreE)),
    A: Math.max(0, Math.min(100, scoreA)),
    N: Math.max(0, Math.min(100, scoreN)),
    rawO, rawC, rawE, rawA, rawN,
    levelO: getTraitLevel(scoreO),
    levelC: getTraitLevel(scoreC),
    levelE: getTraitLevel(scoreE),
    levelA: getTraitLevel(scoreA),
    levelN: getTraitLevel(scoreN),
  };
}

export function calculateCompetencyScores(responses) {
  const getItemScorePercentage = (qIds) => {
    let sum = 0;
    qIds.forEach(id => {
      let val = Number(responses[id]) || Number(responses[String(id)]) || 4;
      sum += val;
    });
    const avg = sum / qIds.length;
    return Math.round(((avg - 1) / 6) * 100);
  };

  const competencyDefinitions = [
    { id: 'leadership', name: 'Leadership & Initiative', qIds: [1, 6, 11, 16, 21], desc: 'Ability to step forward, influence others, and guide group action.' },
    { id: 'communication', name: 'Communication & Expression', qIds: [7, 11, 17, 18, 22], desc: 'Interpersonal clarity, encouraging feedback, and social engagement.' },
    { id: 'teamwork', name: 'Teamwork & Collaboration', qIds: [2, 7, 12, 17, 22], desc: 'Empathy, cooperativeness, and value for group harmony.' },
    { id: 'problem_solving', name: 'Problem Solving & Innovation', qIds: [5, 10, 15, 20, 25], desc: 'Receptivity to novel approaches and eagerness for creative improvement.' },
    { id: 'decision_making', name: 'Decision Making & Composure', qIds: [3, 8, 13, 14, 23], desc: 'Composure under pressure combined with structured analysis.' },
    { id: 'accountability', name: 'Dependability & Execution', qIds: [4, 9, 14, 19, 24], desc: 'Reliability in meeting commitments, organization, and adherence to rules.' },
  ];

  return competencyDefinitions.map(comp => {
    const score = getItemScorePercentage(comp.qIds);
    return {
      id: comp.id,
      name: comp.name,
      score,
      level: score >= 80 ? 'Very Strong' : score >= 65 ? 'Strong' : score >= 45 ? 'Emerging' : 'Developing',
      description: comp.desc,
    };
  });
}

export function generateReportFromScores(participant, oceanScores, competencyScores, assessmentId) {
  const oLevel = oceanScores.levelO;
  const cLevel = oceanScores.levelC;
  const eLevel = oceanScores.levelE;
  const aLevel = oceanScores.levelA;
  const nLevel = oceanScores.levelN;

  let archetypeTitle = "Balanced Pragmatist";
  let archetypeTagline = "Adaptable, dependable professional with versatile strengths across domains.";
  let archetypeBadge = "Strategic Operator";

  if (oceanScores.E >= 70 && oceanScores.C >= 70 && oceanScores.O >= 65) {
    archetypeTitle = "Transformational Executive";
    archetypeTagline = "Driven leader who aligns visionary strategy with high-execution standards.";
    archetypeBadge = "Executive Leader";
  } else if (oceanScores.E >= 70 && oceanScores.A >= 70) {
    archetypeTitle = "Collaborative Catalyst";
    archetypeTagline = "People-centric driver who builds high-trust teams and fosters morale.";
    archetypeBadge = "Team Builder";
  } else if (oceanScores.O >= 70 && oceanScores.C >= 70) {
    archetypeTitle = "Strategic Innovator";
    archetypeTagline = "Methodical thinker who transforms creative concepts into scalable systems.";
    archetypeBadge = "System Architect";
  } else if (oceanScores.C >= 75 && oceanScores.N >= 70) {
    archetypeTitle = "Anchor of Reliability";
    archetypeTagline = "Calm, steadfast operator trusted to deliver high-quality outcomes under pressure.";
    archetypeBadge = "Operations Pillar";
  } else if (oceanScores.O >= 75) {
    archetypeTitle = "Creative Pathfinder";
    archetypeTagline = "Curious explorer driven by novel challenges and continuous learning.";
    archetypeBadge = "Innovation Pioneer";
  } else if (oceanScores.A >= 75) {
    archetypeTitle = "Empathetic Facilitator";
    archetypeTagline = "Harmonious team player who excels at conflict resolution and support.";
    archetypeBadge = "Culture Builder";
  }

  const strengths = [];
  if (oceanScores.C >= 65) strengths.push("High dependability and commitment to delivering quality results on deadline.");
  if (oceanScores.E >= 65) strengths.push("Strong initiative in stepping forward to take charge in ambiguous or leaderless situations.");
  if (oceanScores.O >= 65) strengths.push("Receptivity to organizational change and eagerness to adopt innovative methods.");
  if (oceanScores.N >= 65) strengths.push("Exceptional composure and emotional stability under high-pressure scenarios.");
  if (oceanScores.A >= 65) strengths.push("Active empathy and genuine supportiveness, creating an inclusive work environment.");
  if (strengths.length < 3) {
    strengths.push("Pragmatic, balanced evaluation of risk before committing to organizational shifts.");
    strengths.push("Steady focus on goal execution and consistent performance.");
  }

  // Structured 3-5 Personalized Recommendations as requested
  const recommendations = [
    {
      area: "Leadership & Workload Balance",
      currentInsight: `Your Extraversion level (${eLevel}) indicates high willingness to take charge, but may lead to taking on excessive team burdens.`,
      whyItMatters: "Over-committing without delegating sub-tasks limits strategic oversight and increases individual stress.",
      specificAction: "Practice summarizing project responsibilities and delegating at least 2 operational items per week to team members with explicit feedback.",
      suggestedTimeframe: "Next 4 Weeks",
      expectedOutcome: "Enhanced team autonomy, reduced cognitive strain, and improved delegation efficiency."
    },
    {
      area: "Communication & Active Listening",
      currentInsight: `Your Agreeableness level (${aLevel}) and Social drive encourage rapid interaction during conflict.`,
      whyItMatters: "Direct communication without initial alignment can occasionally be perceived as imposing in collaborative meetings.",
      specificAction: "Practice summarizing the other person's point before responding during team discussions, at least twice per week, to strengthen active listening.",
      suggestedTimeframe: "Immediate / Ongoing",
      expectedOutcome: "Higher mutual trust, reduced misunderstandings, and smoother consensus building."
    },
    {
      area: "Stress Recovery & Pacing",
      currentInsight: `Your Emotional Stability score (${nLevel}) allows you to perform well under stress, but micro-rest is often neglected.`,
      whyItMatters: "Sustained high-pressure work without structured pause buffers causes cumulative energy dips.",
      specificAction: "Schedule 15-minute daily buffer periods between back-to-back high-stakes sessions and audit weekly workload.",
      suggestedTimeframe: "Daily Routine",
      expectedOutcome: "Consistent cognitive energy, reduced burnout risk, and sustained peak performance."
    },
    {
      area: "Continuous Innovation & Skill Growth",
      currentInsight: `Your Openness score (${oLevel}) reflects willingness to try novel approaches when encouraged.`,
      whyItMatters: "Without proactive cross-functional engagement, innovative potential remains under-utilized.",
      specificAction: "Volunteer for one inter-departmental advisory panel or hackathon per quarter to explore new tools and workflows.",
      suggestedTimeframe: "Quarterly Goal",
      expectedOutcome: "Broader problem-solving skills, expanded internal network, and faster career progression."
    }
  ];

  return {
    reportId: `REP-${assessmentId}`,
    participantId: participant.participantId,
    assessmentId,
    overallProfile: `Participant ${participant.name} exhibits a personality profile characterized by ${cLevel.toLowerCase()} Conscientiousness (${oceanScores.rawC}/35), ${eLevel.toLowerCase()} Surgency/Extraversion (${oceanScores.rawE}/35), ${oLevel.toLowerCase()} Openness to Experience (${oceanScores.rawO}/35), ${aLevel.toLowerCase()} Agreeableness (${oceanScores.rawA}/35), and ${nLevel.toLowerCase()} Emotional Stability (${oceanScores.rawN}/35).`,
    personalityType: {
      title: archetypeTitle,
      tagline: archetypeTagline,
      summary: `Based on the 25-item Industrial Psychology Big Five Assessment, ${participant.name} aligns closely with the ${archetypeTitle} profile.`,
      badge: archetypeBadge
    },
    strengths,
    leadership: {
      style: eLevel === 'High' || eLevel === 'Very High' 
        ? "Directive & Initiative-Driven: Steps forward readily, asserts direction, and drives goal achievement."
        : "Collaborative & Supportive: Leads through consensus building, active listening, and group alignment.",
      strengths: ["Initiative in leaderless settings", "Goal clarity", "Constructive engagement in conflict"],
      growthAreas: ["Delegation of sub-tasks", "Patience with slower team workflows"]
    },
    communication: {
      description: eLevel === 'High' || eLevel === 'Very High' 
        ? "Direct, expressive, and persuasive in group discussions and team presentations."
        : "Reflective, diplomatic, and structured, preferring prepared written communication.",
      tips: ["Summarize verbal commitments in writing", "Actively invite quieter team members to share their perspectives"]
    },
    decisionMaking: {
      approach: cLevel === 'High' || cLevel === 'Very High' ? "Analytical, Structured & Risk-Conscious" : "Pragmatic & Flexible",
      characteristics: ["Dependable execution", "Quality control focus", "Long-term goal orientation"]
    },
    careerSuitability: {
      bestFitEnvironments: ["Structured corporate settings", "Growth-stage technology firms", "R&D & Innovation units"],
      topRoles: ["Industrial Psychology Consultant", "Operations Lead", "Project Manager", "Product Strategist"],
      workStyleNotes: "Thrives in environments with clear milestones, accountability, and opportunities for professional growth."
    },
    learningStyle: {
      preferredMode: oLevel === 'High' || oLevel === 'Very High' ? "Experiential, Innovative & Self-Directed" : "Structured & Methodical",
      tips: ["Combine theoretical principles with practical application", "Engage in peer case study discussions"]
    },
    stressAndCoping: {
      triggers: ["Ambiguous role boundaries", "Persistent process inefficiency", "Overlapping tight deadlines"],
      copingStrategies: ["Decompose complex objectives into visual task boards", "Maintain work-rest boundaries"],
      resilienceRating: nLevel === 'High' || nLevel === 'Very High' ? "Superior Composure (Top Tier)" : "Robust & Grounded"
    },
    motivationalDrivers: [
      "Autonomy and mastery in core professional competencies",
      "Recognition for tangible, high-quality contributions",
      "Opportunities for leadership advancement and strategic impact",
      "Workplace environment rooted in mutual trust and reliability"
    ],
    competencyProfile: competencyScores,
    recommendations,
    summary: `In summary, ${participant.name}'s assessment results demonstrate a strong foundational profile. Executing the personalized recommendations will accelerate professional effectiveness and leadership readiness in industrial and organizational settings.`,
    disclaimer: "This assessment is intended for educational, self-awareness and developmental purposes as part of the HRM301 Industrial Psychology project. It is not a clinical diagnosis.",
    generatedAt: new Date()
  };
}
