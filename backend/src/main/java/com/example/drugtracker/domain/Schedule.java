package com.example.drugtracker.domain;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(nullable = false)
    private String recorrencia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_remedio_id", nullable = false)
    private PatientMedicine pacienteRemedio;

    public Schedule() {
    }

    public Schedule(LocalTime hora, String recorrencia, PatientMedicine pacienteRemedio) {
        this.hora = hora;
        this.recorrencia = recorrencia;
        this.pacienteRemedio = pacienteRemedio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getRecorrencia() {
        return recorrencia;
    }

    public void setRecorrencia(String recorrencia) {
        this.recorrencia = recorrencia;
    }

    public PatientMedicine getPacienteRemedio() {
        return pacienteRemedio;
    }

    public void setPacienteRemedio(PatientMedicine pacienteRemedio) {
        this.pacienteRemedio = pacienteRemedio;
    }
}
