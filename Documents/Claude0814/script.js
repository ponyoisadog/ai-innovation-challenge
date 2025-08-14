class AICompetitionApp {
    constructor() {
        this.currentUser = null;
        this.entries = [];
        this.votes = {};
        this.currentSlide = 0;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.loadSampleEntries();
        this.initCarousel();
        this.updateStats();
    }

    loadData() {
        const userData = localStorage.getItem('aicomp_user');
        const entriesData = localStorage.getItem('aicomp_entries');
        const votesData = localStorage.getItem('aicomp_votes');

        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.showMainContent();
        }

        if (entriesData) {
            this.entries = JSON.parse(entriesData);
        }

        if (votesData) {
            this.votes = JSON.parse(votesData);
        }
    }

    saveData() {
        localStorage.setItem('aicomp_entries', JSON.stringify(this.entries));
        localStorage.setItem('aicomp_votes', JSON.stringify(this.votes));
        if (this.currentUser) {
            localStorage.setItem('aicomp_user', JSON.stringify(this.currentUser));
        }
    }

    setupEventListeners() {
        // Top nav auth buttons
        document.getElementById('loginBtn').addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('registerBtn').addEventListener('click', () => this.showAuthModal('register'));
        
        // Get started button
        document.getElementById('getStartedBtn').addEventListener('click', () => {
            if (this.currentUser) {
                this.showMainContent();
            } else {
                this.showAuthModal('register');
            }
        });

        // Modal controls
        document.getElementById('modalClose').addEventListener('click', () => this.hideAuthModal());
        document.getElementById('authModal').addEventListener('click', (e) => {
            if (e.target.id === 'authModal') this.hideAuthModal();
        });

        // Modal auth toggle
        document.getElementById('modalLoginBtn').addEventListener('click', () => this.showLogin());
        document.getElementById('modalRegisterBtn').addEventListener('click', () => this.showRegister());

        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Navigation (if exists)
        const dashboardTab = document.getElementById('dashboardTab');
        if (dashboardTab) {
            dashboardTab.addEventListener('click', () => this.showDashboard());
            document.getElementById('submitTab').addEventListener('click', () => this.showSubmitSection());
            document.getElementById('instructionsTab').addEventListener('click', () => this.showInstructions());
        }
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // Submit form (if exists)
        const submitForm = document.getElementById('submitForm');
        if (submitForm) {
            submitForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Carousel controls
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());
    }

    showAuthModal(type = 'login') {
        document.getElementById('authModal').classList.remove('hidden');
        if (type === 'login') {
            this.showLogin();
        } else {
            this.showRegister();
        }
    }

    hideAuthModal() {
        document.getElementById('authModal').classList.add('hidden');
    }

    showLogin() {
        document.getElementById('modalLoginBtn').classList.add('active');
        document.getElementById('modalRegisterBtn').classList.remove('active');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
    }

    showRegister() {
        document.getElementById('modalRegisterBtn').classList.add('active');
        document.getElementById('modalLoginBtn').classList.remove('active');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simple validation for demo
        if (email && password) {
            this.currentUser = {
                email: email,
                name: email.split('@')[0],
                id: Date.now()
            };
            this.saveData();
            this.showMainContent();
            this.showMessage('Login successful!', 'success');
        } else {
            this.showMessage('Please fill in all fields', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        this.currentUser = {
            email: email,
            name: name,
            id: Date.now()
        };
        this.saveData();
        this.showMainContent();
        this.showMessage('Registration successful! Welcome to the competition!', 'success');
    }

    showMainContent() {
        this.hideAuthModal();
        
        // Update nav to show user info
        document.getElementById('authControls').classList.add('hidden');
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('userGreeting').textContent = `Welcome, ${this.currentUser.name}!`;
        
        // Show main content if it exists
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.remove('hidden');
            this.showDashboard();
        }
    }

    showDashboard() {
        this.setActiveTab('dashboardTab');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('submitSection').classList.add('hidden');
        document.getElementById('instructionsSection').classList.add('hidden');
        this.renderEntries();
    }

    showSubmitSection() {
        this.setActiveTab('submitTab');
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('submitSection').classList.remove('hidden');
        document.getElementById('instructionsSection').classList.add('hidden');
    }

    showInstructions() {
        this.setActiveTab('instructionsTab');
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('submitSection').classList.add('hidden');
        document.getElementById('instructionsSection').classList.remove('hidden');
    }

    setActiveTab(activeTabId) {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(activeTabId).classList.add('active');
    }

    handleSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('projectTitle').value;
        const description = document.getElementById('projectDescription').value;
        const link = document.getElementById('projectLink').value;
        const category = document.getElementById('category').value;

        if (!title || !description || !link || !category) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const newEntry = {
            id: Date.now(),
            title: title,
            description: description,
            link: link,
            category: category,
            author: this.currentUser.name,
            authorId: this.currentUser.id,
            votes: 0,
            createdAt: new Date().toISOString()
        };

        this.entries.push(newEntry);
        this.saveData();
        
        // Reset form
        document.getElementById('submitForm').reset();
        
        this.showMessage('Your entry has been submitted successfully!', 'success');
        this.showDashboard();
    }

    renderEntries() {
        const entriesList = document.getElementById('entriesList');
        
        if (this.entries.length === 0) {
            entriesList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <h3>No entries yet!</h3>
                    <p>Be the first to submit your AI innovation and inspire others to join the challenge!</p>
                </div>
            `;
            return;
        }

        entriesList.innerHTML = this.entries
            .sort((a, b) => b.votes - a.votes)
            .map(entry => this.renderEntryCard(entry))
            .join('');

        // Add vote event listeners
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleVote(e));
        });
    }

    renderEntryCard(entry) {
        const userVoted = this.votes[`${this.currentUser.id}_${entry.id}`] || false;
        const voteButtonClass = userVoted ? 'vote-btn voted' : 'vote-btn';
        const voteButtonText = userVoted ? 'Voted!' : 'Vote';

        return `
            <div class="entry-card">
                <div class="entry-header">
                    <div>
                        <div class="entry-title">${this.escapeHtml(entry.title)}</div>
                        <div class="entry-author">by ${this.escapeHtml(entry.author)}</div>
                    </div>
                    <div class="entry-category">${this.escapeHtml(entry.category)}</div>
                </div>
                <div class="entry-description">${this.escapeHtml(entry.description)}</div>
                <div class="entry-footer">
                    <a href="${this.escapeHtml(entry.link)}" target="_blank" class="entry-link">View Project →</a>
                    <div class="vote-section">
                        <button class="${voteButtonClass}" data-entry-id="${entry.id}">${voteButtonText}</button>
                        <span class="vote-count">${entry.votes} votes</span>
                    </div>
                </div>
            </div>
        `;
    }

    handleVote(e) {
        const entryId = parseInt(e.target.getAttribute('data-entry-id'));
        const voteKey = `${this.currentUser.id}_${entryId}`;
        
        if (this.votes[voteKey]) {
            this.showMessage('You have already voted for this entry!', 'error');
            return;
        }

        // Find the entry and increment votes
        const entry = this.entries.find(e => e.id === entryId);
        if (entry) {
            entry.votes++;
            this.votes[voteKey] = true;
            this.saveData();
            this.renderEntries();
            this.showMessage('Vote recorded! Thank you for participating!', 'success');
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('aicomp_user');
        
        // Update nav to show auth controls
        document.getElementById('authControls').classList.remove('hidden');
        document.getElementById('userInfo').classList.add('hidden');
        
        // Hide main content if it exists
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.add('hidden');
        }
        
        // Reset forms
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        
        this.showMessage('Logged out successfully!', 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        document.querySelectorAll('.success-message, .error-message').forEach(msg => {
            msg.remove();
        });

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadSampleEntries() {
        if (this.entries.length === 0) {
            this.entries = [
                {
                    id: 1,
                    title: "AI-Powered Code Review Assistant",
                    description: "An intelligent system that automatically reviews code for bugs, security vulnerabilities, and performance issues using machine learning algorithms.",
                    link: "https://github.com/example/ai-code-reviewer",
                    category: "productivity",
                    author: "Alex Chen",
                    authorId: 1001,
                    votes: 12,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "Smart Medical Diagnosis Tool",
                    description: "A deep learning model that assists doctors in diagnosing diseases from medical images with 95% accuracy, helping improve healthcare outcomes.",
                    link: "https://github.com/example/medical-ai",
                    category: "healthcare",
                    author: "Dr. Sarah Johnson",
                    authorId: 1002,
                    votes: 18,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "EcoTrack - Environmental Impact Monitor",
                    description: "An AI system that tracks and predicts environmental changes using satellite data and IoT sensors to help combat climate change.",
                    link: "https://github.com/example/ecotrack",
                    category: "environment",
                    author: "Green Team",
                    authorId: 1003,
                    votes: 9,
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveData();
        }
    }
}

    // Carousel functionality
    initCarousel() {
        this.createCarouselDots();
        setInterval(() => this.nextSlide(), 5000); // Auto-advance every 5 seconds
    }

    createCarouselDots() {
        const dotsContainer = document.getElementById('carouselDots');
        const slides = document.querySelectorAll('.carousel-slide');
        
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('div');
            dot.className = i === 0 ? 'carousel-dot active' : 'carousel-dot';
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    updateCarouselDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        this.updateCarousel();
    }

    previousSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        this.currentSlide = this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const carousel = document.getElementById('projectCarousel');
        const translateX = -this.currentSlide * 100;
        carousel.style.transform = `translateX(${translateX}%)`;
        this.updateCarouselDots();
    }

    // Update stats on homepage
    updateStats() {
        const participantCount = this.getUniqueParticipants();
        const projectCount = this.entries.length;
        
        document.getElementById('participantCount').textContent = `${participantCount}+`;
        document.getElementById('projectCount').textContent = projectCount.toString();
    }

    getUniqueParticipants() {
        const uniqueAuthors = new Set(this.entries.map(entry => entry.authorId));
        return Math.max(uniqueAuthors.size + 145, 150); // Simulate existing participants
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AICompetitionApp();
});