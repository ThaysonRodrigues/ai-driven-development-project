package com.example.drugtracker.dto;

import java.time.LocalDateTime;

public record AlertDTO(
                Long id,
                LocalDateTime dataHoraDisparo,
                String status,
                Long horarioId,
                String pacienteNome,
                String remedioNome) {
}
