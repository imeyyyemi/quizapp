package com.quizapp;

import com.quizapp.model.Question;
import com.quizapp.model.Quiz;
import com.quizapp.model.User;
import com.quizapp.repository.QuizRepository;
import com.quizapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository, QuizRepository quizRepository) {
       return args -> {
           // Create admin user
           User admin = new User();
           admin.setName("Admin User");
           admin.setEmail("admin@example.com");
           admin.setPassword("admin123");
           admin.setRole(User.UserRole.ADMIN);
           admin.setCreatedAt(System.currentTimeMillis());
           User savedAdmin = userRepository.save(admin);

           // Create test student users
           User student1 = new User();
           student1.setName("John Doe");
           student1.setEmail("john@example.com");
           student1.setPassword("student123");
           student1.setRole(User.UserRole.STUDENT);
           student1.setCreatedAt(System.currentTimeMillis());
           User savedStudent1 = userRepository.save(student1);

            User student2 = new User();
            student2.setName("Jane Smith");
            student2.setEmail("jane@example.com");
            student2.setPassword("student123");
            student2.setRole(User.UserRole.STUDENT);
            student2.setCreatedAt(System.currentTimeMillis());
            User savedStudent2 = userRepository.save(student2);

            // Create sample quizzes
            Quiz quiz1 = new Quiz();
            quiz1.setTitle("Java Basics");
            quiz1.setDescription("Test your knowledge of Java fundamentals");
            quiz1.setCreatedBy(savedAdmin.getId());
            quiz1.setCreatedAt(System.currentTimeMillis());

            List<Question> questions1 = Arrays.asList(
                new Question(
                    "What is the main method in Java?",
                        Arrays.asList("public static void main(String[] args)", "private void main()", "public void main(String args)", "static main()"),
                    0
                ),
                new Question(
                    "Which of the following is a primitive data type in Java?",
                    Arrays.asList("String", "ArrayList", "int", "StringBuilder"),
                    2
                ),
                new Question(
                    "What is the output of 5 + 3 * 2 in Java?",
                    Arrays.asList("16", "11", "13", "22"),
                    1
                ),
                new Question(
                    "Which keyword is used to prevent a class from being subclassed?",
                    Arrays.asList("private", "protected", "final", "static"),
                    2
                ),
                new Question(
                    "What does JVM stand for?",
                    Arrays.asList("Java Virtual Memory", "Java Virtual Machine", "Java Validation Model", "Java Variant Method"),
                    1
                )
            );
            quiz1.setQuestions(questions1);
            quiz1.setAssignedTo(new ArrayList<>(Arrays.asList(savedStudent1.getId(), savedStudent2.getId())));
            quizRepository.save(quiz1);

            // Create second quiz
            Quiz quiz2 = new Quiz();
            quiz2.setTitle("Spring Framework");
            quiz2.setDescription("Test your Spring Framework knowledge");
            quiz2.setCreatedBy(savedAdmin.getId());
            quiz2.setCreatedAt(System.currentTimeMillis());

            List<Question> questions2 = Arrays.asList(
                   new Question(
                           "What is Spring Boot primarily used for?",
                           Arrays.asList("Frontend development", "Building microservices", "Database management", "Mobile development"),
                           1
                   ),
                   new Question(
                           "Which annotation is used to mark a Spring Bean?",
                           Arrays.asList("@Bean", "@Component", "@Service", "All of the above"),
                           3
                   ),
                   new Question(
                           "What does 'IoC' stand for in Spring?",
                           Arrays.asList("Input/Output Control", "Inversion of Control", "Internal Operation Code", "Information Object Container"),
                           1
                   )
           );

            quiz2.setQuestions(questions2);
            quiz2.setAssignedTo(new ArrayList<>(Arrays.asList(savedStudent1.getId())));
            quizRepository.save(quiz2);

            System.out.println("✓ Test data initialized successfully!");
            System.out.println("Admin: admin@example.com / admin123");
            System.out.println("Student 1: john@example.com / student123");
            System.out.println("Student 2: jane@example.com / student123");
        };
    }
}

