package com.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizRequest {
    private String title;
    private String description;
    private List<QuestionDTO> questions;
    private List<Long> assignedTo;
}

