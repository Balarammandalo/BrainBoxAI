import axios from "axios";
import Plan from "../models/Plan.js";

async function generateLearningLinks(topic) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides learning resource links. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: `Generate the best learning links for "${topic}". 
            Include these platforms:
            - GeeksforGeeks
            - W3Schools  
            - MDN Docs (if applicable)
            - FreeCodeCamp
            - YouTube (playlist or tutorial)
            
            Return JSON in this exact format:
            {
              "topic": "${topic}",
              "links": [
                {
                  "platform": "GeeksforGeeks",
                  "title": "Specific tutorial title",
                  "url": "actual URL",
                  "description": "Brief description of what this covers"
                }
              ]
            }`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating learning links:", error);
    
    // Fallback data with real URLs
    const fallbackLinks = [
      {
        platform: "GeeksforGeeks",
        title: `${topic} Complete Guide`,
        url: `https://www.geeksforgeeks.org/${topic.toLowerCase().replace(/\s+/g, '-')}/`,
        description: `Comprehensive tutorial covering all ${topic} concepts`
      },
      {
        platform: "W3Schools",
        title: `${topic} Tutorial`,
        url: `https://www.w3schools.com/${topic.toLowerCase().replace(/\s+/g, '')}/`,
        description: `Interactive ${topic} tutorial with examples`
      },
      {
        platform: "FreeCodeCamp",
        title: `Learn ${topic} for Free`,
        url: `https://www.freecodecamp.org/learn/${topic.toLowerCase().replace(/\s+/g, '-')}/`,
        description: `Free ${topic} course with hands-on projects`
      }
    ];

    // Add MDN for web technologies
    if (['JavaScript', 'HTML', 'CSS', 'React', 'Node.js', 'Express'].some(t => 
        topic.toLowerCase().includes(t.toLowerCase()))) {
      fallbackLinks.push({
        platform: "MDN Docs",
        title: `${topic} Documentation`,
        url: `https://developer.mozilla.org/en-US/docs/Web/${topic}`,
        description: `Official ${topic} documentation and reference`
      });
    }

    // Add YouTube
    fallbackLinks.push({
      platform: "YouTube",
      title: `${topic} Complete Course`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' full course')}`,
      description: `Video tutorials and complete courses for ${topic}`
    });

    return {
      topic,
      links: fallbackLinks,
    };
  }
}

export async function getLearningResources(req, res) {
  try {
    const { topic } = req.query;
    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const resources = await generateLearningLinks(topic);
    res.json(resources);
  } catch (error) {
    console.error("Error in getLearningResources:", error);
    res.status(500).json({ message: "Failed to fetch learning resources" });
  }
}

export async function updatePlanWithResources(req, res) {
  try {
    const { planId, topic } = req.body;
    if (!planId || !topic) {
      return res.status(400).json({ message: "PlanId and topic are required" });
    }

    const resources = await generateLearningLinks(topic);

    const plan = await Plan.findOneAndUpdate(
      { _id: planId, userId: req.user.id },
      {
        $push: {
          resources: resources,
          "resourcesByType.learningResources": resources,
        },
      },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ success: true, resources, plan });
  } catch (error) {
    console.error("Error updating plan with resources:", error);
    res.status(500).json({ message: "Failed to update plan with resources" });
  }
}
