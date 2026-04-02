// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Navigation functionality
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
        }
    });
});

// ==================== RESUME FUNCTIONALITY ====================

// File Upload Handler for Resume
document.getElementById('resumeUpload').addEventListener('change', function(e) {
    handleFileUpload(e, 'resume');
});

// File Upload Handler for CV
document.getElementById('cvUpload').addEventListener('change', function(e) {
    handleFileUpload(e, 'cv');
});

async function handleFileUpload(event, type) {
    const file = event.target.files[0];
    const statusDiv = document.getElementById(`${type}UploadStatus`);
    
    if (!file) return;
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showUploadStatus(statusDiv, 'File size must be less than 10MB', 'error');
        return;
    }
    
    showUploadStatus(statusDiv, 'Processing file...', 'success');
    
    try {
        if (file.type === 'application/pdf') {
            await parsePDF(file, type);
        } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
            await parseDOCX(file, type);
        } else {
            showUploadStatus(statusDiv, 'Please upload a PDF or DOCX file', 'error');
        }
    } catch (error) {
        console.error('Error parsing file:', error);
        showUploadStatus(statusDiv, 'Error processing file. Please fill the form manually.', 'error');
    }
}

function showUploadStatus(element, message, type) {
    element.textContent = message;
    element.className = `upload-status ${type}`;
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

async function parsePDF(file, type) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    
    extractInfoFromText(text, type);
    showUploadStatus(document.getElementById(`${type}UploadStatus`), 'File parsed successfully! Please review and edit the information.', 'success');
}

async function parseDOCX(file, type) {
    // Simple text extraction for DOCX (basic implementation)
    const text = await file.text();
    extractInfoFromText(text, type);
    showUploadStatus(document.getElementById(`${type}UploadStatus`), 'File parsed! Please review the information.', 'success');
}

function extractInfoFromText(text, type) {
    // Simple regex-based extraction
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/gi;
    const phoneRegex = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/gim;
    
    const emails = text.match(emailRegex);
    const phones = text.match(phoneRegex);
    
    if (type === 'resume') {
        if (emails) document.getElementById('resEmail').value = emails[0];
        if (phones) document.getElementById('resPhone').value = phones[0];
        
        // Try to extract name (first line usually)
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
            document.getElementById('resName').value = lines[0].trim();
        }
    } else if (type === 'cv') {
        if (emails) document.getElementById('cvEmail').value = emails[0];
        if (phones) document.getElementById('cvPhone').value = phones[0];
        
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
            document.getElementById('cvName').value = lines[0].trim();
        }
    }
}

// Add Work Experience Field
function addWorkExperience() {
    const container = document.getElementById('workExperienceContainer');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <input type="text" class="job-title" placeholder="Job Title">
        <input type="text" class="company" placeholder="Company Name">
        <div class="date-row">
            <input type="text" class="date-start" placeholder="Start Date (e.g., Jan 2020)">
            <input type="text" class="date-end" placeholder="End Date (e.g., Present)">
        </div>
        <textarea class="job-desc" rows="2" placeholder="Job responsibilities and achievements..."></textarea>
    `;
    container.appendChild(newItem);
}

// Add Education Field
function addEducation() {
    const container = document.getElementById('educationContainer');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <input type="text" class="degree" placeholder="Degree">
        <input type="text" class="school" placeholder="School/University">
        <input type="text" class="edu-date" placeholder="Graduation Year">
    `;
    container.appendChild(newItem);
}

