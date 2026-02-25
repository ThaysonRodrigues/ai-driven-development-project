package com.example.drugtracker.controller;

import com.example.drugtracker.dto.AlertDTO;
import com.example.drugtracker.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*") // Allow angular
@io.swagger.v3.oas.annotations.tags.Tag(name = "Alertas", description = "Endpoints para gerenciamento de alertas de medicamentos")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Listar alertas", description = "Lista todos os alertas e seus status")
    @GetMapping
    public ResponseEntity<List<AlertDTO>> listAlerts() {
        return ResponseEntity.ok(alertService.listAlerts());
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Obter alerta", description = "Retorna os detalhes de um alerta")
    @GetMapping("/{id}")
    public ResponseEntity<AlertDTO> getAlert(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getAlert(id));
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Atualizar alerta", description = "Atualiza o status ou horário de um alerta")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAlert(@PathVariable Long id, @Valid @RequestBody AlertDTO alertDTO) {
        alertService.updateAlert(id, alertDTO);
        return ResponseEntity.ok().build();
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Excluir alerta", description = "Remove um alerta do sistema")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.ok().build();
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Confirmar alerta", description = "Marca um alerta como 'TOMADO'")
    @PostMapping("/{id}/confirmar")
    public ResponseEntity<Void> confirmAlert(@PathVariable Long id) {
        alertService.confirmAlert(id);
        return ResponseEntity.ok().build();
    }
}
