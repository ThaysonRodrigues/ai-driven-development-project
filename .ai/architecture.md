# Arquitetura

## Visão Geral
- **Estilo**: Arquitetura em camadas (padrão Spring MVC).
- **Persistência de dados**: Utilizar banco de dados mysql, vamos utilizar uma imagem docker do mysql para utilizar o banco de dados, criar toda a estrutura do banco de dados quando iniciar a aplicação.

## Restrições
- **Chamadas externas**: ESTRITAMENTE PROIBIDAS. Não são permitidas chamadas HTTP para APIs externas.
- **Natureza**: Este é um aplicativo de gestão de medicamentos, responsáveis, pacientes e horários de medicamentos.
- **NÃO é um rastreador**.
- **NÃO é um agregador**.
- **NÃO é um proxy**.

## Decisões Arquitetônicas

### ADR-001: Armazenamento de dados em banco de dados MYSQL
**Contexto**: A aplicação irá utilizar banco de dados mysql para armazenar os dados dos medicamentos, responsáveis, pacientes e horários de medicamentos, vamos utilizar uma imagem docker do mysql para utilizar o banco de dados, criar toda a estrutura do banco de dados quando iniciar a aplicação, você terá que criar um script sql para criar a estrutura do banco de dados.

### ADR-002: Projeto backend
**Contexto**: O projeto backend vai ficar em uma pasta isolada, vamos utilizar java na versão 25, com springboot e maven para gerenciar as dependências.

### ADR-003: Projeto frontend
**Contexto**: O projeto frontend vai ficar em uma pasta isolada, vamos utilizar angular para criar todas as interfaces, nesse primeiro momento vamos conectar com o projeto backend somente a nível localhost.