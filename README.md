# Drug Tracker Application

Aplicação para controle e alertas de medicamentos.

## Estrutura do Projeto

- `backend/`: Código fonte da API Java Spring Boot.
- `frontend/`: Código fonte da interface Angular.
- `database/`: Script de inicialização do banco de dados (`init.sql`).
- `docker-compose.yml`: Configuração para rodar o banco de dados MySQL via Docker.

## Pré-requisitos

- Java 25 (Java 21+ compatível) e Maven.
- Node.js e NPM (para o Frontend).
- Docker e Docker Compose.

## Como Executar

### 1. Banco de Dados

Inicie o banco de dados MySQL usando Docker:

```bash
docker-compose up -d
```

O banco será criado na porta 3306 com o usuário `root` e senha `password`, e o database `drugtracker_db`.

### 2. Backend

Navegue até a pasta `backend` e execute:

```bash
cd backend
mvn spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

### 3. Frontend

**Nota:** Como o ambiente não possui `npm` instalado/configurado corretamente, a estrutura do projeto foi criada manualmente. Para executar:

1.  Certifique-se de ter Node.js instalado.
2.  Na pasta `frontend`, instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    npm start
    ```
4.  Acesse `http://localhost:4200`.

## Funcionalidades Implementadas

- **Login/Registro**: Cadastro de usuários (Responsáveis).
- **Pacientes**: Cadastro e listagem de pacientes.
- **Medicamentos**: Cadastro de medicamentos disponíveis.
- **Associação**: Vínculo de medicamentos a pacientes.
- **Horários**: Definição de horários e recorrência para os medicamentos.
- **Alertas**: Geração automática de alertas (Scheduler roda a cada minuto) e confirmação de uso.

## Decisões Técnicas

- **Backend**: Spring Boot 3.3, JPA, MySQL. Autenticação via Token manual (devido a restrições de dependências).
- **Frontend**: Angular 17 (Standalone Components).
- **Docker**: MySQL containerizado.
