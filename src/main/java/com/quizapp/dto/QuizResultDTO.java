package com.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizResultDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long quizId;
    private int score;
    private int totalQuestions;
    private Long completedAt;
    private double percentage;
}

