// ============================================
// Tab Management
// ============================================
class TabManager {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabPanels = document.querySelectorAll('.tab-panel');
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });

        // Keyboard navigation
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('keydown', (e) => this.handleKeyboard(e, index));
        });
    }

    switchTab(event) {
        const clickedTab = event.currentTarget;
        const targetTab = clickedTab.dataset.tab;

        // Update button states
        this.tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        clickedTab.classList.add('active');
        clickedTab.setAttribute('aria-selected', 'true');

        // Update panel visibility
        this.tabPanels.forEach(panel => {
            panel.style.display = 'none';
        });

        const activePanel = document.getElementById(`${targetTab}-panel`);
        if (activePanel) {
            activePanel.style.display = 'block';
            // Trigger animation
            activePanel.style.animation = 'none';
            setTimeout(() => {
                activePanel.style.animation = '';
            }, 10);
        }
    }

    handleKeyboard(event, currentIndex) {
        let newIndex;

        switch (event.key) {
            case 'ArrowLeft':
                newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = this.tabButtons.length - 1;
                break;
            case 'ArrowRight':
                newIndex = currentIndex + 1;
                if (newIndex >= this.tabButtons.length) newIndex = 0;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = this.tabButtons.length - 1;
                break;
            default:
                return;
        }

        event.preventDefault();
        this.tabButtons[newIndex].focus();
        this.tabButtons[newIndex].click();
    }
}

// ============================================
// Accessibility Scanner
// ============================================
class AccessibilityScanner {
    constructor() {
        this.runScanBtn = document.getElementById('run-scan');
        this.loadingState = document.getElementById('loading-state');
        this.scanResults = document.getElementById('scan-results');
        this.issuesList = document.getElementById('issues-list');
        this.exportBtn = document.getElementById('export-report');
        
        this.init();
    }

