import Plan from "../models/Plan.js";
import axios from "axios";
import User from "../models/User.js";
import { transporter } from "../config/mail.js";

export const planEmailTemplate = (plan) => {
  return `
    <h2>📘 Your AI Study Plan</h2>
    <p><b>Skill:</b> ${plan.skill}</p>
    <p><b>Duration:</b> ${plan.duration}</p>
    <p><b>Daily Study:</b> ${plan.dailyTime}</p>

    <h3>📅 Weekly Plan</h3>
    <ul>
      ${plan.weeks.map((w) => `<li>${w}</li>`).join("")}
    </ul>

    <h3>📚 Resources</h3>
    <ul>
      ${plan.resources.map((r) => `<li>${r}</li>`).join("")}
    </ul>

    <p>🔥 Stay consistent – BrainBox AI</p>
  `;
};

function buildEmailPlanView(planDoc) {
  const weeks = Array.isArray(planDoc.planStructure)
    ? planDoc.planStructure.map((m) => m.title).filter(Boolean)
    : [];

  const resources = Array.isArray(planDoc.planStructure)
    ? planDoc.planStructure
        .flatMap((m) => (Array.isArray(m.topics) ? m.topics : []))
        .filter(Boolean)
        .slice(0, 25)
    : [];

  return {
    skill: planDoc.skill || planDoc.goal,
    duration: planDoc.duration || planDoc.timeToComplete,
    dailyTime: planDoc.dailyTime || planDoc.dailyStudyTime,
    weeks,
    resources,
  };
}

// Generate plan structure using ChatGPT
async function generatePlanStructure(topic, durationMonths) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert curriculum designer. Create structured learning plans. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: `Create a ${durationMonths}-month learning plan structure for "${topic}".
            Break it down by month with specific topics and subtopics.
            
            Return JSON in this exact format:
            {
              "planStructure": [
                {
                  "month": 1,
                  "title": "Month 1: Foundation",
                  "topics": ["Topic 1", "Topic 2", "Topic 3"]
                }
              ]
            }`
          }
        ],
        max_tokens: 1500,
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
    console.error("Error generating plan structure:", error);
    
    // Fallback structure
    const months = parseInt(durationMonths) || 3;
    const planStructure = [];
    
    for (let i = 1; i <= months; i++) {
      planStructure.push({
        month: i,
        title: `Month ${i}: ${topic} Learning`,
        topics: [
          `${topic} Basics Part ${i}`,
          `Advanced ${topic} Concepts ${i}`,
          `Practice Projects ${i}`
        ]
      });
    }
    
    return { planStructure };
  }
}

export async function generateEnhancedPlan(req, res) {
  try {
    const { goal, timeToComplete, dailyStudyTime, resourceTypes } = req.body;
    const userId = req.user.id;

    if (!goal || !timeToComplete || !dailyStudyTime) {
      return res
        .status(400)
        .json({ message: "goal, timeToComplete, dailyStudyTime are required" });
    }

    // Extract duration in months
    const durationMonths = parseInt(timeToComplete) || 3;
    
    // Generate plan structure
    const { planStructure } = await generatePlanStructure(goal, durationMonths);
    
    // Create the plan with enhanced structure
    const plan = new Plan({
      userId,
      goal,
      timeToComplete,
      dailyStudyTime,
      resourceTypes,
      skill: goal,
      duration: timeToComplete,
      planStructure,
      progressPercent: 0,
    });

    await plan.save();

    let emailSent = false;
    let message = "Your personalized study plan is ready.";

    try {
      const user = await User.findById(userId);
      if (user?.email) {
        const html = planEmailTemplate(buildEmailPlanView(plan));

        await transporter.sendMail({
          from: `"BrainBox" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Your BrainBox AI Study Plan is Ready 🚀",
          html,
        });

        emailSent = true;
        message = "Your study plan has been sent to your email 📩";
      } else {
        message = "Plan saved, but could not send email (user email not found).";
      }
    } catch (mailErr) {
      console.error("Failed to send plan email:", mailErr);
      message = "Plan saved, but email delivery failed.";
    }

    // Generate resources for each type
    if (Array.isArray(resourceTypes) && resourceTypes.includes('books')) {
      // Books will be loaded on demand
    }
    
    if (Array.isArray(resourceTypes) && resourceTypes.includes('video')) {
      // Generate video resources
      await generateVideoResources(plan._id, goal);
    }

    res.status(201).json({
      plan,
      emailSent,
      message,
    });
  } catch (error) {
    console.error("Error generating enhanced plan:", error);
    res.status(500).json({ message: "Failed to generate plan" });
  }
}

async function generateVideoResources(planId, topic) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides video learning resources. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: `Generate 5 YouTube video resources for learning "${topic}".
            Return JSON in this exact format:
            {
              "videos": [
                {
                  "title": "Video title",
                  "url": "YouTube URL",
                  "description": "Brief description"
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
    const { videos } = JSON.parse(content);
    
    // Update plan with video resources
    await Plan.findByIdAndUpdate(planId, {
      $push: {
        'resourcesByType.video': { $each: videos }
      }
    });
  } catch (error) {
    console.error("Error generating video resources:", error);
  }
}

export async function updateTodoItem(req, res) {
  try {
    const { planId, monthIndex, completed } = req.body;
    const userId = req.user.id;

    const plan = await Plan.findOne({ _id: planId, userId });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update the specific todo item
    const todoItem = plan.planStructure[monthIndex];
    if (todoItem) {
      todoItem.completed = completed;
      todoItem.completedAt = completed ? new Date() : null;
    }

    // Calculate progress percentage
    const totalItems = plan.planStructure.length;
    const completedItems = plan.planStructure.filter(item => item.completed).length;
    plan.progressPercent = Math.round((completedItems / totalItems) * 100);

    await plan.save();

    res.json({ 
      success: true, 
      progressPercent: plan.progressPercent,
      planStructure: plan.planStructure 
    });
  } catch (error) {
    console.error("Error updating todo item:", error);
    res.status(500).json({ message: "Failed to update todo item" });
  }
}

export async function deletePlan(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const plan = await Plan.findOneAndDelete({ _id: id, userId });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({ message: "Failed to delete plan" });
  }
}

export async function clearCompletedTopics(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const plan = await Plan.findOne({ _id: id, userId });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Remove completed items from planStructure
    plan.planStructure = plan.planStructure.filter(item => !item.completed);
    
    // Recalculate progress
    const totalItems = plan.planStructure.length;
    const completedItems = plan.planStructure.filter(item => item.completed).length;
    plan.progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    await plan.save();

    res.json({ 
      success: true, 
      message: "Completed topics cleared",
      planStructure: plan.planStructure,
      progressPercent: plan.progressPercent
    });
  } catch (error) {
    console.error("Error clearing completed topics:", error);
    res.status(500).json({ message: "Failed to clear completed topics" });
  }
}
