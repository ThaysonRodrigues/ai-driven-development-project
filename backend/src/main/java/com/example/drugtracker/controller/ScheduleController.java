package com.example.drugtracker.controller;

import com.example.drugtracker.dto.ScheduleDTO;
import com.example.drugtracker.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@CrossOrigin(origins = "*")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Horários", description = "Endpoints para gerenciamento de horários de medicamentos")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Criar horário", description = "Define um novo horário para um medicamento")
    @PostMapping
    public ResponseEntity<ScheduleDTO> createSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO) {
        return ResponseEntity.ok(scheduleService.createSchedule(scheduleDTO));
    }

    // LIST ALL?
    // "GET api/horarios: Listagem de horários."
    // I'll return empty if no filter provided or implement listing all.
    // Usually admin feature.
    // I'll check my service. `listSchedules(patientRemedioId)`.
    // I need a `listAllSchedules()` method or `listSchedules` with optional filter.
    // I'll assume filtering is preferred, but for now strict implementation of GET
    // /api/horarios might create perf issues if not paginated.
    // I'll implement `listAll` in service or repository call directly.
    // I'll update service first? No, just use repository directly or update
    // service.
    // I'll update service to include `listAllSchedules()`.

    // Actually, I'll just map it to return empty list or all. Let's return all for
    // simplicity.
    @io.swagger.v3.oas.annotations.Operation(summary = "Listar horários", description = "Lista todos os horários cadastrados (Admin)")
    @GetMapping
    public ResponseEntity<List<ScheduleDTO>> listSchedules() {
        return ResponseEntity.ok(scheduleService.listAllSchedules());
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Atualizar horário", description = "Atualiza um horário existente")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateSchedule(@PathVariable Long id, @Valid @RequestBody ScheduleDTO scheduleDTO) {
        scheduleService.updateSchedule(id, scheduleDTO);
        return ResponseEntity.ok().build();
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Excluir horário", description = "Remove um horário do sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok().build();
    }
}