    init() {
        if (this.runScanBtn) {
            this.runScanBtn.addEventListener('click', () => this.runScan());
        }

        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportReport());
        }
    }

    async runScan() {
        // Get selected options
        const checkPages = document.getElementById('check-pages').checked;
        const checkAssignments = document.getElementById('check-assignments').checked;
        const checkAnnouncements = document.getElementById('check-announcements').checked;
        const checkModules = document.getElementById('check-modules').checked;

        // Show loading state
        this.scanResults.style.display = 'none';
        this.loadingState.style.display = 'block';

        try {
            // Simulate API call - replace with actual backend call
            const results = await this.performScan({
                pages: checkPages,
                assignments: checkAssignments,
                announcements: checkAnnouncements,
                modules: checkModules
            });

            // Display results
            setTimeout(() => {
                this.displayResults(results);
            }, 2000);

        } catch (error) {
            console.error('Scan failed:', error);
            this.showError('Scan failed. Please try again.');
        }
    }

    async performScan(options) {
        // This would be replaced with actual API call to Python backend
        // For now, return mock data
        
        // Example: const response = await fetch('/api/scan', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(options)
        // });
        // return await response.json();

        return {
            passed: 127,
            warnings: 8,
            errors: 3,
            issues: [
                {
                    type: 'error',
                    title: 'Missing Alt Text on Images',
                    description: 'Images must have alternative text for screen readers.',
                    location: 'Page: "Course Introduction" - 2 instances',
                    wcagLevel: 'A',
                    wcagCriteria: '1.1.1'
                },
                {
                    type: 'error',
                    title: 'Insufficient Color Contrast',
                    description: 'Text color contrast ratio is 3.2:1, must be at least 4.5:1.',
                    location: 'Assignment: "Week 1 Quiz"',
                    wcagLevel: 'AA',
                    wcagCriteria: '1.4.3'
                },
                {
                    type: 'error',
                    title: 'Empty Link Text',
                    description: 'Links must have descriptive text or aria-label.',
                    location: 'Page: "Resources"',
                    wcagLevel: 'A',
                    wcagCriteria: '2.4.4'
                },
                {
                    type: 'warning',
                    title: 'Heading Structure Not Sequential',
                    description: 'Heading levels should not skip (e.g., h1 to h3).',
                    location: 'Page: "Module 2 Overview"',
                    wcagLevel: 'AAA',
                    wcagCriteria: '2.4.6'
                },
                {
                    type: 'warning',
                    title: 'Missing Form Labels',
                    description: 'Form inputs should have associated labels.',
                    location: 'Assignment: "Self-Assessment"',
                    wcagLevel: 'A',
                    wcagCriteria: '3.3.2'
                },
                {
                    type: 'warning',
                    title: 'Table Missing Headers',
                    description: 'Data tables should have properly marked header cells.',
                    location: 'Page: "Study Schedule"',
                    wcagLevel: 'A',
                    wcagCriteria: '1.3.1'
                },
                {
                    type: 'warning',
                    title: 'PDF Document Not Tagged',
                    description: 'PDF documents should be properly tagged for accessibility.',
                    location: 'File: "Course Syllabus.pdf"',
                    wcagLevel: 'AA',
                    wcagCriteria: '4.1.2'
                },
                {
                    type: 'warning',
                    title: 'Video Missing Captions',
                    description: 'Video content must include synchronized captions.',
                    location: 'Page: "Lecture 3: Financial Analysis"',
                    wcagLevel: 'A',
                    wcagCriteria: '1.2.2'
                }
            ],
            timestamp: new Date().toISOString()
        };
    }

    displayResults(results) {
        // Hide loading, show results
        this.loadingState.style.display = 'none';
        this.scanResults.style.display = 'block';

        // Update statistics
        document.getElementById('passed-count').textContent = results.passed;
        document.getElementById('warning-count').textContent = results.warnings;
        document.getElementById('error-count').textContent = results.errors;

        // Update scan date
        const date = new Date(results.timestamp);
        document.getElementById('scan-date').textContent = 
            `Scanned on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

        // Display issues
        this.issuesList.innerHTML = '';
        
        if (results.issues.length === 0) {
            this.issuesList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--color-success);">
                    <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.1rem; font-weight: 600;">No issues found!</p>
                    <p style="color: var(--color-text-secondary);">Your course content meets accessibility standards.</p>
                </div>
            `;
        } else {
            results.issues.forEach((issue, index) => {
                const issueElement = this.createIssueElement(issue, index);
                this.issuesList.appendChild(issueElement);
            });
        }
    }

    createIssueElement(issue, index) {
        const div = document.createElement('div');
        div.className = `issue-item ${issue.type}`;
        div.style.animationDelay = `${index * 0.05}s`;
        
        div.innerHTML = `
            <div class="issue-header">
                <div class="issue-title">${issue.title}</div>
                <span class="issue-badge ${issue.type}">${issue.type}</span>
            </div>
            <div class="issue-description">${issue.description}</div>
            <div class="issue-location">
                <i class="fas fa-map-marker-alt"></i> ${issue.location}
                ${issue.wcagCriteria ? `<span style="margin-left: 1rem;">WCAG ${issue.wcagLevel} - ${issue.wcagCriteria}</span>` : ''}
            </div>
        `;

        return div;
    }

    showError(message) {
        this.loadingState.style.display = 'none';
        this.issuesList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--color-error);">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.1rem; font-weight: 600;">${message}</p>
            </div>
        `;
        this.scanResults.style.display = 'block';
    }

    exportReport() {
        // This would integrate with backend to generate report
        // For now, show a notification
        alert('Report export functionality will be implemented in the Python backend.');
        
        // Example implementation:
        // const reportFormat = document.getElementById('report-format').value;
        // window.location.href = `/api/export-report?format=${reportFormat}`;
    }
}

// ============================================
// Settings Manager
// ============================================
class SettingsManager {
    constructor() {
        this.form = document.getElementById('settings-form');
        this.resetBtn = document.getElementById('reset-settings');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.saveSettings(e));
        }

        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetSettings());
        }

        // Load saved settings
        this.loadSettings();
    }

    async saveSettings(event) {
        event.preventDefault();

        const settings = {
            scanDepth: document.getElementById('scan-depth').value,
            wcagLevel: document.getElementById('wcag-level').value,
            emailNotifications: document.getElementById('email-notifications').checked,
            autoScan: document.getElementById('auto-scan').checked,
            reportFormat: document.getElementById('report-format').value,
            includeScreenshots: document.getElementById('include-screenshots').checked
        };

        try {
            // This would be an API call to save settings
            // await fetch('/api/settings', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(settings)
            // });

            // Save to localStorage for demo
            localStorage.setItem('canvasToolSettings', JSON.stringify(settings));

            // Show success feedback
            this.showNotification('Settings saved successfully!', 'success');

        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('Failed to save settings.', 'error');
        }
    }

    loadSettings() {
        // Load from localStorage for demo
        const savedSettings = localStorage.getItem('canvasToolSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            document.getElementById('scan-depth').value = settings.scanDepth || 'standard';
            document.getElementById('wcag-level').value = settings.wcagLevel || 'AA';
            document.getElementById('email-notifications').checked = settings.emailNotifications || false;
            document.getElementById('auto-scan').checked = settings.autoScan || false;
            document.getElementById('report-format').value = settings.reportFormat || 'pdf';
            document.getElementById('include-screenshots').checked = settings.includeScreenshots || false;
        }
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            localStorage.removeItem('canvasToolSettings');
            
            // Reset form to defaults
            document.getElementById('scan-depth').value = 'standard';
            document.getElementById('wcag-level').value = 'AA';
            document.getElementById('email-notifications').checked = false;
            document.getElementById('auto-scan').checked = false;
            document.getElementById('report-format').value = 'pdf';
            document.getElementById('include-screenshots').checked = false;

            this.showNotification('Settings reset to defaults.', 'success');
        }
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
            color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span style="margin-left: 0.5rem;">${message}</span>
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============================================
// Animation Helpers
// ============================================
const addSlideAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
};

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new TabManager();
    new AccessibilityScanner();
    new SettingsManager();
    addSlideAnimations();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    console.log('Canvas Accessibility Tool initialized successfully!');
});

// ============================================
// API Integration Helper (for Python backend)
// ============================================
class CanvasAPI {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Scan endpoints
    async runAccessibilityScan(courseId, options) {
        return this.request('/scan', {
            method: 'POST',
            body: JSON.stringify({ courseId, ...options })
        });
    }

    async getScanResults(scanId) {
        return this.request(`/scan/${scanId}`);
    }

    async exportReport(scanId, format) {
        return this.request(`/export/${scanId}`, {
            method: 'POST',
            body: JSON.stringify({ format })
        });
    }

    // Settings endpoints
    async saveSettings(settings) {
        return this.request('/settings', {
            method: 'POST',
            body: JSON.stringify(settings)
        });
    }

    async getSettings() {
        return this.request('/settings');
    }

    // Course data endpoints
    async getCourseInfo(courseId) {
        return this.request(`/course/${courseId}`);
    }

    async getPageContent(courseId, pageId) {
        return this.request(`/course/${courseId}/page/${pageId}`);
    }

    async getAssignments(courseId) {
        return this.request(`/course/${courseId}/assignments`);
    }
}

// Export for use in other modules if needed
window.CanvasAPI = CanvasAPI;