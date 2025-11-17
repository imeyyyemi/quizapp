# 📖 Clone and Run Guide - For Everyone

## ✅ Will It Work on Other Machines?

**YES!** ✅ If they have the prerequisites installed, it will work perfectly!

---

## 📋 Prerequisites (Must Install First)

Everyone cloning the repo needs these installed on their machine:

### 1. **Java 17+**
- Download from: https://www.oracle.com/java/technologies/downloads/
- Verify: `java -version` (should show Java 17+)

### 2. **Maven 3.6+**
- Download from: https://maven.apache.org/download.cgi
- Verify: `mvn -version`

### 3. **Node.js 16+**
- Download from: https://nodejs.org/
- Verify: `node -version` and `npm -version`

---

## 🚀 Clone and Run Steps

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd quizapp
```

### Step 2: Build Backend
```bash
mvn clean install -DskipTests
```

Wait for: `BUILD SUCCESS`

### Step 3: Start Backend (Terminal 1)
```bash
mvn spring-boot:run
```

Wait for: `Started QuizAppApplication`

### Step 4: Install Frontend Dependencies (Terminal 2)
```bash
cd quizapp/frontend
npm install
```

### Step 5: Start Frontend (Terminal 2)
```bash
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 6: Open in Browser
```
http://localhost:5173
```

---

## 🔐 Default Login Credentials

### Admin Account
```
Email: admin@example.com
Password: admin123
```

### Student Accounts
```
Email: john@example.com
Password: student123
```

---

## ✨ What They Can Do

✅ **Admin**: Create/Edit/Delete quizzes, view students, assign quizzes, see results
✅ **Student**: Register (get 8-digit ID), take quizzes, see scores

---

## 🆘 Common Issues & Fixes

### "Java not found"
- Install Java from: https://www.oracle.com/java/technologies/downloads/
- Verify: `java -version`

### "Maven not found"
- Install Maven from: https://maven.apache.org/
- Verify: `mvn -version`

### "Port 8080 already in use"
```bash
lsof -i :8080
kill -9 <PID>
```

### "Port 5173 already in use"
```bash
lsof -i :5173
kill -9 <PID>
```

### "npm install fails"
```bash
cd frontend
rm -rf node_modules
npm install
```

### "BUILD FAILURE"
```bash
# Clean and try again
mvn clean install -DskipTests
```

---

## 📁 What Gets Downloaded

When they run the commands, these will be downloaded automatically:

### Backend
- Spring Boot libraries
- Spring Web
- JWT libraries
- All Maven dependencies

### Frontend
- Vite
- Node modules (small set)

**Total size**: ~500MB (mostly Maven cache)

**Note**: Node modules are in `.gitignore`, so they download via `npm install`

---

## ⏹️ How to Stop

Press **Ctrl+C** in each terminal to stop the services.

---

## 📝 What's in the Git Repository

✅ **Included**:
- All Java source code
- All frontend JavaScript
- HTML/CSS files
- `pom.xml` (tells Maven what to download)
- `package.json` (tells npm what to download)
- `.gitignore` (excludes unnecessary files)
- Documentation

❌ **NOT Included** (downloaded automatically):
- `node_modules/` folder (frontend dependencies)
- `target/` folder (compiled Java)
- `.m2/` folder (Maven cache)

This keeps the repo small!

---

## 🎯 Verification Steps

After running both services, verify everything works:

### Check Backend is Running
```bash
curl http://localhost:8080/api/auth/user/1
```

Should return user data.

### Check Frontend is Running
Open: `http://localhost:5173`

Should show login page.

---

## 🎓 For Beginners

1. **Install prerequisites** (one-time)
2. **Clone the repo** (`git clone`)
3. **Run the 2 commands** (backend & frontend)
4. **Open browser** to http://localhost:5173
5. **Login and enjoy!**

That's it! No complicated setup needed! 🚀

---

## 📞 Troubleshooting Checklist

- [ ] Java installed? (`java -version`)
- [ ] Maven installed? (`mvn -version`)
- [ ] Node.js installed? (`node -version`)
- [ ] Cloned repo? (`git clone`)
- [ ] Built backend? (`mvn clean install -DskipTests`)
- [ ] Started backend first? (Terminal 1)
- [ ] Installed frontend deps? (`npm install`)
- [ ] Started frontend? (Terminal 2)
- [ ] Opened browser? (`http://localhost:5173`)

If all checked, it should work! ✅

---

## 💾 What Each File Does

| File | Purpose |
|------|---------|
| `pom.xml` | Lists all backend dependencies Maven needs |
| `frontend/package.json` | Lists all frontend dependencies npm needs |
| `.gitignore` | Tells git what NOT to include in the repo |
| `src/` | All Java backend code |
| `frontend/src/` | All JavaScript frontend code |
| `README.md` | Full documentation |

---

## 🎉 Ready to Share!

Your project is ready for others to clone and run. They just need:
1. The prerequisites installed
2. Follow the clone and run steps
3. Done!

**Congratulations!** Your project is now beginner-friendly and shareable! 🚀

