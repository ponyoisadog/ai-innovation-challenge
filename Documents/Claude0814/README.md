# AI Innovation Challenge Platform

A complete web application for hosting AI innovation competitions with user registration, project submissions, voting, and leaderboards.

## Features

### Frontend
- **Modern Landing Page**: Hero section with statistics, project carousel, and competition information
- **User Authentication**: Modal-based login/registration system
- **Project Showcase**: Carousel displaying outstanding projects with voting stats
- **Competition Categories**: Healthcare, Education, Environment, Productivity, Creative, and Open Innovation
- **Responsive Design**: Mobile-friendly layout with modern CSS animations
- **Interactive Elements**: Voting system, project submission forms, and user dashboard

### Backend (Python/Flask)
- **RESTful API**: Complete backend API for all functionality
- **User Management**: Registration, login with JWT authentication
- **Project Management**: CRUD operations for competition entries
- **Voting System**: One vote per user per project with real-time counts
- **Database**: SQLite with SQLAlchemy ORM
- **Sample Data**: Pre-populated with example projects and users

## Quick Start

### Frontend Only (Development)
```bash
# Open the website directly
open index.html
```

### Full Stack Setup

1. **Install Python Dependencies**
```bash
pip install -r requirements.txt
```

2. **Run the Backend**
```bash
python app.py
```

3. **Open Frontend**
```bash
# Backend serves frontend at http://localhost:5000
open http://localhost:5000
```

## Project Structure

```
ai-competition/
├── index.html          # Main webpage
├── styles.css          # All styling and animations
├── script.js           # Frontend JavaScript (localStorage version)
├── api_client.js       # API client for backend integration
├── app.py              # Flask backend application
├── requirements.txt    # Python dependencies
└── README.md          # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Projects
- `GET /api/entries` - Get all project entries
- `POST /api/entries` - Submit new project (auth required)

### Voting
- `POST /api/entries/:id/vote` - Vote for a project (auth required)
- `DELETE /api/entries/:id/vote` - Remove vote (auth required)
- `GET /api/my-votes` - Get user's votes (auth required)

### Statistics
- `GET /api/stats` - Get competition statistics
- `GET /api/featured` - Get top-voted projects

## Sample Users (Backend)
- alex@example.com (password: password123)
- sarah@example.com (password: password123)
- green@example.com (password: password123)

## Technologies Used

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- CSS Grid & Flexbox for layout
- CSS Animations and Transitions
- Local Storage for data persistence

### Backend
- Python 3.7+
- Flask web framework
- SQLAlchemy ORM
- SQLite database
- JWT authentication
- Flask-CORS for cross-origin requests

## Features Implemented

✅ User authentication (login/register)  
✅ Project submission with categories  
✅ Voting system with vote tracking  
✅ Project showcase carousel  
✅ Competition statistics  
✅ Responsive design  
✅ Modern UI with animations  
✅ RESTful API backend  
✅ Database persistence  
✅ Real-time vote counting  

## Competition Rules

- One submission per participant
- Community voting determines winners
- $100 Amazon Gift Card grand prize
- Categories: Healthcare, Education, Environment, Productivity, Creative, Open Innovation
- 30-day submission period with 7-day voting period

## Development Notes

- Frontend works standalone with localStorage
- Backend provides full API with database persistence
- Both modes include sample data for demonstration
- JWT tokens expire after 7 days
- SQLite database created automatically on first run