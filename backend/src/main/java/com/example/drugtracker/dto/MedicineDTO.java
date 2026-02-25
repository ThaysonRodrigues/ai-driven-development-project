package com.example.drugtracker.dto;

public record MedicineDTO(
                Long id,
                String nome,
                String dosagem,
                String observacoes) {
}
