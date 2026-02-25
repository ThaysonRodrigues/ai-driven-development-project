package com.example.drugtracker.dto;

public record UserDTO(
                Long id,
                String nome,
                String email,
                String tipoUsuario) {
}
