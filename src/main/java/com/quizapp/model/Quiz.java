package com.quizapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    public void setTitle(String javaBasics) {
    }

    public void setDescription(String s) {
    }

    public void setCreatedAt(long l) {
    }

    public void setCreatedBy(Object id) {
    }

    public void setQuestions(List<Question> questions1) {
    }

    public void setAssignedTo(ArrayList<Object> objects) {
    }
}

