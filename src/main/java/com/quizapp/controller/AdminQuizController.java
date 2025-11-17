package com.quizapp.controller;

import com.quizapp.dto.QuizRequest;
import com.quizapp.model.Quiz;
import com.quizapp.service.QuizService;
import com.quizapp.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/quizzes")
public class AdminQuizController {
    @Autowired
    private QuizService quizService;

    @Autowired
    private TokenUtil tokenUtil;

    @PostMapping
    public ResponseEntity<Quiz> createQuiz(@RequestBody QuizRequest request,
                                          @RequestHeader("Authorization") String token) {
        Long adminId = tokenUtil.extractUserIdFromToken(token);
        Quiz quiz = quizService.createQuiz(request, adminId);
        return ResponseEntity.ok(quiz);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id,
                                          @RequestBody QuizRequest request,
                                          @RequestHeader("Authorization") String token) {
        Long adminId = tokenUtil.extractUserIdFromToken(token);
        Quiz quiz = quizService.updateQuiz(id, request, adminId);
        if (quiz == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(quiz);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id,
                                          @RequestHeader("Authorization") String token) {
        Long adminId = tokenUtil.extractUserIdFromToken(token);
        if (quizService.deleteQuiz(id, adminId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Quiz>> getAdminQuizzes(@RequestHeader("Authorization") String token) {
        Long adminId = tokenUtil.extractUserIdFromToken(token);
        List<Quiz> quizzes = quizService.getQuizzesByAdmin(adminId);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuiz(@PathVariable Long id) {
        return quizService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{quizId}/assign/{studentId}")
    public ResponseEntity<?> assignQuizToStudent(@PathVariable Long quizId,
                                                   @PathVariable Long studentId,
                                                   @RequestHeader("Authorization") String token) {
        Long adminId = tokenUtil.extractUserIdFromToken(token);
        if (quizService.assignQuizToStudent(quizId, studentId, adminId)) {
            return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
                put("message", "Quiz assigned successfully");
                put("quizId", String.valueOf(quizId));
                put("studentId", String.valueOf(studentId));
            }});
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{quizId}/unassign/{studentId}")
    public ResponseEntity<?> unassignQuizFromStudent(@PathVariable Long quizId,
                                                      @PathVariable Long studentId,
                                                      @RequestHeader("Authorization") String token) {
        Long adminId = tokenUtil.extractUserIdFromToken(token);
        if (quizService.unassignQuizFromStudent(quizId, studentId, adminId)) {
            return ResponseEntity.ok(new java.util.HashMap<String, String>() {{
                put("message", "Quiz unassigned successfully");
                put("quizId", String.valueOf(quizId));
                put("studentId", String.valueOf(studentId));
            }});
        }
        return ResponseEntity.notFound().build();
    }
}

