import { Question, OceanScores, TraitScoreDetail, DetailedReportData, ParticipantInfo, DevelopmentRecommendation, CompetencyScore } from '../types/assessment';
import { assessmentQuestions } from '../data/questions';

export function calculateOceanScores(answers: Record<number, number>): OceanScores {
  let rawO = 0, countO = 0;
  let rawC = 0, countC = 0;
  let rawE = 0, countE = 0;
  let rawA = 0, countA = 0;
  let rawN = 0, countN = 0;

  assessmentQuestions.forEach((q) => {
    const val = answers[q.id] || 3;
    switch (q.category) {
      case 'O': rawO += val; countO++; break;
      case 'C': rawC += val; countC++; break;
      case 'E': rawE += val; countE++; break;
      case 'A': rawA += val; countA++; break;
      case 'N': rawN += val; countN++; break;
    }
  });

  const scoreO = Math.round(((rawO - countO) / (countO * 4)) * 100);
  const scoreC = Math.round(((rawC - countC) / (countC * 4)) * 100);
  const scoreE = Math.round(((rawE - countE) / (countE * 4)) * 100);
  const scoreA = Math.round(((rawA - countA) / (countA * 4)) * 100);
  const scoreN = Math.round(((rawN - countN) / (countN * 4)) * 100);

  return {
    O: scoreO, C: scoreC, E: scoreE, A: scoreA, N: scoreN,
    rawO, rawC, rawE, rawA, rawN,
  };
}

export function getCompetencyLevel(score: number): 'Developing' | 'Emerging' | 'Strong' | 'Very Strong' {
  if (score >= 80) return 'Very Strong';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Emerging';
  return 'Developing';
}

export function calculateCompetencyScores(answers: Record<number, number>): CompetencyScore[] {
  const getAvg = (qIds: number[]) => {
    let sum = 0;
    qIds.forEach(id => {
      sum += Number(answers[id]) || 3;
    });
    return Math.round((((sum / qIds.length) - 1) / 4) * 100);
  };

  const defs = [
    { id: 'leadership', name: 'Leadership & Initiative', qIds: [1, 6, 11, 21], desc: 'Ability to step forward and guide group action.' },
    { id: 'communication', name: 'Communication & Expression', qIds: [7, 11, 18, 22], desc: 'Interpersonal clarity and social engagement.' },
    { id: 'teamwork', name: 'Teamwork & Collaboration', qIds: [2, 12, 18, 22], desc: 'Empathy, cooperativeness, and group harmony.' },
    { id: 'problem_solving', name: 'Problem Solving & Innovation', qIds: [5, 15, 20, 25], desc: 'Receptivity to novel ideas and innovation.' },
    { id: 'decision_making', name: 'Decision Making & Judgement', qIds: [1, 8, 14, 23], desc: 'Composure combined with structured analysis.' },
    { id: 'adaptability', name: 'Adaptability & Resilience', qIds: [5, 10, 15, 25], desc: 'Openness to change and new challenges.' },
    { id: 'emotional_regulation', name: 'Emotional Regulation', qIds: [3, 8, 13, 23], desc: 'Self-control and stress tolerance.' },
    { id: 'time_management', name: 'Time Management & Organization', qIds: [4, 9, 14, 19], desc: 'Dependability and rule compliance.' },
    { id: 'initiative', name: 'Initiative & Proactiveness', qIds: [1, 5, 9, 20], desc: 'Personal drive for success and volunteering for tasks.' },
    { id: 'learning_orientation', name: 'Learning Orientation', qIds: [5, 10, 15, 20], desc: 'Curiosity to acquire new skills.' },
    { id: 'accountability', name: 'Accountability & Credibility', qIds: [4, 9, 19, 24], desc: 'Reliability in coming through for people.' },
    { id: 'stress_management', name: 'Stress Management', qIds: [3, 8, 13, 23], desc: 'Performing effectively under high pressure.' },
    { id: 'motivation', name: 'Motivation & Drive', qIds: [6, 9, 16, 20], desc: 'Ambition to achieve management milestones.' },
  ];

  return defs.map(d => {
    const s = getAvg(d.qIds);
    return {
      id: d.id,
      name: d.name,
      score: s,
      level: getCompetencyLevel(s),
      description: d.desc,
    };
  });
}

export function getTraitLevel(score: number): 'High' | 'Moderate' | 'Low' {
  if (score >= 72) return 'High';
  if (score >= 45) return 'Moderate';
  return 'Low';
}

