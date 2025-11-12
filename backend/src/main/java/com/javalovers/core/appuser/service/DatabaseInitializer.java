package com.javalovers.core.appuser.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

  private final JdbcTemplate jdbcTemplate;

  @Override
  public void run(String... args) throws Exception {
    log.info("Iniciando verificação do banco de dados...");

    // Verificar se existem usuários
    Integer userCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM app_user", Integer.class);

    if (userCount == 0) {
      log.info("Banco vazio detectado. Executando scripts de inicialização...");
      executeScript("db/script-create-tables.sql");
      executeScript("db/script-insert-values.sql");
      log.info("Scripts de inicialização executados com sucesso!");
    } else {
      log.info("Banco já possui {} usuários. Pulando inicialização.", userCount);
    }
  }

  private void executeScript(String scriptPath) {
    try {
      String script = Files.readString(Paths.get(scriptPath));
      String[] statements = script.split(";");

      for (String statement : statements) {
        statement = statement.trim();
        if (!statement.isEmpty() && !statement.startsWith("--")) {
          try {
            jdbcTemplate.execute(statement);
          } catch (Exception e) {
            log.warn("Erro ao executar statement: {}", statement.substring(0, Math.min(50, statement.length())));
          }
        }
      }
    } catch (IOException e) {
      log.error("Erro ao ler script: {}", scriptPath, e);
    }
  }
}
