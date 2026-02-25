# Pilha de Tecnologias

## Núcleo
- **Linguagem Backend**: Java 25
- **Framework Backend**: Spring Boot (Última versão compatível com Java 25)
- **Ferramenta de Build**: Maven
- **Linguagem Frontend**: Angular 21
- **Framework Frontend**: Angular (Última versão compatível com Angular 21)
- **Observação**: Adicionar logs para rastreamento

## Dependências Aprovadas
As seguintes dependências são **OBRIGATÓRIAS**:
- `spring-boot-starter-web`
- `spring-boot-starter-validation`
- `springdoc-openapi` (ou `springdoc-openapi-starter-webmvc-ui` para Swagger UI)
- `jackson-databind`

## Dependências Proibidas
O uso das seguintes dependências é **ESTRITAMENTE PROIBIDO**:
- `org.springframework.boot:spring-boot-starter-webflux` (WebClient)
- `org.springframework.web.client.RestTemplate`
- `org.jsoup:jsoup`
- `org.seleniumhq.selenium`
- `org.springframework.cloud:spring-cloud-starter-openfeign`

## Configuração
- Toda a configuração deve ser feita através do arquivo `application.yml`. Não utilize o arquivo `application.properties`.

> QUALQUER dependência fora desta lista NÃO DEVE ser utilizada.