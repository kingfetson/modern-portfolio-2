# 🏥 Clinical Portfolio & ATS Resume Builder

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)

**A Professional Healthcare Portfolio with Intelligent ATS Resume/CV Builder**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [File Structure](#-file-structure)
- [Configuration](#-configuration)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

A **modern, responsive portfolio website** designed specifically for healthcare professionals, featuring an **intelligent ATS-optimized Resume and CV builder**. Upload your existing documents, auto-generate ATS-friendly versions, preview them instantly, and download professional PDFs—all while maintaining a complete history of your documents.

### Perfect For:
- 🩺 Registered Nurses & Nurse Practitioners
- 👨‍️ Physicians & Medical Doctors
- 🧪 Healthcare Administrators
- 💊 Pharmacists & Clinical Researchers
- 🏥 Medical Technologists & Allied Health Professionals

---

## ✨ Features

### 🌟 Core Features

- **📄 ATS Resume Builder**
  - Upload PDF/DOCX files for automatic parsing
  - Intelligent text extraction and form pre-filling
  - ATS-optimized templates (clean, keyword-rich formatting)
  - One-click PDF generation and download
  - Complete document history with localStorage persistence

- ** Professional Portfolio**
  - Modern, responsive design (mobile-first)
  - Clinical skills showcase with competency levels
  - Case studies and clinical experience timeline
  - Professional certifications display
  - Contact information with emergency details

- **💾 Smart History Management**
  - Automatic save of all generated resumes/CVs
  - Preview, download, or delete previous versions
  - Timestamp tracking for each document
  - Up to 50 documents stored locally

- **🔧 Advanced Features**
  - PDF/DOCX file parsing with PDF.js and Mammoth.js
  - Real-time preview before download
  - Professional contact form for inquiries
  - Configurable settings via `config.js`
  - No backend required - pure client-side application

### 🏥 Clinical-Specific Features

- **Skills Section**
  - 6 clinical competency categories
  - Visual progress bars for skill levels
  - Certification tracking with expiry dates
  - Medical technology proficiencies

- **Works/Experience Section**
  - Clinical work history timeline
  - Detailed case studies (6+ specialties)
  - Research publications display
  - Professional achievements

- **Contact Section**
  - Hospital/practice location details
  - NPI number and license information
  - Office hours with shift details
  - Emergency contact information
  - Professional inquiry form

---

## 📸 Screenshots

<div align="center">

### Home Page
![Home Page](https://via.placeholder.com/800x450/5271ff/ffffff?text=Home+Page+-+Professional+Introduction)

### ATS Resume Builder
![Resume Builder](https://via.placeholder.com/800x450/5271ff/ffffff?text=ATS+Resume+Builder+-+Upload+%26+Generate)

### Clinical Skills
![Skills](https://via.placeholder.com/800x450/5271ff/ffffff?text=Clinical+Skills+%26+Competencies)

### Case Studies
![Works](https://via.placeholder.com/800x450/5271ff/ffffff?text=Clinical+Case+Studies)

</div>

---

## 🛠 Tech Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="48" height="48" />
      <br>HTML5
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="48" height="48" />
      <br>CSS3
    </td>
    <td align="center" width="96">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="48" height="48" />
      <br>JavaScript
    </td>
    <td align="center" width="96">
      <img src="https://via.placeholder.com/48/5271ff/ffffff?text=PDF" width="48" height="48" />
      <br>PDF.js
    </td>
  </tr>
  <tr>
    <td align="center" width="96">
      <img src="https://via.placeholder.com/48/28a745/ffffff?text=ATS" width="48" height="48" />
      <br>ATS Optimized
    </td>
    <td align="center" width="96">
      <img src="https://via.placeholder.com/48/ffc107/ffffff?text=LS" width="48" height="48" />
      <br>localStorage
    </td>
    <td align="center" width="96">
      <img src="https://via.placeholder.com/48/17a2b8/ffffff?text=FA" width="48" height="48" />
      <br>Font Awesome
    </td>
    <td align="center" width="96">
      <img src="https://via.placeholder.com/48/6f42c1/ffffff?text=GP" width="48" height="48" />
      <br>Google Fonts
    </td>
  </tr>
</table>

### Libraries & Tools

- **html2pdf.js** - Client-side PDF generation
- **PDF.js** - PDF parsing and text extraction
- **Mammoth.js** - DOCX file parsing
- **Font Awesome 6** - Professional icons
- **Poppins Font** - Modern typography

---

## 📦 Installation

### Option 1: Clone Repository


# Clone the repository
git clone https://github.com/yourusername/clinical-portfolio.git

# Navigate to project directory
cd clinical-portfolio

# Open index.html in your browser
open index.html


### Option 2: Download ZIP

1. Download the [latest release](https://github.com/yourusername/clinical-portfolio/releases)
2. Extract the ZIP file
3. Open `index.html` in your web browser

### Option 3: Live Server (Recommended for Development)


# If you have VS Code
# Install "Live Server" extension
# Right-click index.html > "Open with Live Server"

# Or use Python
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000


---

## 🚀 Usage

### 1️⃣ First Time Setup


# No installation required!
# Simply open index.html in any modern browser


### 2️⃣ Build Your ATS Resume

1. **Navigate to Resume Page**
   - Click "Resume" in the navigation menu

2. **Upload Existing Resume** (Optional)
   - Click "Choose File"
   - Select your PDF or DOCX resume
   - Wait for automatic parsing and form pre-filling

3. **Edit Information**
   - Review and update auto-filled data
   - Add work experience entries
   - Add education details
   - List skills and certifications

4. **Generate ATS Resume**
   - Click "Save & Generate ATS Resume"
   - Preview your ATS-optimized resume
   - Click "Download PDF" to save

### 3️⃣ Build Your CV

1. **Navigate to CV Page**
   - Click "CV" in the navigation menu

2. **Upload or Create**
   - Upload existing CV or fill manually
   - Add publications, languages, references

3. **Generate & Download**
   - Generate ATS-optimized CV
   - Preview and download as PDF

### 4️⃣ Manage History

- View all previously generated resumes/CVs
- Preview any previous version
- Download or delete as needed
- History persists in browser storage

---

## 📁 File Structure

clinical-portfolio/
│
├── index.html              # Main HTML file with all pages
├── style.css               # Complete styling (responsive)
├── script.js               # Main application logic
├── config.js               # Centralized configuration
│
├── README.md               # This file
├── LICENSE                 # MIT License
│
└── assets/                 # (Optional) Images, fonts, etc.
    └── images/


### File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | Main structure with 7 pages (Home, About, Resume, CV, Skills, Works, Contact) |
| `style.css` | Complete styling with responsive design, animations, and clinical theme |
| `script.js` | Application logic: file upload, PDF parsing, ATS generation, history management |
| `config.js` | Centralized configuration: professional info, settings, feature flags |

---

## ⚙️ Configuration

Edit `config.js` to customize your portfolio:


const CONFIG = {
  // Update your professional information
  professional: {
    name: "Your Name",
    title: "Your Professional Title",
    email: "your.email@hospital.org",
    phone: "(555) 123-4567",
    npi: "1234567890",
    license: "RN-123456"
  },

  // Feature flags
  features: {
    enableATSBuilder: true,
    enableHistory: true,
    maxFileSizeMB: 10,
    debugMode: false
  },

  // PDF generation settings
  pdf: {
    margin: 0.5,
    format: 'letter',
    orientation: 'portrait'
  }
};
```

### Configuration Options

| Category | Options |
|----------|---------|
| **Professional Info** | Name, title, email, phone, NPI, license number, certifications |
| **Contact Details** | Hospital name, address, department, emergency numbers |
| **Features** | Enable/disable ATS builder, history, file upload |
| **Limits** | Max file size, max history items, allowed file types |
| **PDF Settings** | Margins, format, orientation, quality |

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Opera | 76+ | ✅ Full Support |

**Note:** Requires modern JavaScript (ES6+) and localStorage support.

---

## 🔒 Privacy & Security

- **100% Client-Side**: All data stays in your browser
- **No Server Uploads**: Files are processed locally
- **localStorage Only**: Data stored in browser storage
- **No Tracking**: No analytics or tracking scripts
- **HIPAA Consideration**: Do NOT upload patient information

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
   
   git fork https://github.com/yourusername/clinical-portfolio.git
   ```

2. **Create Feature Branch**
   
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Changes**
   
   git commit -m "Add AmazingFeature"
   ```

4. **Push to Branch**
   
   git push origin feature/AmazingFeature
   ```

5. **Open Pull Request**

### Development Guidelines

- Follow existing code style
- Comment complex functions
- Test in multiple browsers
- Ensure responsive design
- Update README if adding features

---

## 🙏 Acknowledgments

- **PDF.js** by Mozilla - PDF parsing library
- **html2pdf.js** - PDF generation library
- **Mammoth.js** - DOCX parsing library
- **Font Awesome** - Icon library
- **Google Fonts** - Poppins font family
- **Healthcare Professionals** - For inspiration and feedback

---

## 📚 Additional Resources

- [ATS Resume Guide](https://www.jobscan.co/ats-resume/)
- [Clinical Documentation Best Practices](https://www.aacn.org/)
- [Healthcare Portfolio Examples](https://www.nursingworld.org/)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)

---
## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.


MIT License

Copyright (c) 2026 @Festus



---



<div align="center">

**Made with ❤️ for Healthcare Professionals**

⭐ **Star this repo if you find it helpful!** ⭐

[⬆ Back to Top](#-clinical-portfolio--ats-resume-builder)

</div>
