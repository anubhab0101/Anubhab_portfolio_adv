import type { PortfolioData } from "./types";

export const seedPortfolioData: PortfolioData = {
  profile: {
    id: "main",
    brandName: "Anubhab",
    heroHeadline:
      "I am a Developer specializing in Python, frontend design, and crafting clean, impactful digital solutions.",
    summaryTitle: "Professional Summary",
    summary:
      "Computer Science student focused on AI and Data Science, experienced in Python development, full-stack applications, and cybersecurity projects. Good at delivering results, like improving process efficiency and achieving high model accuracy. Looking for chances to use technical skills and solve problems in AI and software development.",
    aboutTitle: "About Me",
    about:
      "Hi, I'm Anubhab, a final-year student at CV Raman Global University who's really into Python, front-end development, and game design. I enjoy turning ideas into clean, functional code and designing user experiences that make sense.",
    profileImageUrl: "/assets/Anubhab.png",
    splineUrl: "https://prod.spline.design/3fDaqfwGCnwy4ncn/scene.splinecode"
  },
  socials: [
    {
      id: "linkedin",
      label: "LinkedIn",
      platform: "linkedin",
      url: "https://www.linkedin.com/in/anubhab-mohapatra-01-/",
      iconImageUrl: "/assets/linkedin_image.jpeg",
      sortOrder: 1,
      published: true
    },
    {
      id: "github",
      label: "GitHub",
      platform: "github",
      url: "https://github.com/anubhab0101",
      iconImageUrl: "/assets/Github_Image.jpeg",
      sortOrder: 2,
      published: true
    },
    {
      id: "hackerrank",
      label: "HackerRank",
      platform: "hackerrank",
      url: "https://www.hackerrank.com/profile/www_anubhabmaha1",
      iconImageUrl: "/assets/HackerRank_Image.png",
      sortOrder: 3,
      published: true
    }
  ],
  education: [
    {
      id: "bachelor",
      degree: "Bachelor's Degree",
      institution: "CV Raman Global University",
      location: "Bhubaneswar",
      period: "2022 - 2026",
      description: "Computer Science with a focus on AI, Data Science, and full-stack development.",
      sortOrder: 1,
      published: true
    },
    {
      id: "higher-secondary",
      degree: "Higher Secondary Education",
      institution: "Sakti Higher Secondary School",
      location: "Cuttack",
      period: "2020 - 2022",
      description: "",
      sortOrder: 2,
      published: true
    }
  ],
  skills: [
    { id: "python", name: "Python", category: "Programming", sortOrder: 1, published: true },
    { id: "ai", name: "Artificial Intelligence", category: "AI/ML", sortOrder: 2, published: true },
    { id: "data-science", name: "Data Science", category: "AI/ML", sortOrder: 3, published: true },
    { id: "machine-learning", name: "Machine Learning", category: "AI/ML", sortOrder: 4, published: true },
    { id: "frontend", name: "Frontend Development", category: "Web", sortOrder: 5, published: true },
    { id: "cybersecurity", name: "Cybersecurity", category: "Security", sortOrder: 6, published: true },
    { id: "computer-vision", name: "Computer Vision", category: "AI/ML", sortOrder: 7, published: true },
    { id: "nlp", name: "Natural Language Processing", category: "AI/ML", sortOrder: 8, published: true }
  ],
  projects: [
    {
      id: "nlp-ml-analysis",
      title: "NLP/ML Analysis Platform",
      description: "Advanced text analysis platform powered by Gemini AI.",
      techStack: ["Python", "Streamlit", "NLP", "Gemini AI"],
      liveUrl: "https://geminiintigration.streamlit.app",
      repoUrl: "",
      imageUrl: "/assets/ml_analysis.png",
      imageAlt: "NLP/ML Analysis Platform dashboard powered by Gemini AI",
      sortOrder: 1,
      published: true
    },
    {
      id: "pneumonia-detection",
      title: "Pneumonia Detection",
      description: "AI-powered medical imaging system that analyzes chest X-rays.",
      techStack: ["Python", "TensorFlow", "Computer Vision"],
      liveUrl: "https://anubhab0101-pneumonia-detection-from-chest-x-ray-pp-qdevtn.streamlit.app/",
      repoUrl: "",
      imageUrl: "/assets/chest-x-ray.png",
      imageAlt: "Pneumonia Detection AI chest X-ray analysis interface",
      sortOrder: 2,
      published: true
    },
    {
      id: "blackeye",
      title: "Blackeye",
      description: "A comprehensive phishing awareness and testing tool.",
      techStack: ["Shell Script", "Automation", "Cybersecurity"],
      liveUrl: "",
      repoUrl: "https://github.com/anubhab0101/blackeye.git",
      imageUrl: "/assets/blackeye.png",
      imageAlt: "Blackeye cybersecurity testing platform interface",
      sortOrder: 3,
      published: true
    },
    {
      id: "class-sensi",
      title: "Class-sensi",
      description: "Educational platform that automates classroom management.",
      techStack: ["Python", "Automation", "Education Tech"],
      liveUrl: "",
      repoUrl: "https://github.com/anubhab0101/Class-sensi.git",
      imageUrl: "/assets/class-sensi.png",
      imageAlt: "Class-sensi classroom management dashboard",
      sortOrder: 4,
      published: true
    },
    {
      id: "software-reliability",
      title: "Software Reliability Prediction Model for Imbalanced Datasets",
      description:
        "A full-stack machine learning system for predicting software reliability on highly imbalanced datasets. Includes data preprocessing, model training, and evaluation.",
      techStack: ["React", "TypeScript", "Node.js", "Express", "Python", "Tailwind CSS"],
      liveUrl: "",
      repoUrl: "https://github.com/anubhab0101/Software-Realibility-Prediction-model-for-imbalance-dataset.git",
      imageUrl: "/assets/imbalance-dataset.png",
      imageAlt: "Software reliability prediction dashboard for imbalanced dataset analysis",
      sortOrder: 5,
      published: true
    }
  ],
  certifications: [],
  testimonials: [
    {
      id: "dss",
      quote: "Anubhab's work on the pneumonia detection system was exceptional. His attention to detail is impressive.",
      authorName: "Dr. Sarah Singh",
      authorTitle: "Lead Data Scientist",
      initials: "DSS",
      sortOrder: 1,
      published: true
    },
    {
      id: "pjrs",
      quote: "One of the most dedicated students I've worked with. Anubhab consistently delivers high-quality projects.",
      authorName: "Prof. Jyoti Ranjan Swain",
      authorTitle: "Professor of CS",
      initials: "PJRS",
      sortOrder: 2,
      published: true
    },
    {
      id: "ap",
      quote: "His code quality and problem-solving approach are remarkable. Definitely someone to watch.",
      authorName: "Amit Patel",
      authorTitle: "Senior Software Engineer",
      initials: "AP",
      sortOrder: 3,
      published: true
    }
  ],
  contact: {
    id: "main",
    email: "anubhabmohapatra.01@gmail.com",
    phone: "+91 82605 86748",
    availabilityText: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."
  },
  seo: {
    id: "main",
    title: "Anubhab Mohapatra - Python Developer & AI Specialist | Portfolio",
    description:
      "Anubhab Mohapatra - Computer Science student specializing in Python development, AI, Data Science, and full-stack applications.",
    keywords: [
      "Anubhab Mohapatra",
      "Python Developer",
      "AI Developer",
      "Data Science",
      "Machine Learning",
      "Portfolio",
      "CV Raman Global University"
    ],
    canonicalUrl: "https://anubhabmohapatra.in/",
    ogImageUrl: "https://anubhabmohapatra.in/assets/Anubhab.png"
  }
};
