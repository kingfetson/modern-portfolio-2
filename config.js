/**
 * Portfolio Configuration
 * Centralizes all settings, professional data, and feature flags
 */
const CONFIG = {
  // Site Metadata
  site: {
    title: "Simon - Clinical Professional & Web Designer",
    description: "Healthcare professional portfolio featuring clinical skills, case studies, and ATS resume/CV builder.",
    author: "Marlon",
    version: "1.0.0",
    baseUrl: window.location.origin
  },

  // LocalStorage Keys
  storage: {
    keys: {
      resumeHistory: 'ats_resume_history',
      cvHistory: 'ats_cv_history',
      lastVisitedPage: 'portfolio_last_page',
      themePreference: 'portfolio_theme'
    },
    maxHistoryItems: 50, // Prevent localStorage bloat
  },

  // Professional Information
  professional: {
    name: "Marlon",
    title: "Registered Nurse & Clinical Web Designer",
    email: "marlon.healthcare@hospital.org",
    phone: "(212) 555-0145",
    location: "New York, NY",
    npi: "1234567890",
    license: "RN-123456",
    specialties: [
      "Critical Care",
      "Emergency Medicine", 
      "Clinical Documentation",
      "Health Informatics",
      "Patient Education"
    ],
    certifications: [
      { name: "Registered Nurse (RN)", issuer: "State Board of Nursing", expiry: "2027" },
      { name: "Advanced Cardiac Life Support (ACLS)", issuer: "American Heart Association", expiry: "2026" },
      { name: "Basic Life Support (BLS)", issuer: "American Heart Association", expiry: "2026" },
      { name: "Certified Emergency Nurse (CEN)", issuer: "BCEN", expiry: "2027" },
      { name: "Trauma Nursing Core Course (TNCC)", issuer: "Emergency Nurses Association", expiry: "2026" }
    ]
  },

  // PDF Generation Settings
  pdf: {
    margin: 0.5,
    format: 'letter',
    orientation: 'portrait',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  },

  // Navigation Structure
  navigation: [
    { id: 'home', label: 'Home', icon: 'fas fa-home' },
    { id: 'about', label: 'About', icon: 'fas fa-user' },
    { id: 'resume', label: 'Resume', icon: 'fas fa-file-alt' },
    { id: 'cv', label: 'CV', icon: 'fas fa-id-card' },
    { id: 'skills', label: 'Skills', icon: 'fas fa-stethoscope' },
    { id: 'works', label: 'Works', icon: 'fas fa-briefcase-medical' },
    { id: 'contact', label: 'Contact', icon: 'fas fa-address-card' }
  ],

  // Feature Flags & Limits
  features: {
    enableATSBuilder: true,
    enableHistory: true,
    enableFileUpload: true,
    maxFileSizeMB: 10,
    allowedUploadTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ],
    autoSaveInterval: null, // Set to milliseconds (e.g., 30000) to enable auto-save
    debugMode: false
  },

  // Default Form Values
  defaults: {
    resume: {
      summary: "Results-driven healthcare professional with expertise in critical care, emergency response, and clinical documentation. Committed to evidence-based practice and patient-centered care.",
      skills: "Patient Assessment, Emergency Care, Critical Care, EHR Systems, Clinical Documentation, Medication Administration, IV Therapy, ACLS, BLS"
    },
    cv: {
      publications: "Peer-reviewed articles and clinical guidelines contributions available upon request.",
      languages: "English (Native), Spanish (Professional Working Proficiency)",
      references: "Available upon request."
    }
  },

  // Clinical Contact Information
  contact: {
    hospital: {
      name: "Metropolitan General Hospital",
      department: "Critical Care Unit - 5th Floor",
      address: "1500 Medical Center Drive, New York, NY 10001",
      mainLine: "(212) 555-0100 ext. 5432",
      fax: "(212) 555-0101",
      emergency: "(212) 555-0199"
    },
    emergencyNumbers: {
      emergencyServices: "911",
      poisonControl: "1-800-222-1222",
      nurseHotline: "(212) 555-0188"
    },
    officeHours: [
      { days: "Monday - Friday", time: "7:00 AM - 7:00 PM", shift: "Day/Night Shifts" },
      { days: "Saturday", time: "8:00 AM - 4:00 PM", shift: "Weekend Rotation" },
      { days: "Sunday", time: "On Call", shift: "Emergency Coverage" }
    ],
    inquiryTypes: [
      { value: 'referral', label: 'Physician Referral' },
      { value: 'consultation', label: 'Clinical Consultation' },
      { value: 'collaboration', label: 'Research Collaboration' },
      { value: 'speaking', label: 'Speaking Engagement' },
      { value: 'preceptorship', label: 'Preceptorship Opportunity' },
      { value: 'other', label: 'Other Professional Matter' }
    ]
  },

  // Validation Patterns
  validation: {
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    requiredFields: {
      resume: ['resName', 'resEmail'],
      cv: ['cvName', 'cvEmail'],
      contact: ['contactName', 'contactEmail', 'contactInquiry']
    }
  }
};

// Make globally available for vanilla JS
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}

// Optional: Console info in debug mode
if (CONFIG.features.debugMode) {
  console.log('[Portfolio Config] Loaded:', CONFIG);
}
