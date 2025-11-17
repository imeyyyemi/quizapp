package com.quizapp.service;

import com.quizapp.dto.QuizRequest;
import com.quizapp.model.Question;
import com.quizapp.model.Quiz;
import com.quizapp.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;

    public Quiz createQuiz(QuizRequest request, Long adminId) {
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setCreatedBy(adminId);
        quiz.setCreatedAt(System.currentTimeMillis());

        List<Question> questions = request.getQuestions().stream()
                .map(q -> new Question(q.getQuestion(), q.getOptions(), q.getCorrectAnswer()))
                .toList();
        quiz.setQuestions(questions);

        if (request.getAssignedTo() != null) {
            quiz.setAssignedTo(request.getAssignedTo());
        }

        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long quizId, QuizRequest request, Long adminId) {
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty() || !quizOptional.get().getCreatedBy().equals(adminId)) {
            return null;
        }

        Quiz quiz = quizOptional.get();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());

        List<Question> questions = request.getQuestions().stream()
                .map(q -> new Question(q.getQuestion(), q.getOptions(), q.getCorrectAnswer()))
                .toList();
        quiz.setQuestions(questions);

        if (request.getAssignedTo() != null) {
            quiz.setAssignedTo(request.getAssignedTo());
        }

        return quizRepository.save(quiz);
    }

    public Optional<Quiz> getQuizById(Long quizId) {
        return quizRepository.findById(quizId);
    }

    public List<Quiz> getQuizzesByAdmin(Long adminId) {
        return quizRepository.findByCreatedBy(adminId);
    }

    public List<Quiz> getAssignedQuizzesForStudent(Long studentId) {
        return quizRepository.findAssignedToStudent(studentId);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public boolean deleteQuiz(Long quizId, Long adminId) {
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty() || !quizOptional.get().getCreatedBy().equals(adminId)) {
            return false;
        }
        return quizRepository.delete(quizId);
    }

    public boolean assignQuizToStudent(Long quizId, Long studentId, Long adminId) {
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty() || !quizOptional.get().getCreatedBy().equals(adminId)) {
            return false;
        }

        Quiz quiz = quizOptional.get();
        if (quiz.getAssignedTo() == null) {
            quiz.setAssignedTo(new java.util.ArrayList<>());
        }
        if (!quiz.getAssignedTo().contains(studentId)) {
            quiz.getAssignedTo().add(studentId);
            quizRepository.save(quiz);
        }
        return true;
    }

    public boolean unassignQuizFromStudent(Long quizId, Long studentId, Long adminId) {
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);
        if (quizOptional.isEmpty() || !quizOptional.get().getCreatedBy().equals(adminId)) {
            return false;
        }

        Quiz quiz = quizOptional.get();
        if (quiz.getAssignedTo() != null && quiz.getAssignedTo().contains(studentId)) {
            quiz.getAssignedTo().remove(studentId);
            quizRepository.save(quiz);
        }
        return true;
    }
}

