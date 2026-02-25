package com.example.drugtracker.service;

import com.example.drugtracker.domain.Patient;
import com.example.drugtracker.domain.User;
import com.example.drugtracker.dto.PatientDTO;
import com.example.drugtracker.repository.PatientRepository;
import com.example.drugtracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public PatientDTO createPatient(PatientDTO patientDTO) {
        User responsavel = userRepository.findById(patientDTO.responsavelId())
                .orElseThrow(() -> new RuntimeException("Responsavel not found"));

        Patient patient = new Patient(patientDTO.nome(), patientDTO.dataNascimento(), responsavel);
        Patient saved = patientRepository.save(patient);
        return new PatientDTO(saved.getId(), saved.getNome(), saved.getDataNascimento(),
                saved.getResponsavel().getId());
    }

    public List<PatientDTO> listPatients(Long responsavelId) {
        return patientRepository.findByResponsavelId(responsavelId).stream()
                .map(p -> new PatientDTO(p.getId(), p.getNome(), p.getDataNascimento(), p.getResponsavel().getId()))
                .collect(Collectors.toList());
    }

    public PatientDTO getPatient(Long id) {
        Patient p = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
        return new PatientDTO(p.getId(), p.getNome(), p.getDataNascimento(), p.getResponsavel().getId());
    }

    public void updatePatient(Long id, PatientDTO patientDTO) {
        Patient p = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
        p.setNome(patientDTO.nome());
        p.setDataNascimento(patientDTO.dataNascimento());
        // Responsavel implies ownership change which might be allowed or not, let's
        // allow it for now
        if (patientDTO.responsavelId() != null) {
            User responsavel = userRepository.findById(patientDTO.responsavelId())
                    .orElseThrow(() -> new RuntimeException("Responsavel not found"));
            p.setResponsavel(responsavel);
        }
        patientRepository.save(p);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
