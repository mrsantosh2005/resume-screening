class AIService {
  static extractSkills(text) {
    const skillsDatabase = [
      'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'HTML', 'CSS',
      'MongoDB', 'SQL', 'AWS', 'Docker', 'Git', 'TypeScript', 'Angular', 'Vue.js',
      'PHP', 'Ruby', 'Swift', 'Kotlin', 'Machine Learning', 'AI', 'Data Science'
    ];
    
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    skillsDatabase.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    });
    
    return foundSkills;
  }

  static extractName(text) {
    const patterns = [
      /Name\s*:?\s*([^\n]+)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m,
      /Resume\s+of\s+([^\n]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return 'Candidate';
  }

  static extractEmail(text) {
    const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : '';
  }

  static extractExperience(text) {
    const patterns = [
      /(\d+)\+?\s*(?:years?|yrs?)/i,
      /experience\s*:?\s*(\d+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return 0;
  }

  static calculateMatchScore(resumeData, jobData) {
    const resumeSkills = (resumeData?.skills || []).map(s => String(s).toLowerCase());
    const jobSkills = (jobData?.skills || []).map(s => String(s).toLowerCase());
    
    const matchedSkills = [];
    const missingSkills = [];
    
    jobSkills.forEach(skill => {
      if (resumeSkills.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
    
    let score = 0;
    
    if (jobSkills.length > 0) {
      const skillMatchPercentage = (matchedSkills.length / jobSkills.length) * 60;
      score += skillMatchPercentage;
    }
    
    const resumeExp = resumeData?.experience?.years || 0;
    const jobExp = jobData?.experience || 0;
    
    if (resumeExp >= jobExp) {
      score += 30;
    } else if (resumeExp > 0) {
      const expRatio = resumeExp / jobExp;
      score += Math.min(expRatio * 30, 30);
    }
    
    return {
      totalScore: Math.min(Math.round(score), 100),
      matchedSkills,
      missingSkills,
      experienceMatch: resumeExp >= jobExp,
    };
  }

  static generateAnalysis(resumeData, jobData, matchData) {
    const strengths = [];
    const improvements = [];
    
    if (matchData.matchedSkills.length > 0) {
      strengths.push(`Has ${matchData.matchedSkills.length} out of ${jobData.skills.length} required skills`);
    }
    
    const resumeExp = resumeData?.experience?.years || 0;
    const jobExp = jobData?.experience || 0;
    
    if (resumeExp >= jobExp) {
      strengths.push(`Meets experience requirement (${resumeExp}+ years)`);
    } else if (resumeExp > 0) {
      improvements.push(`Needs ${jobExp - resumeExp} more years of experience`);
    }
    
    if (matchData.missingSkills.length > 0) {
      improvements.push(`Missing: ${matchData.missingSkills.slice(0, 3).join(', ')}`);
    }
    
    let recommendation = '';
    if (matchData.totalScore >= 80) {
      recommendation = 'Excellent match! Strongly recommend for interview.';
    } else if (matchData.totalScore >= 60) {
      recommendation = 'Good candidate. Consider for interview.';
    } else if (matchData.totalScore >= 40) {
      recommendation = 'Average match. Review manually.';
    } else {
      recommendation = 'Low match score. May not meet key requirements.';
    }
    
    return {
      strengths,
      weaknesses: improvements,
      recommendation,
    };
  }

  static async parseResumeText(text) {
    return {
      name: this.extractName(text),
      email: this.extractEmail(text),
      skills: this.extractSkills(text),
      experience: {
        years: this.extractExperience(text),
        description: 'Extracted from resume'
      },
      education: {}
    };
  }
}

module.exports = AIService;