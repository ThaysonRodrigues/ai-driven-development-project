package com.example.drugtracker.controller;

import com.example.drugtracker.dto.MedicineDTO;
import com.example.drugtracker.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/remedios")
@CrossOrigin(origins = "*")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Medicamentos", description = "Endpoints para gerenciamento de medicamentos")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Criar medicamento", description = "Adiciona um novo medicamento ao catálogo")
    @PostMapping
    public ResponseEntity<MedicineDTO> createMedicine(@Valid @RequestBody MedicineDTO medicineDTO) {
        return ResponseEntity.ok(medicineService.createMedicine(medicineDTO));
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Listar medicamentos", description = "Lista todos os medicamentos disponíveis")
    @GetMapping
    public ResponseEntity<List<MedicineDTO>> listMedicines() {
        return ResponseEntity.ok(medicineService.listMedicines());
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Atualizar medicamento", description = "Atualiza os dados de um medicamento")
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateMedicine(@PathVariable Long id, @Valid @RequestBody MedicineDTO medicineDTO) {
        medicineService.updateMedicine(id, medicineDTO);
        return ResponseEntity.ok().build();
    }

    @io.swagger.v3.oas.annotations.Operation(summary = "Excluir medicamento", description = "Remove um medicamento do catálogo")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok().build();
    }
}
