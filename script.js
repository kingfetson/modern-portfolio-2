// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page-content');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        const targetPageId = link.getAttribute('data-page');
        pages.forEach(page => page.classList.remove('active-page'));
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.classList.add('active-page');
            if (targetPageId === 'resume') loadResumeHistory();
            if (targetPageId === 'cv') loadCVHistory();
        }
    });
});

// Storage keys
const RESUME_HISTORY_KEY = 'ats_resume_history';
const CV_HISTORY_KEY = 'ats_cv_history';
let currentResumeData = null;
let currentCVData = null;

// ==================== RESUME FUNCTIONS ====================

// File Upload
document.getElementById('resumeUpload').addEventListener('change', function(e) {
    handleFileUpload(e, 'resume');
});

async function handleFileUpload(event, type) {
    const file = event.target.files[0];
    const statusDiv = document.getElementById(`${type}UploadStatus`);
    
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
        showUploadStatus(statusDiv, 'File size must be less than 10MB', 'error');
        return;
    }
    
    showUploadStatus(statusDiv, '<i class="fas fa-spinner fa-spin"></i> Processing file...', 'info');
    
    try {
        let extractedData = {};
        
        if (file.type === 'application/pdf') {
            extractedData = await parsePDF(file);
        } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
            extractedData = await parseDOCX(file);
        } else {
            showUploadStatus(statusDiv, 'Please upload a PDF or DOCX file', 'error');
            return;
        }
        
        // Auto-fill form
        autoFillForm(extractedData, type);
        
        // Auto-generate ATS version
        setTimeout(() => {
            if (type === 'resume') {
                saveAndGenerateResume(true);
            } else {
                saveAndGenerateCV(true);
            }
        }, 500);
        
        showUploadStatus(statusDiv, '<i class="fas fa-check-circle"></i> File processed successfully! ATS version generated.', 'success');
        
        // Show editor
        if (type === 'resume') {
            document.getElementById('resumeEditor').style.display = 'block';
        } else {
            document.getElementById('cvEditor').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error:', error);
        showUploadStatus(statusDiv, 'Error processing file. Please fill manually.', 'error');
    }
}

async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    
    return extractInfoFromText(fullText);
}

async function parseDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return extractInfoFromText(result.value);
}

function extractInfoFromText(text) {
    const data = {
        name: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        summary: '',
        skills: '',
        experience: [],
        education: []
    };
    
    // Extract email
    const emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/gi);
    if (emailMatch) data.email = emailMatch[0];
    
    // Extract phone
    const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/gim);
    if (phoneMatch) data.phone = phoneMatch[0];
    
    // Extract name (usually first line with capital letters)
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
        const nameLine = lines[0].trim();
        if (nameLine.length < 50 && /[A-Z]/.test(nameLine)) {
            data.name = nameLine;
        }
    }
    
    // Extract skills section
    const skillsMatch = text.match(/skills[:\s]+([^.\n]+)/i);
    if (skillsMatch) data.skills = skillsMatch[1].trim();
    
    // Extract education
    const eduPatterns = [
        /(?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?)[^\n]*/gi,
        /(?:University|College|Institute)[^\n]*/gi
    ];
    
    eduPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            matches.forEach(match => {
                data.education.push({
                    degree: match.trim(),
                    school: '',
                    date: ''
                });
            });
        }
    });
    
    return data;
}

function autoFillForm(data, type) {
    const prefix = type === 'resume' ? 'res' : 'cv';
    
    if (data.name) document.getElementById(`${prefix}Name`).value = data.name;
    if (data.email) document.getElementById(`${prefix}Email`).value = data.email;
    if (data.phone) document.getElementById(`${prefix}Phone`).value = data.phone;
    if (data.title) document.getElementById(`${prefix}Title`).value = data.title;
    if (data.summary) document.getElementById(`${prefix}Summary`).value = data.summary;
    if (data.skills) document.getElementById(`${prefix}Skills`).value = data.skills;
    
    // Add experience if found
    if (data.experience && data.experience.length > 0) {
        data.experience.forEach((exp, index) => {
            if (index === 0 && type === 'resume') addWorkExperience();
            if (index === 0 && type === 'cv') addCVExperience();
            // Fill in the fields...
        });
    }
    
    // Add education if found
    if (data.education && data.education.length > 0) {
        data.education.forEach((edu, index) => {
            if (index === 0 && type === 'resume') addEducation();
            if (index === 0 && type === 'cv') addCVEducation();
            // Fill in the fields...
        });
    }
}

