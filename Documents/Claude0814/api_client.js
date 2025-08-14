class APIClient {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.token = localStorage.getItem('auth_token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        if (config.body && typeof config.body !== 'string') {
            config.body = JSON.stringify(config.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication
    async register(userData) {
        const response = await this.request('/register', {
            method: 'POST',
            body: userData
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async login(credentials) {
        const response = await this.request('/login', {
            method: 'POST',
            body: credentials
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    logout() {
        this.setToken(null);
    }

    // Entries
    async getEntries() {
        return this.request('/entries');
    }

    async createEntry(entryData) {
        return this.request('/entries', {
            method: 'POST',
            body: entryData
        });
    }

    // Voting
    async voteForEntry(entryId) {
        return this.request(`/entries/${entryId}/vote`, {
            method: 'POST'
        });
    }

    async removeVote(entryId) {
        return this.request(`/entries/${entryId}/vote`, {
            method: 'DELETE'
        });
    }

    async getMyVotes() {
        return this.request('/my-votes');
    }

    // Statistics
    async getStats() {
        return this.request('/stats');
    }

    // Featured projects
    async getFeaturedProjects() {
        return this.request('/featured');
    }
}