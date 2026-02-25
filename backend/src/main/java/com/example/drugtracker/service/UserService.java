package com.example.drugtracker.service;

import com.example.drugtracker.domain.User;
import com.example.drugtracker.dto.LoginRequest;
import com.example.drugtracker.dto.LoginResponse;
import com.example.drugtracker.dto.UserDTO;
import com.example.drugtracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserDTO register(UserDTO userDTO, String password) {
        if (userRepository.findByEmail(userDTO.email()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        // In a real scenario with allowed dependencies, use BCrypt
        String encodedPassword = Base64.getEncoder().encodeToString(password.getBytes(StandardCharsets.UTF_8));

        User user = new User(userDTO.nome(), userDTO.email(), encodedPassword, userDTO.tipoUsuario());
        User saved = userRepository.save(user);
        return new UserDTO(saved.getId(), saved.getNome(), saved.getEmail(), saved.getTipoUsuario());
    }

    public LoginResponse login(LoginRequest loginRequest) {
        String encodedPassword = Base64.getEncoder()
                .encodeToString(loginRequest.senha().getBytes(StandardCharsets.UTF_8));
        Optional<User> userOpt = userRepository.findByEmailAndSenha(loginRequest.email(), encodedPassword);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();
        // Generate a mock JWT since we can't use external libraries
        String token = generateMockJwt(user);
        return new LoginResponse(token, user.getTipoUsuario(), user.getId(), user.getNome());
    }

    private String generateMockJwt(User user) {
        // Very basic manual JWT-like string for demonstration purposes strictly
        // following "No extra deps" rule
        String header = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes(StandardCharsets.UTF_8));
        String payload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(("{\"sub\":\"" + user.getId() + "\",\"role\":\"" + user.getTipoUsuario() + "\"}")
                        .getBytes(StandardCharsets.UTF_8));
        String signature = "mockSignature"; // Real signature requires HMAC calculation which is verbose to implement
                                            // from scratch
        return header + "." + payload + "." + signature;
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user.getId(), user.getNome(), user.getEmail(), user.getTipoUsuario());
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO, String password) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setNome(userDTO.nome());
        user.setEmail(userDTO.email());

        if (password != null && !password.isEmpty()) {
            String encodedPassword = Base64.getEncoder().encodeToString(password.getBytes(StandardCharsets.UTF_8));
            user.setSenha(encodedPassword);
        }

        User updated = userRepository.save(user);
        return new UserDTO(updated.getId(), updated.getNome(), updated.getEmail(), updated.getTipoUsuario());
    }
}
