package com.example.attendance_management;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register a new user
    @PostMapping("/register")
    public User register(@RequestBody User user) {

        User existingUser =
                userRepository.findByUsername(user.getUsername());

        if (existingUser != null) {
            throw new RuntimeException("Username already exists");
        }

        return userRepository.save(user);
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User existingUser =
                userRepository.findByUsername(user.getUsername());

        if (existingUser != null &&
            existingUser.getPassword().equals(user.getPassword())) {

            return "Login successful";
        }

        return "Invalid username or password";
    }
}