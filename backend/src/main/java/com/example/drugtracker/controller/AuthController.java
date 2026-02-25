package com.example.drugtracker.controller;

import com.example.drugtracker.dto.LoginRequest;
import com.example.drugtracker.dto.LoginResponse;
import com.example.drugtracker.dto.UserDTO;
import com.example.drugtracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Autenticação", description = "Endpoints para login e registro de usuários")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Realizar login", description = "Autentica um usuário e retorna um token")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Registrar usuário", description = "Cria uma nova conta de usuário (Responsável ou Paciente)")
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@Valid @RequestBody UserDTO userDTO, @RequestParam String password) {
        return ResponseEntity.ok(userService.register(userDTO, password));
    }
}
