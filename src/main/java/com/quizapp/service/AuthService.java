package com.quizapp.service;

import com.quizapp.dto.LoginRequest;
import com.quizapp.dto.RegisterRequest;
import com.quizapp.dto.AuthResponse;
import com.quizapp.model.User;
import com.quizapp.repository.UserRepository;
import com.quizapp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private static final Random random = new Random();

    private Long generateRandomStudentId() {
        // Generate 8-digit ID with format 2025xxxx (where xxxx is random 0000-9999)
        long randomPart = random.nextInt(10000); // 0 to 9999
        return 20250000L + randomPart;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, "Email already registered", null, null, null, null);
        }

        User user = new User();
        user.setId(generateRandomStudentId()); // Generate random 6-digit ID
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, use BCrypt
        user.setRole(User.UserRole.STUDENT);
        user.setCreatedAt(System.currentTimeMillis());

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getRole().toString());

        return new AuthResponse(token, "Registration successful", savedUser.getId(),
                savedUser.getRole().toString(), savedUser.getName(), savedUser.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return new AuthResponse(null, "Invalid email or password", null, null, null, null);
        }

        User user = userOptional.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(null, "Invalid email or password", null, null, null, null);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole().toString());

        return new AuthResponse(token, "Login successful", user.getId(),
                user.getRole().toString(), user.getName(), user.getEmail());
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllStudents() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == User.UserRole.STUDENT)
                .collect(Collectors.toList());
    }
}

