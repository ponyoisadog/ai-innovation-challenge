from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ai_competition.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    entries = db.relationship('Entry', backref='author', lazy=True)
    votes = db.relationship('Vote', backref='voter', lazy=True)

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    project_link = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    votes = db.relationship('Vote', backref='entry', lazy=True, cascade='all, delete-orphan')
    
    @property
    def vote_count(self):
        return len(self.votes)

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    entry_id = db.Column(db.Integer, db.ForeignKey('entry.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure one vote per user per entry
    __table_args__ = (db.UniqueConstraint('user_id', 'entry_id', name='unique_user_vote'),)

# Authentication Helper Functions
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 401
        
        request.current_user = user
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function

# Routes
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('name', 'email', 'password')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create new user
    user = User(
        name=data['name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    token = generate_token(user.id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200

# Entry Routes
@app.route('/api/entries', methods=['GET'])
def get_entries():
    entries = Entry.query.order_by(Entry.created_at.desc()).all()
    
    entries_data = []
    for entry in entries:
        entries_data.append({
            'id': entry.id,
            'title': entry.title,
            'description': entry.description,
            'project_link': entry.project_link,
            'category': entry.category,
            'author': entry.author.name,
            'author_id': entry.user_id,
            'vote_count': entry.vote_count,
            'created_at': entry.created_at.isoformat()
        })
    
    return jsonify(entries_data)

@app.route('/api/entries', methods=['POST'])
@require_auth
def create_entry():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('title', 'description', 'project_link', 'category')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    entry = Entry(
        title=data['title'],
        description=data['description'],
        project_link=data['project_link'],
        category=data['category'],
        user_id=request.current_user.id
    )
    
    db.session.add(entry)
    db.session.commit()
    
    return jsonify({
        'id': entry.id,
        'title': entry.title,
        'description': entry.description,
        'project_link': entry.project_link,
        'category': entry.category,
        'author': entry.author.name,
        'author_id': entry.user_id,
        'vote_count': entry.vote_count,
        'created_at': entry.created_at.isoformat()
    }), 201

# Voting Routes
@app.route('/api/entries/<int:entry_id>/vote', methods=['POST'])
@require_auth
def vote_for_entry(entry_id):
    entry = Entry.query.get_or_404(entry_id)
    
    # Check if user already voted for this entry
    existing_vote = Vote.query.filter_by(user_id=request.current_user.id, entry_id=entry_id).first()
    if existing_vote:
        return jsonify({'error': 'You have already voted for this entry'}), 400
    
    # Create new vote
    vote = Vote(user_id=request.current_user.id, entry_id=entry_id)
    db.session.add(vote)
    db.session.commit()
    
    return jsonify({
        'message': 'Vote recorded successfully',
        'vote_count': entry.vote_count
    }), 201

@app.route('/api/entries/<int:entry_id>/vote', methods=['DELETE'])
@require_auth
def remove_vote(entry_id):
    vote = Vote.query.filter_by(user_id=request.current_user.id, entry_id=entry_id).first()
    if not vote:
        return jsonify({'error': 'No vote found to remove'}), 404
    
    db.session.delete(vote)
    db.session.commit()
    
    entry = Entry.query.get(entry_id)
    return jsonify({
        'message': 'Vote removed successfully',
        'vote_count': entry.vote_count
    }), 200

@app.route('/api/my-votes', methods=['GET'])
@require_auth
def get_my_votes():
    votes = Vote.query.filter_by(user_id=request.current_user.id).all()
    entry_ids = [vote.entry_id for vote in votes]
    return jsonify(entry_ids)

# Statistics Routes
@app.route('/api/stats', methods=['GET'])
def get_stats():
    participant_count = User.query.count()
    project_count = Entry.query.count()
    total_votes = Vote.query.count()
    
    return jsonify({
        'participants': participant_count,
        'projects': project_count,
        'total_votes': total_votes
    })

# Featured Projects Route
@app.route('/api/featured', methods=['GET'])
def get_featured_projects():
    # Get top 3 projects by vote count
    featured = Entry.query.join(Vote).group_by(Entry.id).order_by(db.func.count(Vote.id).desc()).limit(3).all()
    
    featured_data = []
    for entry in featured:
        featured_data.append({
            'id': entry.id,
            'title': entry.title,
            'description': entry.description,
            'project_link': entry.project_link,
            'category': entry.category,
            'author': entry.author.name,
            'vote_count': entry.vote_count
        })
    
    return jsonify(featured_data)

# Database initialization
def create_tables():
    with app.app_context():
        db.create_all()
        
        # Add some sample data if database is empty
        if User.query.count() == 0:
            sample_users = [
                User(name="Alex Chen", email="alex@example.com", password_hash=generate_password_hash("password123")),
                User(name="Dr. Sarah Johnson", email="sarah@example.com", password_hash=generate_password_hash("password123")),
                User(name="Green Team", email="green@example.com", password_hash=generate_password_hash("password123"))
            ]
            
            for user in sample_users:
                db.session.add(user)
            db.session.commit()
            
            sample_entries = [
                Entry(
                    title="AI-Powered Code Review Assistant",
                    description="An intelligent system that automatically reviews code for bugs, security vulnerabilities, and performance issues using machine learning algorithms.",
                    project_link="https://github.com/example/ai-code-reviewer",
                    category="productivity",
                    user_id=1
                ),
                Entry(
                    title="Smart Medical Diagnosis Tool",
                    description="A deep learning model that assists doctors in diagnosing diseases from medical images with 95% accuracy, helping improve healthcare outcomes.",
                    project_link="https://github.com/example/medical-ai",
                    category="healthcare",
                    user_id=2
                ),
                Entry(
                    title="EcoTrack - Environmental Impact Monitor",
                    description="An AI system that tracks and predicts environmental changes using satellite data and IoT sensors to help combat climate change.",
                    project_link="https://github.com/example/ecotrack",
                    category="environment",
                    user_id=3
                )
            ]
            
            for entry in sample_entries:
                db.session.add(entry)
            db.session.commit()
            
            # Add some sample votes
            sample_votes = [
                Vote(user_id=2, entry_id=1),
                Vote(user_id=3, entry_id=1),
                Vote(user_id=1, entry_id=2),
                Vote(user_id=3, entry_id=2),
                Vote(user_id=1, entry_id=3),
                Vote(user_id=2, entry_id=3),
            ]
            
            for vote in sample_votes:
                db.session.add(vote)
            db.session.commit()

if __name__ == '__main__':
    create_tables()
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)