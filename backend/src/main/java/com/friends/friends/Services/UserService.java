package com.friends.friends.Services;

import com.friends.friends.Entity.User;
import com.friends.friends.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User userDetails) {
        // Check if the new username already exists (and is not the current user's username)
        Optional<User> existingUser = userRepository.findByUsername(userDetails.getUsername());
        if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
            // Username already taken by another user
            return Optional.empty();
        }
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            return userRepository.save(user);
        });
    }

    public boolean deleteUser(Long id) {
        if (!userRepository.existsById(id)) return false;
        userRepository.deleteById(id);
        return true;
    }

    public Optional<User> getUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return user;
        } else {
            User newUser = new User();
            newUser.setUsername(username);
            return Optional.of(userRepository.save(newUser));
        }
    }
}