// Generate ATS Resume
function generateATSResume() {
    // Get all form values
    const name = document.getElementById('resName').value || 'Your Name';
    const email = document.getElementById('resEmail').value || 'email@example.com';
    const phone = document.getElementById('resPhone').value || '';
    const location = document.getElementById('resLocation').value || '';
    const summary = document.getElementById('resSummary').value || '';
    const skills = document.getElementById('resSkills').value || '';
    const certifications = document.getElementById('resCertifications').value || '';
    
    // Update ATS template
    document.getElementById('atsName').textContent = name;
    document.getElementById('atsEmail').textContent = email;
    document.getElementById('atsPhone').textContent = phone;
    document.getElementById('atsLocation').textContent = location;
    document.getElementById('atsSummary').textContent = summary;
    document.getElementById('atsSkills').textContent = skills;
    
    if (certifications) {
        document.getElementById('atsCertifications').textContent = certifications;
        document.getElementById('atsCertificationsSection').style.display = 'block';
    } else {
        document.getElementById('atsCertificationsSection').style.display = 'none';
    }
    
    // Process work experience
    const workExpContainer = document.getElementById('atsWorkExperience');
    workExpContainer.innerHTML = '';
    const expItems = document.querySelectorAll('#workExperienceContainer .experience-item');
    
    expItems.forEach(item => {
        const title = item.querySelector('.job-title').value;
        const company = item.querySelector('.company').value;
        const startDate = item.querySelector('.date-start').value;
        const endDate = item.querySelector('.date-end').value;
        const desc = item.querySelector('.job-desc').value;
        
        if (title || company) {
            const jobDiv = document.createElement('div');
            jobDiv.className = 'ats-job';
            jobDiv.innerHTML = `
                <div class="ats-job-header">
                    <div>
                        <div class="ats-job-title">${title}</div>
                        <div class="ats-job-company">${company}</div>
                    </div>
                    <div class="ats-job-date">${startDate} - ${endDate}</div>
                </div>
                <ul class="ats-job-desc">
                    ${desc.split('\n').filter(line => line.trim()).map(line => `<li>${line}</li>`).join('')}
                </ul>
            `;
            workExpContainer.appendChild(jobDiv);
        }
    });
    
    // Process education
    const eduContainer = document.getElementById('atsEducation');
    eduContainer.innerHTML = '';
    const eduItems = document.querySelectorAll('#educationContainer .education-item');
    
    eduItems.forEach(item => {
        const degree = item.querySelector('.degree').value;
        const school = item.querySelector('.school').value;
        const date = item.querySelector('.edu-date').value;
        
        if (degree || school) {
            const eduDiv = document.createElement('div');
            eduDiv.className = 'ats-education';
            eduDiv.innerHTML = `
                <div class="ats-edu-header">
                    <div class="ats-degree">${degree}</div>
                    <div class="ats-edu-date">${date}</div>
                </div>
                <div class="ats-school">${school}</div>
            `;
            eduContainer.appendChild(eduDiv);
        }
    });
    
    // Show download button
    document.getElementById('downloadResumeBtn').style.display = 'inline-block';
    
    // Scroll to template
    document.getElementById('atsResumeTemplate').style.display = 'block';
    document.getElementById('atsResumeTemplate').scrollIntoView({ behavior: 'smooth' });
}

