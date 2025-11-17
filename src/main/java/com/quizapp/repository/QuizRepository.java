package com.quizapp.repository;

import com.quizapp.model.Quiz;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class QuizRepository {
    private final Map<Long, Quiz> quizzes = new ConcurrentHashMap<>();
    private Long nextId = 1L;

    public Quiz save(Quiz quiz) {
        if (quiz.getId() == null) {
            quiz.setId(nextId++);
        }
        quizzes.put(quiz.getId(), quiz);
        return quiz;
    }

    public Optional<Quiz> findById(Long id) {
        return Optional.ofNullable(quizzes.get(id));
    }

    public List<Quiz> findAll() {
        return new ArrayList<>(quizzes.values());
    }

    public List<Quiz> findByCreatedBy(Long adminId) {
        return quizzes.values().stream()
                .filter(q -> q.getCreatedBy().equals(adminId))
                .collect(Collectors.toList());
    }

    public List<Quiz> findAssignedToStudent(Long studentId) {
        return quizzes.values().stream()
                .filter(q -> q.getAssignedTo() != null && q.getAssignedTo().contains(studentId))
                .collect(Collectors.toList());
    }

    public boolean delete(Long id) {
        return quizzes.remove(id) != null;
    }

    public boolean existsById(Long id) {
        return quizzes.containsKey(id);
    }
}

