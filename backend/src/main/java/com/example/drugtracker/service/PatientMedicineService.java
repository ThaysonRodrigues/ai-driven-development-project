package com.example.drugtracker.service;

import com.example.drugtracker.domain.Alert;
import com.example.drugtracker.domain.Medicine;
import com.example.drugtracker.domain.Patient;
import com.example.drugtracker.domain.PatientMedicine;
import com.example.drugtracker.domain.Schedule;
import com.example.drugtracker.dto.PatientMedicineDTO;
import com.example.drugtracker.repository.AlertRepository;
import com.example.drugtracker.repository.MedicineRepository;
import com.example.drugtracker.repository.PatientMedicineRepository;
import com.example.drugtracker.repository.PatientRepository;
import com.example.drugtracker.repository.ScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientMedicineService {

    private final PatientMedicineRepository patientMedicineRepository;
    private final PatientRepository patientRepository;
    private final MedicineRepository medicineRepository;
    private final ScheduleRepository scheduleRepository;
    private final AlertRepository alertRepository;

    public PatientMedicineService(PatientMedicineRepository patientMedicineRepository,
            PatientRepository patientRepository,
            MedicineRepository medicineRepository,
            ScheduleRepository scheduleRepository,
            AlertRepository alertRepository) {
        this.patientMedicineRepository = patientMedicineRepository;
        this.patientRepository = patientRepository;
        this.medicineRepository = medicineRepository;
        this.scheduleRepository = scheduleRepository;
        this.alertRepository = alertRepository;
    }

    public PatientMedicineDTO linkMedicine(Long patientId, Long medicineId) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Medicine m = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        PatientMedicine pm = new PatientMedicine(p, m);
        PatientMedicine saved = patientMedicineRepository.save(pm);
        return new PatientMedicineDTO(saved.getId(), saved.getPaciente().getId(), saved.getRemedio().getId());
    }

    public List<PatientMedicineDTO> listMedicinesForPatient(Long patientId) {
        return patientMedicineRepository.findByPacienteId(patientId).stream()
                .map(pm -> new PatientMedicineDTO(pm.getId(), pm.getPaciente().getId(), pm.getRemedio().getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void unlinkMedicine(Long patientMedicineId) {
        // 1. Delete associated alerts and schedules
        List<Schedule> schedules = scheduleRepository.findByPacienteRemedioId(patientMedicineId);
        for (Schedule s : schedules) {
            List<Alert> alerts = alertRepository.findByHorarioId(s.getId());
            alertRepository.deleteAll(alerts);
            scheduleRepository.deleteById(s.getId());
        }

        // 2. Delete the link itself
        patientMedicineRepository.deleteById(patientMedicineId);
    }
}
