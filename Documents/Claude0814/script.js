class AICompetitionApp {
    constructor() {
        this.currentUser = null;
        this.entries = [];
        this.votes = {};
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.loadSampleEntries();
        this.updateStats();
        this.populateInstructions();
        this.updateLanguageButtons();
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
        // 顶部导航认证按钮
        document.getElementById('loginBtn').addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('registerBtn').addEventListener('click', () => this.showAuthModal('register'));
        
        // 开始按钮
        document.getElementById('getStartedBtn').addEventListener('click', () => {
            if (this.currentUser) {
                this.showMainContent();
            } else {
                this.showAuthModal('register');
            }
        });

        // 模态框控制
        document.getElementById('modalClose').addEventListener('click', () => this.hideAuthModal());
        document.getElementById('authModal').addEventListener('click', (e) => {
            if (e.target.id === 'authModal') this.hideAuthModal();
        });

        // 模态框认证切换
        document.getElementById('modalLoginBtn').addEventListener('click', () => this.showLogin());
        document.getElementById('modalRegisterBtn').addEventListener('click', () => this.showRegister());

        // 认证表单
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // 导航标签
        const dashboardTab = document.getElementById('dashboardTab');
        if (dashboardTab) {
            dashboardTab.addEventListener('click', () => this.showDashboard());
            document.getElementById('submitTab').addEventListener('click', () => this.showSubmitSection());
            document.getElementById('instructionsTab').addEventListener('click', () => this.showInstructions());
        }
        
        // 登出
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // 提交表单
        const submitForm = document.getElementById('submitForm');
        if (submitForm) {
            submitForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
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

        // 简单验证
        if (email && password) {
            this.currentUser = {
                email: email,
                name: email.split('@')[0],
                id: Date.now()
            };
            this.saveData();
            this.showMainContent();
            this.showMessage('登录成功！', 'success');
        } else {
            this.showMessage('请填写所有字段', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            this.showMessage('请填写所有字段', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('密码不匹配', 'error');
            return;
        }

        this.currentUser = {
            email: email,
            name: name,
            id: Date.now()
        };
        this.saveData();
        this.showMainContent();
        this.showMessage('注册成功！欢迎参加挑战赛！', 'success');
    }

    showMainContent() {
        this.hideAuthModal();
        
        // 更新导航显示用户信息
        document.getElementById('authControls').classList.add('hidden');
        document.getElementById('userInfo').classList.remove('hidden');
        document.getElementById('userGreeting').textContent = `欢迎，${this.currentUser.name}！`;
        
        // 显示主内容
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
            this.showMessage('请填写所有字段', 'error');
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
        
        // 重置表单
        document.getElementById('submitForm').reset();
        
        this.showMessage('项目提交成功！', 'success');
        this.showDashboard();
    }

    renderEntries() {
        const entriesList = document.getElementById('entriesList');
        
        if (this.entries.length === 0) {
            entriesList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6b7280;">
                    <h3>还没有项目！</h3>
                    <p>成为第一个提交AI创新项目的人，激励其他人加入挑战！</p>
                </div>
            `;
            return;
        }

        entriesList.innerHTML = this.entries
            .sort((a, b) => b.votes - a.votes)
            .map(entry => this.renderEntryCard(entry))
            .join('');

        // 添加投票事件监听器
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleVote(e));
        });
    }

    renderEntryCard(entry) {
        const userVoted = this.votes[`${this.currentUser.id}_${entry.id}`] || false;
        const voteButtonClass = userVoted ? 'vote-btn voted' : 'vote-btn';
        const voteButtonText = userVoted ? '已投票' : '投票';

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
                    <a href="${this.escapeHtml(entry.link)}" target="_blank" class="entry-link">查看项目 →</a>
                    <div class="vote-section">
                        <button class="${voteButtonClass}" data-entry-id="${entry.id}">${voteButtonText}</button>
                        <span class="vote-count">${entry.votes} 票</span>
                    </div>
                </div>
            </div>
        `;
    }

    handleVote(e) {
        const entryId = parseInt(e.target.getAttribute('data-entry-id'));
        const voteKey = `${this.currentUser.id}_${entryId}`;
        
        if (this.votes[voteKey]) {
            this.showMessage('您已经为这个项目投票了！', 'error');
            return;
        }

        // 找到项目并增加票数
        const entry = this.entries.find(e => e.id === entryId);
        if (entry) {
            entry.votes++;
            this.votes[voteKey] = true;
            this.saveData();
            this.renderEntries();
            this.showMessage('投票成功！感谢您的参与！', 'success');
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('aicomp_user');
        
        // 更新导航显示认证控制
        document.getElementById('authControls').classList.remove('hidden');
        document.getElementById('userInfo').classList.add('hidden');
        
        // 隐藏主内容
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.add('hidden');
        }
        
        // 重置表单
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        
        this.showMessage('登出成功！', 'success');
    }

    showMessage(message, type) {
        // 移除现有消息
        document.querySelectorAll('.success-message, .error-message').forEach(msg => {
            msg.remove();
        });

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, container.firstChild);

        // 5秒后自动移除
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
                    title: "AI代码审查助手",
                    description: "使用机器学习算法自动审查代码中的错误、安全漏洞和性能问题的智能系统。",
                    link: "https://github.com/example/ai-code-reviewer",
                    category: "productivity",
                    author: "Alex Chen",
                    authorId: 1001,
                    votes: 12,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "智能医疗诊断工具",
                    description: "深度学习模型，帮助医生从医学图像中诊断疾病，准确率达95%，改善医疗结果。",
                    link: "https://github.com/example/medical-ai",
                    category: "healthcare",
                    author: "Dr. Sarah Johnson",
                    authorId: 1002,
                    votes: 18,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "EcoTrack - 环境影响监测器",
                    description: "使用卫星数据和物联网传感器跟踪和预测环境变化的AI系统，帮助应对气候变化。",
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

    // 更新首页统计
    updateStats() {
        const participantCount = this.getUniqueParticipants();
        const projectCount = this.entries.length;
        
        document.getElementById('participantCount').textContent = `${participantCount}+`;
        document.getElementById('projectCount').textContent = projectCount.toString();
    }

    getUniqueParticipants() {
        const uniqueAuthors = new Set(this.entries.map(entry => entry.authorId));
        return Math.max(uniqueAuthors.size + 145, 150); // 模拟现有参与者
    }

    // 填充说明内容
    populateInstructions() {
        this.updateInstructionsContent();
    }

    updateInstructionsContent() {
        const requirementsList = document.getElementById('requirementsList');
        const judgingList = document.getElementById('judgingList');
        const timelineList = document.getElementById('timelineList');

        if (requirementsList) {
            requirementsList.innerHTML = locales[currentLang].requirementsList.map(item => `<li>${item}</li>`).join('');
        }

        if (judgingList) {
            judgingList.innerHTML = locales[currentLang].judgingCriteria.map(item => `<li>${item}</li>`).join('');
        }

        if (timelineList) {
            timelineList.innerHTML = locales[currentLang].timelineList.map(item => `<li>${item}</li>`).join('');
        }
    }

    // 更新语言按钮状态
    updateLanguageButtons() {
        const langEn = document.getElementById('langEn');
        const langKo = document.getElementById('langKo');
        
        if (langEn && langKo) {
            langEn.classList.toggle('active', currentLang === 'en');
            langKo.classList.toggle('active', currentLang === 'ko');
        }
    }
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.aiApp = new AICompetitionApp();
});

// 全局语言切换函数
function switchLanguage(lang) {
    currentLang = lang;
    updatePageLanguage();
    localStorage.setItem('preferredLanguage', lang);
    
    // 更新应用实例
    if (window.aiApp) {
        window.aiApp.updateLanguageButtons();
        window.aiApp.updateInstructionsContent();
        window.aiApp.renderEntries();
    }
}