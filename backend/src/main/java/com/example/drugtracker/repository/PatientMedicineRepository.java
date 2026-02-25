package com.example.drugtracker.repository;

import com.example.drugtracker.domain.PatientMedicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientMedicineRepository extends JpaRepository<PatientMedicine, Long> {
    List<PatientMedicine> findByPacienteId(Long pacienteId);

    Optional<PatientMedicine> findByPacienteIdAndRemedioId(Long pacienteId, Long remedioId);
}
