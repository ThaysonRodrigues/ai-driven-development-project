package com.example.drugtracker.dto;

public record LoginResponse(
        String token,
        String tipoUsuario,
        Long userId,
        String userName) {
}