export function generateReportData(
  participant: ParticipantInfo, 
  scores: OceanScores, 
  assessmentId?: string,
  competencyProfile?: CompetencyScore[]
): DetailedReportData {
  const oLevel = getTraitLevel(scores.O);
  const cLevel = getTraitLevel(scores.C);
  const eLevel = getTraitLevel(scores.E);
  const aLevel = getTraitLevel(scores.A);
  const nLevel = getTraitLevel(scores.N);

  const traitDetails: TraitScoreDetail[] = [
    {
      category: 'O',
      title: 'Openness to Experience',
      score: scores.O,
      level: oLevel,
      color: '#38BDF8',
      description: oLevel === 'High' 
        ? 'High curiosity, strong interest in novel concepts, and high adaptability.'
        : 'Balances traditional approaches with occasional exploration of new methodologies.'
    },
    {
      category: 'C',
      title: 'Conscientiousness',
      score: scores.C,
      level: cLevel,
      color: '#8B5CF6',
      description: cLevel === 'High'
        ? 'Exceptional self-discipline, dependability, meticulous planning, and strong work ethic.'
        : 'Maintains solid work standards while remaining flexible when rigid rules limit progress.'
    },
    {
      category: 'E',
      title: 'Extraversion & Influence',
      score: scores.E,
      level: eLevel,
      color: '#F59E0B',
      description: eLevel === 'High'
        ? 'Highly outgoing, assertive in leaderless settings, and energized by group action.'
        : 'Comfortable in social settings, balancing individual focus with team collaboration.'
    },
    {
      category: 'A',
      title: 'Agreeableness & Empathy',
      score: scores.A,
      level: aLevel,
      color: '#10B981',
      description: aLevel === 'High'
        ? 'Deeply empathetic, cooperative, supportive of colleagues, and focused on team dynamics.'
        : 'Maintains professional warmth while remaining capable of objective decision-making.'
    },
    {
      category: 'N',
      title: 'Emotional Stability & Resilience',
      score: scores.N,
      level: nLevel,
      color: '#EC4899',
      description: nLevel === 'High'
        ? 'Calm under pressure, optimistic in adversity, and possesses high emotional self-control.'
        : 'Generally steady emotional control under standard workplace pressure.'
    }
  ];

  let archetypeTitle = "Balanced Pragmatist";
  let archetypeTagline = "Adaptable, dependable professional with versatile strengths";
  let archetypeBadge = "Strategic Operator";

  if (scores.E >= 70 && scores.C >= 70 && scores.O >= 65) {
    archetypeTitle = "Transformational Executive";
    archetypeTagline = "Driven leader who aligns visionary strategy with high-execution standards";
    archetypeBadge = "Executive Leader";
  } else if (scores.E >= 70 && scores.A >= 70) {
    archetypeTitle = "Collaborative Catalyst";
    archetypeTagline = "People-centric driver who builds high-trust teams and fosters morale";
    archetypeBadge = "Team Builder";
  } else if (scores.O >= 70 && scores.C >= 70) {
    archetypeTitle = "Strategic Innovator";
    archetypeTagline = "Methodical thinker who transforms creative concepts into scalable systems";
    archetypeBadge = "System Architect";
  } else if (scores.C >= 75 && scores.N >= 70) {
    archetypeTitle = "Anchor of Reliability";
    archetypeTagline = "Calm, steadfast operator trusted to deliver high-quality outcomes under pressure";
    archetypeBadge = "Operations Pillar";
  } else if (scores.O >= 75) {
    archetypeTitle = "Creative Pathfinder";
    archetypeTagline = "Curious explorer driven by novel challenges and continuous learning";
    archetypeBadge = "Innovation Pioneer";
  } else if (scores.A >= 75) {
    archetypeTitle = "Empathetic Facilitator";
    archetypeTagline = "Harmonious team player who excels at conflict resolution and support";
    archetypeBadge = "Culture Builder";
  }

  const majorStrengths: string[] = [];
  if (scores.C >= 65) majorStrengths.push("High dependability and commitment to delivering quality results on deadline.");
  if (scores.E >= 65) majorStrengths.push("Strong initiative in stepping forward to take charge in leaderless situations.");
  if (scores.O >= 65) majorStrengths.push("Receptivity to organizational change and willingness to experiment with new processes.");
  if (scores.N >= 65) majorStrengths.push("Exceptional composure and optimism when navigating high-pressure deadlines.");
  if (scores.A >= 65) majorStrengths.push("Active empathy and supportiveness, creating an inclusive environment.");

  if (majorStrengths.length < 3) {
    majorStrengths.push("Pragmatic evaluation of risk before committing to organizational shifts.");
    majorStrengths.push("Focus on step-by-step goal execution and steady work quality.");
  }

  const developmentRecommendations: DevelopmentRecommendation[] = [
    {
      id: 1,
      title: "Strategic Delegation & Workload Management",
      description: "Guard against taking on excessive individual workload. Practice delegating sub-tasks to build team autonomy.",
      actionableStep: "Identify 2 recurring tasks this month and delegate them with clear success criteria.",
      focusArea: "Leadership & Workload Management"
    },
    {
      id: 2,
      title: "Active Constructive Feedback Practice",
      description: "Balance task urgency with deliberate praise. Giving structured, specific recognition increases engagement.",
      actionableStep: "Schedule weekly check-ins dedicated specifically to acknowledging team contributions.",
      focusArea: "Interpersonal Relations"
    },
    {
      id: 3,
      title: "Stress Offloading & Energy Auditing",
      description: "Maintain emotional equilibrium during peak project delivery phases by managing cognitive load.",
      actionableStep: "Implement 15-minute daily buffer periods between back-to-back high-stakes meetings.",
      focusArea: "Wellbeing & Resilience"
    },
    {
      id: 4,
      title: "Cross-Functional Innovation Sprints",
      description: "Leverage your openness by participating in cross-departmental problem-solving workshops outside your primary domain.",
      actionableStep: "Volunteer for one inter-departmental advisory panel or hackathon per quarter.",
      focusArea: "Professional Growth"
    }
  ];

  const reportId = assessmentId ? `REP-${assessmentId}` : `REP-PI-${Math.floor(100000 + Math.random() * 900000)}`;

  const calculatedComps = competencyProfile || calculateCompetencyScores({});

  return {
    reportId,
    assessmentId: assessmentId || `PI-${Math.floor(100000 + Math.random() * 900000)}`,
    participantInfo: participant,
    oceanScores: scores,
    traitDetails,
    archetype: {
      title: archetypeTitle,
      tagline: archetypeTagline,
      summary: `Based on the 25-item Industrial Psychology assessment framework, ${participant.name} aligns closely with the ${archetypeTitle} profile.`,
      badge: archetypeBadge
    },
    overallProfile: `Participant ${participant.name} exhibits a profile characterized by ${cLevel.toLowerCase()} conscientiousness and ${eLevel.toLowerCase()} extraversion. Demonstrates strong potential for high-consequence roles where structured execution is critical.`,
    majorStrengths,
    leadershipPotential: {
      style: eLevel === 'High' && cLevel === 'High' 
        ? "Directive & Strategic: Inspires groups, sets clear performance metrics, and asserts direction."
        : "Collaborative Facilitation: Leads through consensus, active listening, and encouraging team input.",
      strengths: [
        "Proactive initiative in ambiguous scenarios",
        "Clear goal setting and accountability tracking",
        "Constructive conflict management style"
      ],
      growthAreas: [
        "Avoiding over-commitment during peak stress periods",
        "Patience when working alongside lower-velocity team members"
      ]
    },
    communicationStyle: {
      description: eLevel === 'High'
        ? "Direct, articulate, and persuasive. Highly comfortable speaking up in team discussions and pitching ideas."
        : "Thoughtful and structured. Listens carefully before contributing in team settings.",
      tips: [
        "Utilize visual frameworks when pitching complex ideas",
        "Summarize action items in writing following verbal discussions",
        "Actively invite quieter team members to share insights"
      ]
    },
    decisionMakingStyle: {
      approach: cLevel === 'High' ? "Analytical & Evidence-Backed" : "Pragmatic & Flexible",
      characteristics: [
        "Prefers evidence-backed risk analysis",
        "Balances rapid action with quality controls",
        "Considers long-term organizational impact"
      ]
    },
    careerSuitability: {
      bestFitEnvironments: ["Structured corporate settings", "Growth-stage tech companies", "Management consulting firms"],
      topRoles: ["Operations Manager", "Program Manager", "Strategy Consultant", "Product Lead"],
      workStyleNotes: "Thrives in structured settings where clear performance indicators match opportunities for leadership advancement."
    },
    learningStyle: {
      preferredMode: oLevel === 'High' ? "Experiential & Self-Directed" : "Structured & Methodical",
      tips: [
        "Combine theoretical models with immediate practical application",
        "Engage in peer-to-peer case study reviews"
      ]
    },
    stressAndCoping: {
      triggers: [
        "Unclear role expectations",
        "Persistent inefficiency in team workflows",
        "Inadequate recovery windows between project deadlines"
      ],
      copingStrategies: [
        "Break complex challenges into structured action boards",
        "Maintain clear boundaries between professional and personal hours"
      ],
      resilienceRating: nLevel === 'High' ? "Superior (Top 15%)" : "Robust & Reliable"
    },
    motivationalDrivers: [
      "Autonomy and mastery in core competencies",
      "Recognition of high-quality tangible output",
      "Opportunities for leadership advancement and strategic impact",
      "Positive workplace culture founded on mutual credibility"
    ],
    competencyProfile: calculatedComps,
    developmentRecommendations,
    summary: `In summary, ${participant.name}'s assessment profile demonstrates a strong foundation of professional competencies.`,
    disclaimer: "This assessment is intended for educational, research, and self-development purposes as part of the HRM301 course assignment. It is non-clinical.",
    createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
}
