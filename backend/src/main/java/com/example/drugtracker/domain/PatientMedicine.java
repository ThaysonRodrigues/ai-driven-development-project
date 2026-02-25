package com.example.drugtracker.domain;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "patient_medicines")
public class PatientMedicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Patient paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "remedio_id", nullable = false)
    private Medicine remedio;

    public PatientMedicine() {
    }

    public PatientMedicine(Patient paciente, Medicine remedio) {
        this.paciente = paciente;
        this.remedio = remedio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPaciente() {
        return paciente;
    }

    public void setPaciente(Patient paciente) {
        this.paciente = paciente;
    }

    public Medicine getRemedio() {
        return remedio;
    }

    public void setRemedio(Medicine remedio) {
        this.remedio = remedio;
    }
}
