const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  // Extract skills from resume text using OpenAI
  static async extractSkills(resumeText) {
    try {
      const prompt = `
        Extract technical and professional skills from the following resume text.
        Return only a JSON array of skills, nothing else.
        
        Resume Text: ${resumeText.substring(0, 3000)}
        
        Skills:
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const skills = JSON.parse(response.choices[0].message.content);
      return Array.isArray(skills) ? skills : [];
    } catch (error) {
      console.error('Error extracting skills with AI:', error);
      return [];
    }
  }

  // Calculate match score between resume and job
  static calculateMatchScore(resumeData, jobData) {
    let score = 0;
    const matchedSkills = [];
    const missingSkills = [];

    // Skills match (60% weight)
    if (resumeData.skills && jobData.skills) {
      const resumeSkills = resumeData.skills.map(s => s.toLowerCase());
      const jobSkills = jobData.skills.map(s => s.toLowerCase());

      jobSkills.forEach(skill => {
        if (resumeSkills.includes(skill)) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      const skillMatchPercentage = (matchedSkills.length / jobSkills.length) * 60;
      score += skillMatchPercentage;
    }

    // Experience match (30% weight)
    if (resumeData.experience && resumeData.experience.years >= jobData.experience) {
      score += 30;
    } else if (resumeData.experience) {
      const expRatio = resumeData.experience.years / jobData.experience;
      score += Math.min(expRatio * 30, 30);
    }

    // Additional factors (10% weight)
    if (resumeData.education && jobData.education) {
      // Add education matching logic here
      score += 10;
    }

    return {
      totalScore: Math.min(Math.round(score), 100),
      matchedSkills,
      missingSkills,
      experienceMatch: resumeData.experience?.years >= jobData.experience,
    };
  }

  // Generate detailed analysis using OpenAI
  static async generateAnalysis(resumeData, jobData, matchData) {
    try {
      const prompt = `
        Analyze this candidate for the job position.
        
        Job Title: ${jobData.title}
        Required Skills: ${jobData.skills.join(', ')}
        Required Experience: ${jobData.experience} years
        
        Candidate Skills: ${resumeData.skills?.join(', ') || 'Not specified'}
        Candidate Experience: ${resumeData.experience?.years || 0} years
        Match Score: ${matchData.totalScore}%
        
        Provide a brief analysis including:
        1. Strengths (2-3 points)
        2. Areas for improvement (2-3 points)
        3. Overall recommendation
        
        Keep it concise and professional.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating analysis with AI:', error);
      return 'Analysis generation failed. Please review the candidate manually.';
    }
  }

  // Parse resume text to extract structured information
  static async parseResumeText(text) {
    try {
      const prompt = `
        Parse the following resume text and extract information in JSON format:
        {
          "name": "full name",
          "email": "email address",
          "phone": "phone number",
          "skills": ["skill1", "skill2"],
          "experience": {
            "years": number,
            "description": "brief summary"
          },
          "education": {
            "degree": "degree name",
            "institution": "institution name",
            "year": year
          }
        }
        
        Resume Text: ${text.substring(0, 3000)}
        
        JSON:
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return parsed;
    } catch (error) {
      console.error('Error parsing resume with AI:', error);
      return null;
    }
  }
}

module.exports = AIService;