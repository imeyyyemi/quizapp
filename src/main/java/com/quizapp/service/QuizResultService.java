package com.quizapp.service;

import com.quizapp.dto.QuizResultDTO;
import com.quizapp.dto.QuizSubmitRequest;
import com.quizapp.model.Quiz;
import com.quizapp.model.QuizResult;
import com.quizapp.model.User;
import com.quizapp.repository.QuizResultRepository;
import com.quizapp.repository.QuizRepository;
import com.quizapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizResultService {
    @Autowired
    private QuizResultRepository quizResultRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserRepository userRepository;

    public QuizResult submitQuiz(Long studentId, QuizSubmitRequest request) {

        }

        QuizResult result = new QuizResult();
        result.setStudentId(studentId);
        result.setQuizId(request.getQuizId());
        result.setScore(score);
        result.setTotalQuestions(quiz.getQuestions().size());
        result.setAnswers(answers);
        result.setCompletedAt(System.currentTimeMillis());

        return quizResultRepository.save(result);
    }

    public List<QuizResult> getStudentResults(Long studentId) {
        return quizResultRepository.findByStudentId(studentId);
    }

    public List<QuizResultDTO> getQuizResults(Long quizId) {
        List<QuizResult> results = quizResultRepository.findByQuizId(quizId);
        return results.stream()
                .map(result -> {
                    User student = userRepository.findById(result.getStudentId()).orElse(null);
                    return new QuizResultDTO(
                            result.getId(),
                            result.getStudentId(),
                            student != null ? student.getName() : "Unknown",
                            result.getQuizId(),
                            result.getScore(),
                            result.getTotalQuestions(),
                            result.getCompletedAt(),
                            (double) result.getScore() / result.getTotalQuestions() * 100
                    );
                })
                .collect(Collectors.toList());
    }

    public Optional<QuizResult> getStudentQuizResult(Long studentId, Long quizId) {
        List<QuizResult> results = quizResultRepository.findByStudentIdAndQuizId(studentId, quizId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public boolean hasStudentTakenQuiz(Long studentId, Long quizId) {
        return quizResultRepository.existsByStudentIdAndQuizId(studentId, quizId);
    }
}

