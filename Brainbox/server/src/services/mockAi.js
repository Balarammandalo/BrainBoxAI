function uniq(arr) {
  return Array.from(new Set(arr));
}

function toYouTubeSearchUrl(q) {
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(String(q || ""))}`;
}

function pickCodingDifficulty(i) {
  const diffs = ["Easy", "Medium", "Hard"];
  return diffs[i % diffs.length];
}

export function generateStudyPlan({ goal, timeToComplete, dailyStudyTime, resourceTypes }) {
  const safeGoal = goal?.trim() || "New Skill";
  const selected = Array.isArray(resourceTypes) ? resourceTypes : [];

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

  const resourcesByType = {
    video: [],
    books: [],
    coding: [],
    deep: [],
  };

  if (!selected.length || selected.includes("video")) {
    resourcesByType.video = [
      { title: `${safeGoal} Crash Course (YouTube search)`, url: toYouTubeSearchUrl(`${safeGoal} crash course`) },
      { title: `${safeGoal} Tutorial (YouTube search)`, url: toYouTubeSearchUrl(`${safeGoal} tutorial`) },
    ];
  }

  if (!selected.length || selected.includes("books")) {
    resourcesByType.books = [
      { title: `${safeGoal} Beginner Book (upload a PDF)`, url: "" },
      { title: `${safeGoal} Interview Prep Notes (upload a PDF)`, url: "" },
    ];
  }

  if (!selected.length || selected.includes("coding")) {
    resourcesByType.coding = Array.from({ length: 9 }, (_, i) => {
      const difficulty = pickCodingDifficulty(i);
      return {
        title: `${safeGoal} Practice Problem #${i + 1}`,
        difficulty,
        link: "https://example.com",
      };
    });
  }

  if (!selected.length || selected.includes("deep")) {
    resourcesByType.deep = [
      {
        marketData: {
          trending: [safeGoal, "AI", "Cloud"],
          demand: "High",
          avgSalary: "$100k-$160k",
          companies: ["Google", "Microsoft", "Amazon"],
        },
        jobLinks: [
          {
            title: `${safeGoal} Developer`,
            company: "ExampleCorp",
            location: "Remote",
            applyUrl: "https://www.linkedin.com/jobs/search/",
          },
        ],
      },
    ];
  }

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
    skill: safeGoal,
    duration: timeToComplete,
    dailyTime: dailyStudyTime,
    resourceTypes: selected,
    resourcesByType,
    topics,
    notes,
    resources,
    schedule,
  };
}
