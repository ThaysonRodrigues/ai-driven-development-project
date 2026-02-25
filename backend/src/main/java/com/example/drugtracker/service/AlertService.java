package com.example.drugtracker.service;

import com.example.drugtracker.domain.Alert;
import com.example.drugtracker.domain.Schedule;
import com.example.drugtracker.dto.AlertDTO;
import com.example.drugtracker.repository.AlertRepository;
import com.example.drugtracker.repository.ScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final ScheduleRepository scheduleRepository;

    public AlertService(AlertRepository alertRepository, ScheduleRepository scheduleRepository) {
        this.alertRepository = alertRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<AlertDTO> listAlerts() {
        return alertRepository.findAll().stream()
                .map(a -> new AlertDTO(
                        a.getId(),
                        a.getDataHoraDisparo(),
                        a.getStatus(),
                        a.getHorario().getId(),
                        a.getHorario().getPacienteRemedio().getPaciente().getNome(),
                        a.getHorario().getPacienteRemedio().getRemedio().getNome()))
                .collect(Collectors.toList());
    }

    public AlertDTO getAlert(Long id) {
        Alert a = alertRepository.findById(id).orElseThrow(() -> new RuntimeException("Alert not found"));
        return new AlertDTO(
                a.getId(),
                a.getDataHoraDisparo(),
                a.getStatus(),
                a.getHorario().getId(),
                a.getHorario().getPacienteRemedio().getPaciente().getNome(),
                a.getHorario().getPacienteRemedio().getRemedio().getNome());
    }

    public void updateAlert(Long id, AlertDTO alertDTO) {
        Alert a = alertRepository.findById(id).orElseThrow(() -> new RuntimeException("Alert not found"));
        a.setDataHoraDisparo(alertDTO.dataHoraDisparo());
        a.setStatus(alertDTO.status());
        // Changing schedule is complex, assuming not allowed or handled if needed
        alertRepository.save(a);
    }

    public void deleteAlert(Long id) {
        alertRepository.deleteById(id);
    }

    public void confirmAlert(Long id) {
        Alert alert = alertRepository.findById(id).orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setStatus("TOMADO");
        alertRepository.save(alert);
    }

    // Simple alert generation logic to be called by scheduler
    @Transactional
    public void generateAlerts() {
        List<Schedule> schedules = scheduleRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        // 1. Mark expired alerts as "NÃO TOMADO"
        LocalDateTime expirationThreshold = now.minusMinutes(10);
        List<Alert> allAlerts = alertRepository.findAll();
        for (Alert a : allAlerts) {
            if ("PENDENTE".equals(a.getStatus()) && a.getDataHoraDisparo().isBefore(expirationThreshold)) {
                a.setStatus("NÃO TOMADO");
                alertRepository.save(a);
            }
        }

        // 2. Generate new alerts
        for (Schedule s : schedules) {
            LocalDateTime expectedOccurrence = LocalDateTime.of(now.toLocalDate(), s.getHora());

            // If the scheduled time for today has been reached and is within the last 5
            // minutes
            if (!now.isBefore(expectedOccurrence) && now.isBefore(expectedOccurrence.plusMinutes(5))) {

                // Check if alert already created for today's occurrence
                boolean exists = alertRepository.findByHorarioId(s.getId()).stream()
                        .anyMatch(a -> a.getDataHoraDisparo().toLocalDate().equals(now.toLocalDate()));

                if (!exists) {
                    Alert alert = new Alert(expectedOccurrence, "PENDENTE", s);
                    alertRepository.save(alert);
                }
            }
        }
    }
}