function showUploadStatus(element, message, type) {
    element.innerHTML = message;
    element.className = `upload-status ${type}`;
}

function toggleResumeEditor() {
    const editor = document.getElementById('resumeEditor');
    const btnText = document.getElementById('resumeToggleText');
    if (editor.style.display === 'none') {
        editor.style.display = 'block';
        btnText.textContent = 'Hide Editor';
    } else {
        editor.style.display = 'none';
        btnText.textContent = 'Edit Manually';
    }
}

function toggleCVEditor() {
    const editor = document.getElementById('cvEditor');
    const btnText = document.getElementById('cvToggleText');
    if (editor.style.display === 'none') {
        editor.style.display = 'block';
        btnText.textContent = 'Hide Editor';
    } else {
        editor.style.display = 'none';
        btnText.textContent = 'Edit Manually';
    }
}

function addWorkExperience() {
    const container = document.getElementById('workExperienceContainer');
    const div = document.createElement('div');
    div.className = 'experience-item';
    div.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <input type="text" class="job-title" placeholder="Job Title *">
        <input type="text" class="company" placeholder="Company Name *">
        <div class="date-row">
            <input type="text" class="date-start" placeholder="Start Date (e.g., Jan 2020)">
            <input type="text" class="date-end" placeholder="End Date (e.g., Present)">
        </div>
        <textarea class="job-desc" rows="3" placeholder="• Responsibility or achievement\n• Another point"></textarea>
    `;
    container.appendChild(div);
}

function addEducation() {
    const container = document.getElementById('educationContainer');
    const div = document.createElement('div');
    div.className = 'education-item';
    div.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <input type="text" class="degree" placeholder="Degree *">
        <input type="text" class="school" placeholder="School/University *">
        <input type="text" class="edu-date" placeholder="Graduation Year">
    `;
    container.appendChild(div);
}

function collectResumeData() {
    const expItems = document.querySelectorAll('#workExperienceContainer .experience-item');
    const eduItems = document.querySelectorAll('#educationContainer .education-item');
    
    const experience = [];
    expItems.forEach(item => {
        experience.push({
            title: item.querySelector('.job-title').value,
            company: item.querySelector('.company').value,
            startDate: item.querySelector('.date-start').value,
            endDate: item.querySelector('.date-end').value,
            description: item.querySelector('.job-desc').value
        });
    });
    
    const education = [];
    eduItems.forEach(item => {
        education.push({
            degree: item.querySelector('.degree').value,
            school: item.querySelector('.school').value,
            date: item.querySelector('.edu-date').value
        });
    });
    
    return {
        id: Date.now(),
        date: new Date().toLocaleString(),
        name: document.getElementById('resName').value,
        title: document.getElementById('resTitle').value,
        email: document.getElementById('resEmail').value,
        phone: document.getElementById('resPhone').value,
        location: document.getElementById('resLocation').value,
        summary: document.getElementById('resSummary').value,
        skills: document.getElementById('resSkills').value,
        certifications: document.getElementById('resCertifications').value,
        experience: experience,
        education: education
    };
}

function saveAndGenerateResume(auto = false) {
    const data = collectResumeData();
    
    if (!data.name || !data.email) {
        alert('Please fill in at least Name and Email');
        return;
    }
    
    // Save to history
    saveToHistory(data, RESUME_HISTORY_KEY);
    
    // Generate and preview
    currentResumeData = data;
    generateResumePreview(data);
    
    if (!auto) {
        document.getElementById('resumePreviewSection').style.display = 'block';
        document.getElementById('resumePreviewSection').scrollIntoView({ behavior: 'smooth' });
    }
    
    loadResumeHistory();
}

