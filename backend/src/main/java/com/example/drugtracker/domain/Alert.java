package com.example.drugtracker.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_hora_disparo", nullable = false)
    private LocalDateTime dataHoraDisparo;

    @Column(nullable = false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "horario_id", nullable = false)
    private Schedule horario;

    public Alert() {
    }

    public Alert(LocalDateTime dataHoraDisparo, String status, Schedule horario) {
        this.dataHoraDisparo = dataHoraDisparo;
        this.status = status;
        this.horario = horario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHoraDisparo() {
        return dataHoraDisparo;
    }

    public void setDataHoraDisparo(LocalDateTime dataHoraDisparo) {
        this.dataHoraDisparo = dataHoraDisparo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Schedule getHorario() {
        return horario;
    }

    public void setHorario(Schedule horario) {
        this.horario = horario;
    }
}
