package com.quizapp.controller;

import com.quizapp.dto.QuizResultDTO;
import com.quizapp.model.User;
import com.quizapp.service.AuthService;
import com.quizapp.service.QuizResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminResultsController {
    @Autowired
    private QuizResultService quizResultService;

    @Autowired
    private AuthService authService;

    @GetMapping("/results/quiz/{quizId}")
    public ResponseEntity<List<QuizResultDTO>> getQuizResults(@PathVariable Long quizId,
                                                             @RequestHeader("Authorization") String token) {
        List<QuizResultDTO> results = quizResultService.getQuizResults(quizId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            List<User> students = authService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