// Download ATS Resume as PDF
function downloadATSResume() {
    const element = document.getElementById('atsResumeTemplate');
    const name = document.getElementById('resName').value || 'Resume';
    
    const opt = {
        margin: 0.5,
        filename: `${name.replace(/\s+/g, '_')}_ATS_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Temporarily show the element for rendering
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    
    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none';
        element.style.position = 'static';
        element.style.left = 'auto';
    });
}

// ==================== CV FUNCTIONALITY ====================

// Add CV Experience Field
function addCVExperience() {
    const container = document.getElementById('cvExperienceContainer');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.innerHTML = `
        <input type="text" class="cv-job-title" placeholder="Position">
        <input type="text" class="cv-company" placeholder="Organization">
        <div class="date-row">
            <input type="text" class="cv-date-start" placeholder="Start Date">
            <input type="text" class="cv-date-end" placeholder="End Date">
        </div>
        <textarea class="cv-job-desc" rows="2" placeholder="Detailed responsibilities and achievements..."></textarea>
    `;
    container.appendChild(newItem);
}

// Add CV Education Field
function addCVEducation() {
    const container = document.getElementById('cvEducationContainer');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.innerHTML = `
        <input type="text" class="cv-degree" placeholder="Degree">
        <input type="text" class="cv-school" placeholder="Institution">
        <input type="text" class="cv-edu-date" placeholder="Year">
        <textarea class="cv-edu-details" rows="1" placeholder="Thesis, honors, etc. (optional)"></textarea>
    `;
    container.appendChild(newItem);
}

// Generate ATS CV
function generateATSCV() {
    const name = document.getElementById('cvName').value || 'Your Name';
    const email = document.getElementById('cvEmail').value || 'email@example.com';
    const phone = document.getElementById('cvPhone').value || '';
    const location = document.getElementById('cvLocation').value || '';
    const title = document.getElementById('cvTitle').value || '';
    const skills = document.getElementById('cvSkills').value || '';
    const publications = document.getElementById('cvPublications').value || '';
    const languages = document.getElementById('cvLanguages').value || '';
    const references = document.getElementById('cvReferences').value || '';
    
    // Update CV template
    document.getElementById('atsCVName').textContent = name;
    document.getElementById('atsCVTitle').textContent = title;
    document.getElementById('atsCVEmail').textContent = email;
    document.getElementById('atsCVPhone').textContent = phone;
    document.getElementById('atsCVLocation').textContent = location;
    document.getElementById('atsCVSkills').textContent = skills;
    
    // Publications
    if (publications) {
        document.getElementById('atsPublications').textContent = publications;
        document.getElementById('atsPublicationsSection').style.display = 'block';
    } else {
        document.getElementById('atsPublicationsSection').style.display = 'none';
    }
    
    // Languages
    if (languages) {
        document.getElementById('atsCVLanguages').textContent = languages;
        document.getElementById('atsLanguagesSection').style.display = 'block';
    } else {
        document.getElementById('atsLanguagesSection').style.display = 'none';
    }
    
    // References
    if (references) {
        document.getElementById('atsCVReferences').textContent = references;
        document.getElementById('atsReferencesSection').style.display = 'block';
    } else {
        document.getElementById('atsReferencesSection').style.display = 'none';
    }
    
    // Process CV experience
    const cvExpContainer = document.getElementById('atsCVExperience');
    cvExpContainer.innerHTML = '';
    const cvExpItems = document.querySelectorAll('#cvExperienceContainer .experience-item');
    
    cvExpItems.forEach(item => {
        const title = item.querySelector('.cv-job-title').value;
        const company = item.querySelector('.cv-company').value;
        const startDate = item.querySelector('.cv-date-start').value;
        const endDate = item.querySelector('.cv-date-end').value;
        const desc = item.querySelector('.cv-job-desc').value;
        
        if (title || company) {
            const jobDiv = document.createElement('div');
            jobDiv.className = 'ats-job';
            jobDiv.innerHTML = `
                <div class="ats-job-header">
                    <div>
                        <div class="ats-job-title">${title}</div>
                        <div class="ats-job-company">${company}</div>
                    </div>
                    <div class="ats-job-date">${startDate} - ${endDate}</div>
                </div>
                <ul class="ats-job-desc">
                    ${desc.split('\n').filter(line => line.trim()).map(line => `<li>${line}</li>`).join('')}
                </ul>
            `;
            cvExpContainer.appendChild(jobDiv);
        }
    });
    
    // Process CV education
    const cvEduContainer = document.getElementById('atsCVEducation');
    cvEduContainer.innerHTML = '';
    const cvEduItems = document.querySelectorAll('#cvEducationContainer .education-item');
    
    cvEduItems.forEach(item => {
        const degree = item.querySelector('.cv-degree').value;
        const school = item.querySelector('.cv-school').value;
        const date = item.querySelector('.cv-edu-date').value;
        const details = item.querySelector('.cv-edu-details').value;
        
        if (degree || school) {
            const eduDiv = document.createElement('div');
            eduDiv.className = 'ats-education';
            eduDiv.innerHTML = `
                <div class="ats-edu-header">
                    <div class="ats-degree">${degree}</div>
                    <div class="ats-edu-date">${date}</div>
                </div>
                <div class="ats-school">${school}</div>
                ${details ? `<div style="font-size:12px;margin-top:3px;">${details}</div>` : ''}
            `;
            cvEduContainer.appendChild(eduDiv);
        }
    });
    
    // Show download button
    document.getElementById('downloadCVBtn').style.display = 'inline-block';
    
    // Show and scroll to template
    document.getElementById('atsCVTemplate').style.display = 'block';
    document.getElementById('atsCVTemplate').scrollIntoView({ behavior: 'smooth' });
}

// Download ATS CV as PDF
function downloadATSCV() {
    const element = document.getElementById('atsCVTemplate');
    const name = document.getElementById('cvName').value || 'CV';
    
    const opt = {
        margin: 0.5,
        filename: `${name.replace(/\s+/g, '_')}_ATS_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    
    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none';
        element.style.position = 'static';
        element.style.left = 'auto';
    });
}
