package com.quizapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Quiz {
    private Long id;
    private String title;
    private String description;
    private Long createdBy;
    private List<Question> questions;
    private List<Long> assignedTo;
    private Long createdAt;
}

