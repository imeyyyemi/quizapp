package com.quizapp.repository;

import com.quizapp.model.QuizResult;
import org.springframework.stereotype.Repository;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class QuizResultRepository {
    private final Map<Long, QuizResult> results = new ConcurrentHashMap<>();
    private Long nextId = 1L;

    public QuizResult save(QuizResult result) {
        if (result.getId() == null) {
            result.setId(nextId++);
        }
        results.put(result.getId(), result);
        return result;
    }

    public Optional<QuizResult> findById(Long id) {
        return Optional.ofNullable(results.get(id));
    }

    public List<QuizResult> findAll() {
        return new ArrayList<>(results.values());
    }

    public List<QuizResult> findByStudentId(Long studentId) {
        return results.values().stream()
                .filter(r -> r.getStudentId().equals(studentId))
                .collect(Collectors.toList());
    }

    public List<QuizResult> findByQuizId(Long quizId) {
        return results.values().stream()
                .filter(r -> r.getQuizId().equals(quizId))
                .collect(Collectors.toList());
    }

    public List<QuizResult> findByStudentIdAndQuizId(Long studentId, Long quizId) {
        return results.values().stream()
                .filter(r -> r.getStudentId().equals(studentId) && r.getQuizId().equals(quizId))
                .collect(Collectors.toList());
    }

    public boolean existsByStudentIdAndQuizId(Long studentId, Long quizId) {
        return results.values().stream()
                .anyMatch(r -> r.getStudentId().equals(studentId) && r.getQuizId().equals(quizId));
    }

    public boolean delete(Long id) {
        return results.remove(id) != null;
    }
}

