import mongoose from "mongoose";
import CodingProgress from "../models/CodingProgress.js";

// Mock data for Codeforces problems
const mockCodeforcesProblems = {
  easy: [
    {
      id: "cf-1",
      title: "Watermelon",
      difficulty: "Easy",
      tags: ["implementation", "math"],
      rating: 800,
      url: "https://codeforces.com/problemset/problem/4/A"
    },
    {
      id: "cf-2", 
      title: "Bit++",
      difficulty: "Easy",
      tags: ["implementation"],
      rating: 900,
      url: "https://codeforces.com/problemset/problem/282/A"
    },
    {
      id: "cf-3",
      title: "Team",
      difficulty: "Easy",
      tags: ["implementation", "strings"],
      rating: 1000,
      url: "https://codeforces.com/problemset/problem/231/A"
    }
  ],
  medium: [
    {
      id: "cf-4",
      title: "Two Bags of Potatoes",
      difficulty: "Medium",
      tags: ["math", "implementation"],
      rating: 1200,
      url: "https://codeforces.com/problemset/problem/239/A"
    },
    {
      id: "cf-5",
      title: "Helpful Maths",
      difficulty: "Medium", 
      tags: ["strings", "sorting"],
      rating: 1100,
      url: "https://codeforces.com/problemset/problem/339/A"
    }
  ],
  hard: [
    {
      id: "cf-6",
      title: "Tricky Function",
      difficulty: "Hard",
      tags: ["math", "binary search"],
      rating: 1600,
      url: "https://codeforces.com/problemset/problem/439/B"
    }
  ]
};

// Mock data for LeetCode problems
const mockLeetCodeProblems = {
  easy: [
    {
      id: "lc-1",
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["array", "hash-table"],
      rating: 1,
      url: "https://leetcode.com/problems/two-sum/"
    },
    {
      id: "lc-2",
      title: "Valid Parentheses",
      difficulty: "Easy",
      tags: ["stack", "string"],
      rating: 1,
      url: "https://leetcode.com/problems/valid-parentheses/"
    },
    {
      id: "lc-3",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      tags: ["array", "dynamic-programming"],
      rating: 1,
      url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
    }
  ],
  medium: [
    {
      id: "lc-4",
      title: "Add Two Numbers",
      difficulty: "Medium",
      tags: ["linked-list", "math"],
      rating: 2,
      url: "https://leetcode.com/problems/add-two-numbers/"
    },
    {
      id: "lc-5",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      tags: ["hash-table", "string", "sliding-window"],
      rating: 2,
      url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
    }
  ],
  hard: [
    {
      id: "lc-6",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      tags: ["linked-list", "divide-and-conquer", "heap"],
      rating: 3,
      url: "https://leetcode.com/problems/merge-k-sorted-lists/"
    }
  ]
};

export async function getProblems(req, res) {
  try {
    const { platform, difficulty } = req.params;
    const { skill } = req.query; // For plan-aware filtering

    let problems = [];
    
    if (platform === "codeforces") {
      problems = mockCodeforcesProblems[difficulty] || [];
    } else if (platform === "leetcode") {
      problems = mockLeetCodeProblems[difficulty] || [];
    } else {
      return res.status(400).json({ message: "Invalid platform. Use 'codeforces' or 'leetcode'" });
    }

    // Plan-aware filtering based on skill
    if (skill) {
      const skillLower = skill.toLowerCase();
      problems = problems.filter(problem => {
        // Map skills to relevant tags
        if (skillLower.includes('react') || skillLower.includes('frontend') || skillLower.includes('javascript')) {
          return problem.tags.some(tag => 
            tag.includes('string') || 
            tag.includes('array') || 
            tag.includes('implementation') ||
            tag.includes('hash-table')
          );
        }
        if (skillLower.includes('dsa') || skillLower.includes('algorithm') || skillLower.includes('data structure')) {
          return true; // Show all problems for DSA
        }
        if (skillLower.includes('python') || skillLower.includes('java') || skillLower.includes('c++')) {
          return true; // Show all problems for programming languages
        }
        return true; // Default: show all problems
      });
    }

    res.json({ problems });
  } catch (error) {
    console.error("Error fetching coding problems:", error);
    res.status(500).json({ message: "Failed to fetch coding problems" });
  }
}

export async function updateProgress(req, res) {
  try {
    const { planId, problemId, platform, status } = req.body;
    const userId = req.user.id;

    if (!planId || !problemId || !platform || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updateData = {
      userId,
      planId,
      problemId,
      platform,
      status
    };

    if (status === "solved") {
      updateData.solvedAt = new Date();
    }

    const progress = await CodingProgress.findOneAndUpdate(
      { userId, planId, problemId },
      updateData,
      { upsert: true, new: true }
    );

    res.json({ progress });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Failed to update progress" });
  }
}

export async function getProgress(req, res) {
  try {
    const { planId } = req.params;
    const userId = req.user.id;

    const progress = await CodingProgress.find({ userId, planId })
      .sort({ createdAt: -1 });

    res.json({ progress });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
}
