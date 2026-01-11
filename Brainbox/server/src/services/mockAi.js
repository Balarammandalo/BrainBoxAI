function uniq(arr) {
  return Array.from(new Set(arr));
}

export function generateStudyPlan({ goal, timeToComplete, dailyStudyTime }) {
  const safeGoal = goal?.trim() || "New Skill";

  const topics = uniq([
    `Fundamentals of ${safeGoal}`,
    `${safeGoal} Core Concepts`,
    `${safeGoal} Practical Exercises`,
    `Projects with ${safeGoal}`,
    `${safeGoal} Interview / Assessment Prep`,
  ]);

  const notes = [
    `Focus on understanding the fundamentals before moving to advanced concepts.` ,
    `Learn actively: take notes, build small projects, and test yourself frequently.`,
    `Use spaced repetition and weekly reviews to retain key ideas.`,
  ];

  const resources = [
    { title: `${safeGoal} Official Docs (placeholder)`, url: "https://example.com" },
    { title: `${safeGoal} Beginner Roadmap (placeholder)`, url: "https://example.com" },
    { title: `${safeGoal} Practice Exercises (placeholder)`, url: "https://example.com" },
  ];

  const days = timeToComplete?.includes("6") ? 28 : timeToComplete?.includes("3") ? 14 : 7;

  const schedule = Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const topic = topics[i % topics.length];
    return {
      day,
      title: `Day ${day}: ${topic}`,
      tasks: [
        `Read notes and summarize key ideas (${dailyStudyTime}).`,
        `Do 3 practice questions based on ${topic}.`,
        `Write 5 flashcards for revision.`,
      ],
    };
  });

  return {
    topics,
    notes,
    resources,
    schedule,
  };
}
