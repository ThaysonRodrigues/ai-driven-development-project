package com.example.drugtracker.repository;

import com.example.drugtracker.domain.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByResponsavelId(Long responsavelId);
}
