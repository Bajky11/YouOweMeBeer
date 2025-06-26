package com.friends.friends.Controller;

import com.friends.friends.Entity.User;
import com.friends.friends.Services.UserService;
import com.friends.friends.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    /**
     * GET /api/users
     * Vrátí všechny uživatele.
     * Příklad: GET /api/users
     */
    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername()))
                .collect(Collectors.toList());
    }

    /**
     * GET /api/users/{id}
     * Vrátí uživatele podle ID.
     * Příklad: GET /api/users/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(new UserDto(user.getId(), user.getUsername())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/users/username/{username}
     * Vrátí uživatele podle username.
     * Příklad: GET /api/users/username/petr
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                .map(user -> ResponseEntity.ok(new UserDto(user.getId(), user.getUsername())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/users
     * Vytvoří nového uživatele.
     * Příklad: POST /api/users
     * Body:
     * {
     *   "username": "petr"
     * }
     */
    @PostMapping
    public UserDto createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        return new UserDto(created.getId(), created.getUsername());
    }

    /**
     * PUT /api/users/{id}
     * Aktualizuje uživatele podle ID.
     * Příklad: PUT /api/users/1
     * Body:
     * {
     *   "username": "novyuzivatel"
     * }
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.updateUser(id, userDetails)
                .map(user -> ResponseEntity.ok(new UserDto(user.getId(), user.getUsername())))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/users/{id}
     * Smaže uživatele podle ID.
     * Příklad: DELETE /api/users/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userService.deleteUser(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/users/me
     * Vrátí aktuálně přihlášeného uživatele podle @AuthenticationPrincipal, nebo 404 pokud není přihlášen.
     * Příklad: GET /api/users/me
     * (uživatel posílá své ID v hlavičce X-USER-ID)
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new UserDto(user.getId(), user.getUsername()));
    }
}
