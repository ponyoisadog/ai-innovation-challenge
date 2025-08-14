class WorldMap {
    constructor() {
        this.points = [];
        this.connections = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.createMapContainer();
        this.generatePoints();
        this.generateConnections();
        this.startAnimation();
    }

    createMapContainer() {
        const mapContainer = document.createElement('div');
        mapContainer.className = 'world-map-container';
        mapContainer.innerHTML = `
            <div class="world-map-title">
                <h3>Global AI Innovation Network</h3>
                <p>Connecting innovators worldwide</p>
            </div>
            <div class="world-map" id="worldMap">
                <canvas id="worldMapCanvas"></canvas>
            </div>
        `;
        
        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(mapContainer, footer);
        } else {
            document.body.appendChild(mapContainer);
        }
    }

    generatePoints() {
        // Major tech hubs and cities
        const cities = [
            { name: 'San Francisco', x: 0.15, y: 0.4, size: 8, color: '#00ff88' },
            { name: 'New York', x: 0.25, y: 0.38, size: 7, color: '#00ff88' },
            { name: 'London', x: 0.48, y: 0.35, size: 7, color: '#00ff88' },
            { name: 'Berlin', x: 0.52, y: 0.36, size: 6, color: '#00ff88' },
            { name: 'Tokyo', x: 0.85, y: 0.4, size: 8, color: '#00ff88' },
            { name: 'Seoul', x: 0.82, y: 0.42, size: 7, color: '#00ff88' },
            { name: 'Beijing', x: 0.78, y: 0.38, size: 7, color: '#00ff88' },
            { name: 'Singapore', x: 0.75, y: 0.55, size: 6, color: '#00ff88' },
            { name: 'Mumbai', x: 0.65, y: 0.52, size: 6, color: '#00ff88' },
            { name: 'Sydney', x: 0.82, y: 0.75, size: 6, color: '#00ff88' },
            { name: 'Toronto', x: 0.22, y: 0.35, size: 6, color: '#00ff88' },
            { name: 'Paris', x: 0.49, y: 0.37, size: 6, color: '#00ff88' },
            { name: 'Amsterdam', x: 0.50, y: 0.36, size: 5, color: '#00ff88' },
            { name: 'Stockholm', x: 0.51, y: 0.32, size: 5, color: '#00ff88' },
            { name: 'Moscow', x: 0.58, y: 0.33, size: 6, color: '#00ff88' },
            { name: 'Dubai', x: 0.62, y: 0.48, size: 5, color: '#00ff88' },
            { name: 'São Paulo', x: 0.28, y: 0.65, size: 6, color: '#00ff88' },
            { name: 'Mexico City', x: 0.18, y: 0.48, size: 5, color: '#00ff88' }
        ];

        this.points = cities.map(city => ({
            ...city,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            glow: Math.random() * 0.5 + 0.5
        }));
    }

    generateConnections() {
        this.connections = [];
        
        // Create connections between major hubs
        const hubConnections = [
            ['San Francisco', 'New York'],
            ['San Francisco', 'Tokyo'],
            ['New York', 'London'],
            ['London', 'Berlin'],
            ['London', 'Tokyo'],
            ['Tokyo', 'Seoul'],
            ['Tokyo', 'Beijing'],
            ['Seoul', 'Beijing'],
            ['Beijing', 'Singapore'],
            ['Singapore', 'Mumbai'],
            ['Mumbai', 'Dubai'],
            ['Dubai', 'Moscow'],
            ['Moscow', 'Berlin'],
            ['Berlin', 'Amsterdam'],
            ['Amsterdam', 'London'],
            ['London', 'Paris'],
            ['Paris', 'Stockholm'],
            ['Stockholm', 'Moscow'],
            ['San Francisco', 'Toronto'],
            ['Toronto', 'New York'],
            ['New York', 'Mexico City'],
            ['Mexico City', 'São Paulo']
        ];

        hubConnections.forEach(([from, to]) => {
            const fromPoint = this.points.find(p => p.name === from);
            const toPoint = this.points.find(p => p.name === to);
            
            if (fromPoint && toPoint) {
                this.connections.push({
                    from: fromPoint,
                    to: toPoint,
                    progress: Math.random(),
                    speed: 0.005 + Math.random() * 0.01
                });
            }
        });
    }

    startAnimation() {
        const canvas = document.getElementById('worldMapCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            this.drawConnections(ctx, canvas);
            
            // Draw points
            this.drawPoints(ctx, canvas);
            
            // Update animations
            this.updateAnimations();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    drawConnections(ctx, canvas) {
        this.connections.forEach(connection => {
            const fromX = connection.from.x * canvas.width;
            const fromY = connection.from.y * canvas.height;
            const toX = connection.to.x * canvas.width;
            const toY = connection.to.y * canvas.height;
            
            // Draw base line
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
            
            // Draw animated connection
            const progress = connection.progress;
            const x = fromX + (toX - fromX) * progress;
            const y = fromY + (toY - fromY) * progress;
            
            // Create gradient for connection
            const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
            gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
            gradient.addColorStop(progress, 'rgba(0, 255, 136, 1)');
            gradient.addColorStop(1, 'rgba(0, 255, 136, 0.8)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Draw connection point
            ctx.fillStyle = '#00ff88';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Update progress
            connection.progress += connection.speed;
            if (connection.progress >= 1) {
                connection.progress = 0;
            }
        });
    }

    drawPoints(ctx, canvas) {
        this.points.forEach(point => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;
            
            // Draw glow effect
            const glowRadius = point.size * 2 + Math.sin(point.pulse) * 5;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
            gradient.addColorStop(0, `${point.color}40`);
            gradient.addColorStop(0.7, `${point.color}20`);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw main point
            ctx.fillStyle = point.color;
            ctx.beginPath();
            ctx.arc(x, y, point.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw pulse ring
            const pulseRadius = point.size + Math.sin(point.pulse) * 8;
            ctx.strokeStyle = `${point.color}80`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw city name
            if (point.size > 6) {
                ctx.fillStyle = '#ffffff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(point.name, x, y + point.size + 15);
            }
        });
    }

    updateAnimations() {
        this.points.forEach(point => {
            point.pulse += point.pulseSpeed;
            point.glow = 0.5 + Math.sin(point.pulse * 2) * 0.3;
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize World Map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WorldMap();
});
