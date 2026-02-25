package com.example.drugtracker.dto;

import java.time.LocalTime;

public record ScheduleDTO(
                Long id,
                LocalTime hora,
                String recorrencia,
                Long pacienteRemedioId) {
}
