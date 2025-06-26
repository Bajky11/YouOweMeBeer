package com.friends.friends.Config;

import com.friends.friends.Entity.User;
import com.friends.friends.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class UserIdAuthenticationPrincipalFilter extends OncePerRequestFilter {
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String userIdHeader = request.getHeader("X-USER-ID");
        if (userIdHeader != null) {
            try {
                Long userId = Long.parseLong(userIdHeader);
                Optional<User> userOpt = userRepository.findById(userId);
                userOpt.ifPresent(user -> SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(user, null, java.util.Collections.emptyList())
                ));
            } catch (NumberFormatException ignored) {}
        }
        filterChain.doFilter(request, response);
    }
}
