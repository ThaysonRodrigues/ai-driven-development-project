package com.example.drugtracker.repository;

import com.example.drugtracker.domain.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByHorarioId(Long horarioId);
}
