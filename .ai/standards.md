# Padrões de Codificação

## Geral
- **Versão do Java**: 25 (Mínima)
- **Estilo de Código**: Código limpo, legibilidade > abstrações complexas.
- **Escrita do código no idioma**: Português PT-BR
- **Versão do Angular**: V21 (Mínima)
- **Testes**: Desejáveis, mas não obrigatórios. Se implementados, utilize JUnit 5.

## Recursos da Linguagem Java
- **DTOs**: É OBRIGATÓRIO usar `record` para todos os Objetos de Transferência de Dados imutáveis.

- **Opcionais**: Use `Optional` SOMENTE para tipos de retorno de métodos que podem não produzir resultado. NUNCA use `Optional` em campos ou parâmetros de métodos.

- **Streams**: Use a API de Streams do Java para todas as operações de filtragem, mapeamento e ordenação de coleções. Não utilize loops manuais para essas tarefas.

## Estrutura da Aplicação (Em Camadas)
- `controller`: Camada fina. Lida apenas com requisições/respostas HTTP. Valida a entrada. Delega para o Serviço.

- `service`: Contém TODA a lógica de negócios.

- `repository`: Camada de acesso a dados (simulação em memória).

- `domain`: Modelos de domínio (POJOs/Registros).

- `dto`: Registros de requisição e resposta.

- `config`: Classes de configuração do Spring.

- `error`: Tratamento global de exceções e respostas a erros.

## Convenções REST
- **Formato de Resposta**: Envelopes/esquemas JSON consistentes para todos os endpoints.

- **Validação**: É OBRIGATÓRIO o uso de anotações `jakarta.validation` (`@NotNull`, `@Size`, etc.) em DTOs.

- **Métodos HTTP**: Uso correto do método GET para recuperação de dados, lógica na camada de serviço.