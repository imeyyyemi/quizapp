# Quiz App - Online Quiz Web Application

A full-stack online quiz application built with **Spring Boot** (backend) and **Vite + Vanilla JavaScript** (frontend) using an in-memory database.

---

## 🚀 Quick Start (for beginners)

### Prerequisites
Make sure you have installed:
- **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 16+** ([Download](https://nodejs.org/))

### Clone the Repository
```bash
git clone <your-repo-url>
cd quizapp
```

### Run Backend (Terminal 1)
```bash
mvn clean install -DskipTests
mvn spring-boot:run
```
Wait for: `Started QuizAppApplication`

### Run Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Wait for: `Local: http://localhost:5173/`

### Open in Browser
```
http://localhost:5173
```

### Test Credentials
- **Admin**: admin@example.com / admin123
- **Student**: john@example.com / student123

---

## Features

### Admin Features
- ✅ **Admin Login/Dashboard** - Secure login and admin panel
- ✅ **Create Quiz** - Create new quizzes with multiple-choice questions
- ✅ **Edit Quiz** - Modify existing quizzes
- ✅ **Delete Quiz** - Remove quizzes
- ✅ **Assign Quiz to Students** - Assign quizzes to specific students by ID
- ✅ **View All Students** - See list of all registered students with 8-digit IDs
- ✅ **View Results** - See student scores, percentages, and dates completed
- ✅ **Admin Profile** - View admin information

### Student Features
- ✅ **Student Registration** - Create new student account (auto-assigned 8-digit ID)
- ✅ **Student Login** - Secure login
- ✅ **Student Dashboard** - View assigned quizzes
- ✅ **Take Quiz** - Interactive quiz-taking with progress tracking
- ✅ **View Results** - See personal quiz scores and history
- ✅ **Student Profile** - View profile with 8-digit ID

---

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.1.5
- **Language**: Java 17
- **Database**: In-Memory (ConcurrentHashMap)
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Port**: 8080

### Frontend
- **Build Tool**: Vite 5.0+
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3
- **API Communication**: Fetch API
- **Port**: 5173

---

## Project Structure

```
quizapp/
├── src/main/java/com/quizapp/
│   ├── QuizAppApplication.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── AdminQuizController.java
│   │   ├── AdminResultsController.java
│   │   └── StudentController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── QuizService.java
│   │   └── QuizResultService.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Quiz.java
│   │   └── QuizResult.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── QuizRepository.java
│   │   └── QuizResultRepository.java
│   └── util/
│       └── TokenUtil.java
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── StudentDashboard.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── dashboard.css
│   │   ├── api.js
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── pom.xml
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/{id}` - Get user details

### Admin APIs
- `POST /api/admin/quizzes` - Create quiz
- `GET /api/admin/quizzes` - Get all admin's quizzes
- `PUT /api/admin/quizzes/{id}` - Update quiz
- `DELETE /api/admin/quizzes/{id}` - Delete quiz
- `POST /api/admin/quizzes/{quizId}/assign/{studentId}` - Assign quiz to student
- `DELETE /api/admin/quizzes/{quizId}/unassign/{studentId}` - Unassign quiz
- `GET /api/admin/results/quiz/{quizId}` - Get quiz results
- `GET /api/admin/students` - Get all registered students

### Student APIs
- `GET /api/student/quizzes` - Get assigned quizzes
- `GET /api/student/quizzes/{id}` - Get quiz details
- `POST /api/student/quizzes/submit` - Submit quiz answers
- `GET /api/student/results` - Get my results

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is available
lsof -i :8080

# Kill process using port 8080
kill -9 <PID>

# Try again
mvn spring-boot:run
```

### Frontend won't start
```bash
# Make sure you're in frontend directory
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Students endpoint returns 404
- Ensure backend is rebuilt: `mvn clean install -DskipTests`
- Restart backend: `mvn spring-boot:run`
- Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

---

## Key Features Explained

### Student ID Format
- **Format**: 8 digits starting with 2025 (e.g., 20250123)
- **Generated**: Automatically when student registers
- **Usage**: Admin uses this ID to assign quizzes to students

### Quiz Assignment
1. Admin creates quiz
2. Admin clicks "Assign Quizzes"
3. Admin clicks "Manage Assignments"
4. Admin enters student ID
5. Quiz appears in student's dashboard

### Taking a Quiz
1. Student logs in
2. Clicks "Available Quizzes"
3. Clicks "Start Quiz"
4. Answers questions
5. Clicks "Submit Quiz"
6. Sees immediate score

---

## File Descriptions

### Key Backend Files
- **QuizAppApplication.java** - Main Spring Boot application entry point
- **AuthService.java** - Handles user registration and authentication with JWT
- **QuizService.java** - Manages quiz CRUD operations and assignments
- **UserRepository.java** - In-memory storage for users
- **QuizRepository.java** - In-memory storage for quizzes

### Key Frontend Files
- **api.js** - API client for communicating with backend
- **AdminDashboard.js** - Admin interface for managing quizzes
- **StudentDashboard.js** - Student interface for taking quizzes
- **main.js** - Main entry point and routing

---

## Data Persistence

⚠️ **Important**: This application uses an **in-memory database**. All data is lost when the application stops.

For production use, integrate a real database like:
- PostgreSQL
- MySQL
- MongoDB

---

## Development Notes

- JWT tokens expire after 24 hours
- Student IDs are randomly generated (8 digits: 2025xxxx)
- Admin account is pre-seeded with email: admin@example.com
- Student accounts can be registered by users
- Answers are stored in memory and calculated on submission

---

## Building for Production

### Backend
```bash
mvn clean package -DskipTests
java -jar target/quiz-app-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder with optimized build
```

---

## License

This project is open source and available for educational purposes.

---

## Support

For issues or questions, please refer to the documentation files in the repository or check the console logs for error messages.
│   │   ├── QuizService.java
│   │   └── QuizResultService.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Quiz.java
│   │   ├── Question.java
│   │   └── QuizResult.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── QuizRepository.java
│   │   └── QuizResultRepository.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   ├── QuizRequest.java
│   │   ├── QuestionDTO.java
│   │   ├── QuizSubmitRequest.java
│   │   └── QuizResultDTO.java
│   └── security/
│       └── JwtTokenProvider.java
├── src/main/resources/
│   └── application.properties
├── pom.xml                              # Maven configuration
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js                      # Entry point
│       ├── api.js                       # API client
│       ├── styles/
│       │   ├── global.css
│       │   └── dashboard.css
│       └── pages/
│           ├── LoginPage.js
│           ├── RegisterPage.js
│           ├── AdminDashboard.js
│           └── StudentDashboard.js
└── README.md
```

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+ (for frontend)

### Backend Setup

1. **Clone the repository**
```bash
cd /Users/imeylonganilla/Documents/repo/quizapp
```

2. **Build the backend**
```bash
mvn clean install
```

3. **Run the Spring Boot application**
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/user/{id}` - Get user details

### Admin Quizzes
- `POST /api/admin/quizzes` - Create quiz
- `PUT /api/admin/quizzes/{id}` - Update quiz
- `DELETE /api/admin/quizzes/{id}` - Delete quiz
- `GET /api/admin/quizzes` - Get admin's quizzes
- `GET /api/admin/quizzes/{id}` - Get quiz details
- `POST /api/admin/quizzes/{quizId}/assign/{studentId}` - Assign quiz to student
- `DELETE /api/admin/quizzes/{quizId}/unassign/{studentId}` - Unassign quiz from student

### Admin Results
- `GET /api/admin/results/quiz/{quizId}` - Get quiz results

### Student Quizzes
- `GET /api/student/quizzes` - Get assigned quizzes
- `GET /api/student/quizzes/{id}` - Get quiz details
- `POST /api/student/quizzes/submit` - Submit quiz answers

### Student Results
- `GET /api/student/results` - Get student's results
- `GET /api/student/results/{quizId}` - Get specific quiz result
- `GET /api/student/quizzes/{quizId}/taken` - Check if quiz was taken

## Usage Guide

### For Admins

1. **Login**
   - Use admin credentials to login
   - Admin account needs to be created in the backend

2. **Create a Quiz**
   - Click "Create Quiz" from sidebar
   - Enter quiz title and description
   - Add questions with multiple options
   - Mark the correct answer for each question
   - Submit to create

3. **Assign Quizzes**
   - Select a quiz from "My Quizzes"
   - Use the assign button to assign to students
   - Students will see the quiz in their dashboard

4. **View Results**
   - Click "Results" to see all quiz submissions
   - View scores, percentages, and completion dates

### For Students

1. **Register**
   - Click "Register here" on login page
   - Fill in name, email, and password
   - Auto-login after registration

2. **View Assigned Quizzes**
   - Dashboard shows all quizzes assigned to you
   - Status shows if quiz is completed or not

3. **Take a Quiz**
   - Click "Start Quiz"
   - Use Previous/Next to navigate questions
   - Progress bar shows completion percentage
   - Submit when all questions are answered

4. **View Results**
   - Click "My Results" to see:
     - Quiz name
     - Score and total questions
     - Percentage
     - Date completed

## In-Memory Database

The application uses `ConcurrentHashMap` for thread-safe, in-memory data storage:

- **UserRepository**: Stores user accounts
- **QuizRepository**: Stores quizzes and questions
- **QuizResultRepository**: Stores quiz submissions and scores

All data is reset when the application restarts.

## Authentication

The app uses JWT (JSON Web Tokens) for secure authentication:

- Tokens are stored in browser localStorage
- Tokens include userId and role information
- Tokens expire after 24 hours (configurable)

## Building for Production

### Backend
```bash
mvn clean package
java -jar target/quiz-app-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist
```

## Default Test Admin Account

To add an admin account, you can modify the `QuizAppApplication.java` to initialize test data:

```java
@Bean
public void initializeTestData(UserRepository userRepository) {
    User admin = new User();
    admin.setName("Admin User");
    admin.setEmail("admin@example.com");
    admin.setPassword("admin123");
    admin.setRole(User.UserRole.ADMIN);
    admin.setCreatedAt(System.currentTimeMillis());
    userRepository.save(admin);
}
```

## Troubleshooting

### CORS Issues
- Make sure Vite dev server proxy is configured correctly
- Backend CORS configuration allows requests from `http://localhost:5173`

### JWT Token Errors
- Ensure the same secret key is used for signing and validation
- Check token expiration time

### API Endpoints Not Found
- Verify backend is running on port 8080
- Check controller mappings match the API routes

## Future Enhancements

- [ ] Database persistence (JPA/Hibernate)
- [ ] User roles and permissions system
- [ ] Quiz categories/tags
- [ ] Timed quizzes
- [ ] Question randomization
- [ ] Analytics and reporting
- [ ] Email notifications
- [ ] Quiz templates
- [ ] Question bank management
- [ ] Mobile app version

## License

MIT License - Feel free to use this project for educational purposes.

## Support

For issues or questions, please refer to the code comments or create an issue in the repository.

---

**Happy Quiz Taking! 🎓**

