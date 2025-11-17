package com.quizapp.controller;

import com.quizapp.dto.QuizResultDTO;
import com.quizapp.dto.QuizSubmitRequest;
import com.quizapp.model.Quiz;
import com.quizapp.model.QuizResult;
import com.quizapp.service.QuizResultService;
import com.quizapp.service.QuizService;
import com.quizapp.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    @Autowired
    private QuizService quizService;

    @Autowired
    private QuizResultService quizResultService;

    @Autowired
    private TokenUtil tokenUtil;

    @GetMapping("/quizzes")

    }

    @GetMapping("/quizzes/{id}")

    }

    @PostMapping("/quizzes/submit")
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizSubmitRequest request,
                                                @RequestHeader("Authorization") String token) {
        Long studentId = tokenUtil.extractUserIdFromToken(token);
        QuizResult result = quizResultService.submitQuiz(studentId, request);
        if (result == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/results")
    public ResponseEntity<List<QuizResult>> getMyResults(@RequestHeader("Authorization") String token) {
        Long studentId = tokenUtil.extractUserIdFromToken(token);
        List<QuizResult> results = quizResultService.getStudentResults(studentId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/results/{quizId}")
    public ResponseEntity<QuizResult> getQuizResult(@PathVariable Long quizId,
                                                   @RequestHeader("Authorization") String token) {
        Long studentId = tokenUtil.extractUserIdFromToken(token);
        return quizResultService.getStudentQuizResult(studentId, quizId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/quizzes/{quizId}/taken")
    public ResponseEntity<Boolean> hasQuizBeenTaken(@PathVariable Long quizId,
                                                   @RequestHeader("Authorization") String token) {
        Long studentId = tokenUtil.extractUserIdFromToken(token);
        boolean taken = quizResultService.hasStudentTakenQuiz(studentId, quizId);
        return ResponseEntity.ok(taken);
    }
}

