package com.example.drugtracker.service;

import com.example.drugtracker.domain.Medicine;
import com.example.drugtracker.dto.MedicineDTO;
import com.example.drugtracker.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public MedicineDTO createMedicine(MedicineDTO medicineDTO) {
        Medicine medicine = new Medicine(medicineDTO.nome(), medicineDTO.dosagem(), medicineDTO.observacoes());
        Medicine saved = medicineRepository.save(medicine);
        return new MedicineDTO(saved.getId(), saved.getNome(), saved.getDosagem(), saved.getObservacoes());
    }

    public List<MedicineDTO> listMedicines() {
        return medicineRepository.findAll().stream()
                .map(m -> new MedicineDTO(m.getId(), m.getNome(), m.getDosagem(), m.getObservacoes()))
                .collect(Collectors.toList());
    }

    public MedicineDTO getMedicine(Long id) {
        Medicine m = medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
        return new MedicineDTO(m.getId(), m.getNome(), m.getDosagem(), m.getObservacoes());
    }

    public void updateMedicine(Long id, MedicineDTO medicineDTO) {
        Medicine m = medicineRepository.findById(id).orElseThrow(() -> new RuntimeException("Medicine not found"));
        m.setNome(medicineDTO.nome());
        m.setDosagem(medicineDTO.dosagem());
        m.setObservacoes(medicineDTO.observacoes());
        medicineRepository.save(m);
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }
}
