package com.quizapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizResult {
    private Long id;
    private Long studentId;
    private Long quizId;
    private int score;
    private int totalQuestions;
    private List<Integer> answers;
    private Long completedAt;
}

