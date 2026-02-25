package com.example.drugtracker.controller;

import com.example.drugtracker.dto.UserDTO;
import com.example.drugtracker.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Obter detalhes do usuário", description = "Retorna os dados de um usuário pelo ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Atualizar detalhes do usuário", description = "Altera os dados de um usuário existente")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO,
            @RequestParam(required = false) String password) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO, password));
    }
}
