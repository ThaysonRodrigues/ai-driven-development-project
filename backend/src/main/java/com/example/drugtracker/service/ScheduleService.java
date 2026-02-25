package com.example.drugtracker.service;

import com.example.drugtracker.domain.PatientMedicine;
import com.example.drugtracker.domain.Schedule;
import com.example.drugtracker.dto.ScheduleDTO;
import com.example.drugtracker.repository.PatientMedicineRepository;
import com.example.drugtracker.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final PatientMedicineRepository patientMedicineRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, PatientMedicineRepository patientMedicineRepository) {
        this.scheduleRepository = scheduleRepository;
        this.patientMedicineRepository = patientMedicineRepository;
    }

    public ScheduleDTO createSchedule(ScheduleDTO scheduleDTO) {
        PatientMedicine pm = patientMedicineRepository.findById(scheduleDTO.pacienteRemedioId())
                .orElseThrow(() -> new RuntimeException("PatientMedicine link not found"));

        Schedule schedule = new Schedule(scheduleDTO.hora(), scheduleDTO.recorrencia(), pm);
        Schedule saved = scheduleRepository.save(schedule);
        return new ScheduleDTO(saved.getId(), saved.getHora(), saved.getRecorrencia(),
                saved.getPacienteRemedio().getId());
    }

    public List<ScheduleDTO> listSchedules(Long patientRemedioId) {
        return scheduleRepository.findByPacienteRemedioId(patientRemedioId).stream()
                .map(s -> new ScheduleDTO(s.getId(), s.getHora(), s.getRecorrencia(), s.getPacienteRemedio().getId()))
                .collect(Collectors.toList());
    }

    public List<ScheduleDTO> listSchedulesForPatient(Long patientId) {
        return scheduleRepository.findByPacienteRemedio_Paciente_Id(patientId).stream()
                .map(s -> new ScheduleDTO(s.getId(), s.getHora(), s.getRecorrencia(), s.getPacienteRemedio().getId()))
                .collect(Collectors.toList());
    }

    public List<ScheduleDTO> listAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(s -> new ScheduleDTO(s.getId(), s.getHora(), s.getRecorrencia(), s.getPacienteRemedio().getId()))
                .collect(Collectors.toList());
    }

    public void updateSchedule(Long id, ScheduleDTO scheduleDTO) {
        Schedule s = scheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule not found"));
        s.setHora(scheduleDTO.hora());
        s.setRecorrencia(scheduleDTO.recorrencia());
        scheduleRepository.save(s);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}
