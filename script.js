// Theme Toggle Functionality
function initTheme() {
    // Check for saved theme preference or use the system preference
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    // Get the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Toggle the theme
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply the new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save the preference
    localStorage.setItem('theme', newTheme);
}

// Generate and download PDF resume
async function generatePDF() {
    // Display loading state on the button
    const downloadBtn = document.getElementById('resume-download-btn');
    if (downloadBtn) {
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        downloadBtn.disabled = true;
    }
    
    try {
        // Fetch the PDF template from the separate file
        const response = await fetch('resume-pdf-template.html');
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // Create a temporary container directly with the HTML content
        const tempContainer = document.createElement('div');
        tempContainer.id = 'temp-pdf-container';
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '0';
        tempContainer.style.left = '0';
        tempContainer.style.opacity = '0';
        tempContainer.style.pointerEvents = 'none';
        tempContainer.style.zIndex = '-1000';
        
        // Extract only the PDF content part from the HTML
        const contentMatch = html.match(/<div id="resume-pdf-content">([\s\S]*?)<\/div>\s*<\/body>/i);
        if (contentMatch && contentMatch[1]) {
            tempContainer.innerHTML = contentMatch[0];
        } else {
            throw new Error('Could not extract PDF content from template');
        }
        
        document.body.appendChild(tempContainer);
        
        // Ensure images are loaded before generating PDF
        const images = tempContainer.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
            return new Promise((resolve, reject) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = reject;
                }
            });
        })).catch(e => console.warn('Some images failed to load', e));
        
        // Get the actual PDF content element from the container
        const pdfContent = tempContainer.querySelector('#resume-pdf-content');
        if (!pdfContent) {
            throw new Error('PDF content element not found in template');
        }
        
        // Set options for html2pdf
        const opt = {
            margin: 0,
            filename: 'rdvnit_cv.pdf',
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                letterRendering: true,
                logging: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            }
        };
        
        // Generate the PDF
        await html2pdf().from(pdfContent).set(opt).save();
            
        // Clean up
        document.body.removeChild(tempContainer);
        
        // Reset button
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-file-download"></i> Download Resume';
            downloadBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        
        // Clean up any temp elements
        const tempContainer = document.getElementById('temp-pdf-container');
        if (tempContainer) {
            document.body.removeChild(tempContainer);
        }
        
        // Reset button on error
        if (downloadBtn) {
            downloadBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error! Try Again';
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-file-download"></i> Download Resume';
                downloadBtn.disabled = false;
            }, 3000);
        }
    }
}

// Secret resume download functionality
function checkForSecretDownload() {
    // Check if the URL contains the secret parameter (#getresume)
    if (window.location.hash === '#getresume') {
        // Check if button already exists
        if (document.getElementById('resume-download-btn')) {
            return;
        }
        
        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'resume-download-btn';
        downloadBtn.className = 'resume-download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-file-download"></i> Download Resume';
        
        // Add click event to generate and download PDF
        downloadBtn.addEventListener('click', generatePDF);
        
        // Add to the page
        document.body.appendChild(downloadBtn);
        
        // Add animation to make it appear
        setTimeout(() => {
            downloadBtn.classList.add('show');
        }, 500);
        
        // Pre-fetch the resume template in the background
        fetch('resume-pdf-template.html').catch(err => {
            console.warn('Failed to prefetch resume template:', err);
        });
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add click event to theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Animate skill bars when they come into view
    animateSkillBars();
    
    // Check for secret download parameter
    checkForSecretDownload();
    
    // Also check when hash changes
    window.addEventListener('hashchange', checkForSecretDownload);
});

// Function to animate skill bars when they come into view
function animateSkillBars() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    // Create observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe each skill level
    skillLevels.forEach(skill => {
        observer.observe(skill);
    });
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add CSS for animations
document.head.insertAdjacentHTML('beforeend', `
<style>
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .cert-item {
        animation: fade-in-up 0.6s ease forwards;
        opacity: 0;
    }
    
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
`); 