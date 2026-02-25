CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL
);

CREATE TABLE patients (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    responsavel_id BIGINT NOT NULL,
    FOREIGN KEY (responsavel_id) REFERENCES users(id)
);

CREATE TABLE medicines (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    dosagem VARCHAR(50) NOT NULL,
    observacoes TEXT
);

CREATE TABLE patient_medicines (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    remedio_id BIGINT NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES patients(id),
    FOREIGN KEY (remedio_id) REFERENCES medicines(id)
);

CREATE TABLE schedules (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hora TIME NOT NULL,
    recorrencia VARCHAR(50) NOT NULL,
    paciente_remedio_id BIGINT NOT NULL,
    FOREIGN KEY (paciente_remedio_id) REFERENCES patient_medicines(id)
);

CREATE TABLE alerts (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    data_hora_disparo DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    horario_id BIGINT NOT NULL,
    FOREIGN KEY (horario_id) REFERENCES schedules(id)
);