function generateResumePreview(data) {
    const html = `
        <div class="ats-template" id="currentResumePreview">
            <div class="ats-header">
                <h1>${data.name}</h1>
                ${data.title ? `<div class="ats-title">${data.title}</div>` : ''}
                <div class="ats-contact">
                    ${data.email ? `<span>${data.email}</span>` : ''}
                    ${data.phone ? ` | <span>${data.phone}</span>` : ''}
                    ${data.location ? ` | <span>${data.location}</span>` : ''}
                </div>
            </div>
            
            ${data.summary ? `
            <div class="ats-section">
                <h2>Professional Summary</h2>
                <p>${data.summary}</p>
            </div>
            ` : ''}
            
            ${data.experience.length > 0 ? `
            <div class="ats-section">
                <h2>Work Experience</h2>
                ${data.experience.map(exp => `
                    <div class="ats-job">
                        <div class="ats-job-header">
                            <div>
                                <div class="ats-job-title">${exp.title}</div>
                                <div class="ats-job-company">${exp.company}</div>
                            </div>
                            <div class="ats-job-date">${exp.startDate} - ${exp.endDate}</div>
                        </div>
                        ${exp.description ? `
                        <div class="ats-job-desc">
                            <ul>
                                ${exp.description.split('\n').filter(line => line.trim()).map(line => `<li>${line.replace(/^[\-\•\*]\s*/, '')}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.education.length > 0 ? `
            <div class="ats-section">
                <h2>Education</h2>
                ${data.education.map(edu => `
                    <div class="ats-education-item">
                        <div class="ats-edu-header">
                            <div class="ats-degree">${edu.degree}</div>
                            <div class="ats-edu-date">${edu.date}</div>
                        </div>
                        <div class="ats-school">${edu.school}</div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.skills ? `
            <div class="ats-section">
                <h2>Skills</h2>
                <div class="ats-skills">${data.skills}</div>
            </div>
            ` : ''}
            
            ${data.certifications ? `
            <div class="ats-section">
                <h2>Certifications</h2>
                <p>${data.certifications}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('resumePreviewContainer').innerHTML = html;
}

function downloadCurrentResume() {
    if (!currentResumeData) return;
    
    const element = document.getElementById('currentResumePreview');
    const opt = {
        margin: 0.5,
        filename: `${currentResumeData.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

function closeResumePreview() {
    document.getElementById('resumePreviewSection').style.display = 'none';
}

function saveToHistory(data, key) {
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    history.unshift(data);
    localStorage.setItem(key, JSON.stringify(history));
}

function loadResumeHistory() {
    const history = JSON.parse(localStorage.getItem(RESUME_HISTORY_KEY) || '[]');
    const container = document.getElementById('resumeHistoryList');
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No resumes yet. Upload or create one!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-header">
                <div>
                    <div class="history-item-title">${item.name || 'Untitled'}</div>
                    <div class="history-item-date">${item.date}</div>
                </div>
            </div>
            <div class="history-item-actions">
                <button class="history-btn preview" onclick="previewResumeFromHistory(${item.id})">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="history-btn download" onclick="downloadResumeFromHistory(${item.id})">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="history-btn delete" onclick="deleteResumeFromHistory(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function previewResumeFromHistory(id) {
    const history = JSON.parse(localStorage.getItem(RESUME_HISTORY_KEY) || '[]');
    const item = history.find(h => h.id === id);
    if (item) {
        currentResumeData = item;
        generateResumePreview(item);
        document.getElementById('resumePreviewSection').style.display = 'block';
        document.getElementById('resumePreviewSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadResumeFromHistory(id) {
    const history = JSON.parse(localStorage.getItem(RESUME_HISTORY_KEY) || '[]');
    const item = history.find(h => h.id === id);
    if (item) {
        currentResumeData = item;
        generateResumePreview(item);
        setTimeout(() => downloadCurrentResume(), 100);
    }
}

function deleteResumeFromHistory(id) {
    if (!confirm('Delete this resume?')) return;
    
    let history = JSON.parse(localStorage.getItem(RESUME_HISTORY_KEY) || '[]');
    history = history.filter(h => h.id !== id);
    localStorage.setItem(RESUME_HISTORY_KEY, JSON.stringify(history));
    loadResumeHistory();
}

// ==================== CV FUNCTIONS ====================

document.getElementById('cvUpload').addEventListener('change', function(e) {
    handleFileUpload(e, 'cv');
});

function addCVExperience() {
    const container = document.getElementById('cvExperienceContainer');
    const div = document.createElement('div');
    div.className = 'experience-item';
    div.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <input type="text" class="cv-job-title" placeholder="Position *">
        <input type="text" class="cv-company" placeholder="Organization *">
        <div class="date-row">
            <input type="text" class="cv-date-start" placeholder="Start Date">
            <input type="text" class="cv-date-end" placeholder="End Date">
        </div>
        <textarea class="cv-job-desc" rows="3" placeholder="Detailed responsibilities..."></textarea>
    `;
    container.appendChild(div);
}

function addCVEducation() {
    const container = document.getElementById('cvEducationContainer');
    const div = document.createElement('div');
    div.className = 'education-item';
    div.innerHTML = `
        <button type="button" class="remove-btn" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        <input type="text" class="cv-degree" placeholder="Degree *">
        <input type="text" class="cv-school" placeholder="Institution *">
        <input type="text" class="cv-edu-date" placeholder="Year">
        <textarea class="cv-edu-details" rows="2" placeholder="Thesis, honors, etc."></textarea>
    `;
    container.appendChild(div);
}

function collectCVData() {
    const expItems = document.querySelectorAll('#cvExperienceContainer .experience-item');
    const eduItems = document.querySelectorAll('#cvEducationContainer .education-item');
    
    const experience = [];
    expItems.forEach(item => {
        experience.push({
            title: item.querySelector('.cv-job-title').value,
            company: item.querySelector('.cv-company').value,
            startDate: item.querySelector('.cv-date-start').value,
            endDate: item.querySelector('.cv-date-end').value,
            description: item.querySelector('.cv-job-desc').value
        });
    });
    
    const education = [];
    eduItems.forEach(item => {
        education.push({
            degree: item.querySelector('.cv-degree').value,
            school: item.querySelector('.cv-school').value,
            date: item.querySelector('.cv-edu-date').value,
            details: item.querySelector('.cv-edu-details').value
        });
    });
    
    return {
        id: Date.now(),
        date: new Date().toLocaleString(),
        name: document.getElementById('cvName').value,
        title: document.getElementById('cvTitle').value,
        email: document.getElementById('cvEmail').value,
        phone: document.getElementById('cvPhone').value,
        location: document.getElementById('cvLocation').value,
        summary: document.getElementById('cvSummary').value,
        skills: document.getElementById('cvSkills').value,
        publications: document.getElementById('cvPublications').value,
        languages: document.getElementById('cvLanguages').value,
        references: document.getElementById('cvReferences').value,
        experience: experience,
        education: education
    };
}

function saveAndGenerateCV(auto = false) {
    const data = collectCVData();
    
    if (!data.name || !data.email) {
        alert('Please fill in at least Name and Email');
        return;
    }
    
    saveToHistory(data, CV_HISTORY_KEY);
    currentCVData = data;
    generateCVPreview(data);
    
    if (!auto) {
        document.getElementById('cvPreviewSection').style.display = 'block';
        document.getElementById('cvPreviewSection').scrollIntoView({ behavior: 'smooth' });
    }
    
    loadCVHistory();
}

function generateCVPreview(data) {
    const html = `
        <div class="ats-template" id="currentCVPreview">
            <div class="ats-header">
                <h1>${data.name}</h1>
                ${data.title ? `<div class="ats-title">${data.title}</div>` : ''}
                <div class="ats-contact">
                    ${data.email ? `<span>${data.email}</span>` : ''}
                    ${data.phone ? ` | <span>${data.phone}</span>` : ''}
                    ${data.location ? ` | <span>${data.location}</span>` : ''}
                </div>
            </div>
            
            ${data.summary ? `
            <div class="ats-section">
                <h2>Professional Summary</h2>
                <p>${data.summary}</p>
            </div>
            ` : ''}
            
            ${data.experience.length > 0 ? `
            <div class="ats-section">
                <h2>Professional Experience</h2>
                ${data.experience.map(exp => `
                    <div class="ats-job">
                        <div class="ats-job-header">
                            <div>
                                <div class="ats-job-title">${exp.title}</div>
                                <div class="ats-job-company">${exp.company}</div>
                            </div>
                            <div class="ats-job-date">${exp.startDate} - ${exp.endDate}</div>
                        </div>
                        ${exp.description ? `
                        <div class="ats-job-desc">
                            <ul>
                                ${exp.description.split('\n').filter(line => line.trim()).map(line => `<li>${line.replace(/^[\-\•\*]\s*/, '')}</li>`).join('')}
                            </ul>
                        </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.education.length > 0 ? `
            <div class="ats-section">
                <h2>Education</h2>
                ${data.education.map(edu => `
                    <div class="ats-education-item">
                        <div class="ats-edu-header">
                            <div class="ats-degree">${edu.degree}</div>
                            <div class="ats-edu-date">${edu.date}</div>
                        </div>
                        <div class="ats-school">${edu.school}</div>
                        ${edu.details ? `<p style="font-size:12px;margin-top:5px;">${edu.details}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.publications ? `
            <div class="ats-section">
                <h2>Publications</h2>
                <p>${data.publications}</p>
            </div>
            ` : ''}
            
            ${data.skills ? `
            <div class="ats-section">
                <h2>Skills & Competencies</h2>
                <div class="ats-skills">${data.skills}</div>
            </div>
            ` : ''}
            
            ${data.languages ? `
            <div class="ats-section">
                <h2>Languages</h2>
                <p>${data.languages}</p>
            </div>
            ` : ''}
            
            ${data.references ? `
            <div class="ats-section">
                <h2>References</h2>
                <p>${data.references}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('cvPreviewContainer').innerHTML = html;
}

function downloadCurrentCV() {
    if (!currentCVData) return;
    
    const element = document.getElementById('currentCVPreview');
    const opt = {
        margin: 0.5,
        filename: `${currentCVData.name.replace(/\s+/g, '_')}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
}

function closeCVPreview() {
    document.getElementById('cvPreviewSection').style.display = 'none';
}

function loadCVHistory() {
    const history = JSON.parse(localStorage.getItem(CV_HISTORY_KEY) || '[]');
    const container = document.getElementById('cvHistoryList');
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No CVs yet. Upload or create one!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-header">
                <div>
                    <div class="history-item-title">${item.name || 'Untitled'}</div>
                    <div class="history-item-date">${item.date}</div>
                </div>
            </div>
            <div class="history-item-actions">
                <button class="history-btn preview" onclick="previewCVFromHistory(${item.id})">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="history-btn download" onclick="downloadCVFromHistory(${item.id})">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="history-btn delete" onclick="deleteCVFromHistory(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function previewCVFromHistory(id) {
    const history = JSON.parse(localStorage.getItem(CV_HISTORY_KEY) || '[]');
    const item = history.find(h => h.id === id);
    if (item) {
        currentCVData = item;
        generateCVPreview(item);
        document.getElementById('cvPreviewSection').style.display = 'block';
        document.getElementById('cvPreviewSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function downloadCVFromHistory(id) {
    const history = JSON.parse(localStorage.getItem(CV_HISTORY_KEY) || '[]');
    const item = history.find(h => h.id === id);
    if (item) {
        currentCVData = item;
        generateCVPreview(item);
        setTimeout(() => downloadCurrentCV(), 100);
    }
}

function deleteCVFromHistory(id) {
    if (!confirm('Delete this CV?')) return;
    
    let history = JSON.parse(localStorage.getItem(CV_HISTORY_KEY) || '[]');
    history = history.filter(h => h.id !== id);
    localStorage.setItem(CV_HISTORY_KEY, JSON.stringify(history));
    loadCVHistory();
}

// Initialize with empty states
document.addEventListener('DOMContentLoaded', () => {
    loadResumeHistory();
    loadCVHistory();
});
