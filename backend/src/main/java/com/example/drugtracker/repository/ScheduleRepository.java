package com.example.drugtracker.repository;

import com.example.drugtracker.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByPacienteRemedioId(Long pacienteRemedioId);

    List<Schedule> findByPacienteRemedio_Paciente_Id(Long pacienteId);
}
