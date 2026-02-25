package com.example.drugtracker.dto;

import java.time.LocalDate;

public record PatientDTO(
                Long id,
                String nome,
                LocalDate dataNascimento,
                Long responsavelId) {
}
