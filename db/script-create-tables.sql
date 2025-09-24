-- =====================================================================
-- ESQUEMA: Sistema de Doações / Beneficiários
-- Requisitos: MySQL 8.0+
-- =====================================================================

-- Opcional: crie um schema dedicado
CREATE DATABASE IF NOT EXISTS doacoes
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE doacoes;

-- =====================================================================
-- TABELAS BÁSICAS
-- =====================================================================

CREATE TABLE Perfil (
  ID_Perfil       INT AUTO_INCREMENT PRIMARY KEY,
  Nome            VARCHAR(100) NOT NULL,
  Descricao       VARCHAR(255) NULL,
  UNIQUE KEY uq_perfil_nome (Nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Usuario (
  ID_Usuario      INT AUTO_INCREMENT PRIMARY KEY,
  Nome            VARCHAR(120) NOT NULL,
  Login           VARCHAR(60)  NOT NULL,
  Email           VARCHAR(160) NOT NULL,
  SenhaHash       VARCHAR(255) NOT NULL, -- armazene a senha já criptografada (bcrypt/argon2)
  Status          ENUM('Ativo','Inativo') NOT NULL DEFAULT 'Ativo',
  ID_Perfil       INT NOT NULL,
  CONSTRAINT fk_usuario_perfil
    FOREIGN KEY (ID_Perfil) REFERENCES Perfil(ID_Perfil)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  UNIQUE KEY uq_usuario_login (Login),
  UNIQUE KEY uq_usuario_email (Email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Beneficiario (
  ID_Beneficiario     INT AUTO_INCREMENT PRIMARY KEY,
  NomeCompleto        VARCHAR(160) NOT NULL,
  CPF                 VARCHAR(14)  NOT NULL, -- formate/valide na aplicação; aqui garantimos unicidade
  Endereco            VARCHAR(255) NULL,
  Contato             VARCHAR(120) NULL,
  DadosSocioeconomicos TEXT NULL,
  DataCadastro        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Status              ENUM('Pendente','Aprovado','Reprovado') NOT NULL DEFAULT 'Pendente',
  ID_UsuarioAprovador INT NULL,
  CONSTRAINT fk_benef_aprovador
    FOREIGN KEY (ID_UsuarioAprovador) REFERENCES Usuario(ID_Usuario)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  UNIQUE KEY uq_benef_cpf (CPF)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1:1 com Beneficiário (um cartão por beneficiário)
CREATE TABLE Cartao (
  ID_Cartao        INT AUTO_INCREMENT PRIMARY KEY,
  NumeroUnico      VARCHAR(64) NOT NULL,
  DataEmissao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ID_Beneficiario  INT NOT NULL,
  CONSTRAINT fk_cartao_benef
    FOREIGN KEY (ID_Beneficiario) REFERENCES Beneficiario(ID_Beneficiario)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  UNIQUE KEY uq_cartao_numero (NumeroUnico),
  UNIQUE KEY uq_cartao_benef (ID_Beneficiario)  -- garante 1:1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Categoria (
  ID_Categoria INT AUTO_INCREMENT PRIMARY KEY,
  Nome         VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_categoria_nome (Nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Item (
  ID_Item            INT AUTO_INCREMENT PRIMARY KEY,
  Descricao          VARCHAR(200) NOT NULL,
  QuantidadeEstoque  INT NOT NULL DEFAULT 0,
  CodigoEtiqueta     VARCHAR(64) NULL, -- código de barras / QR code (pode ser único, se desejar)
  ID_Categoria       INT NOT NULL,
  CONSTRAINT fk_item_categoria
    FOREIGN KEY (ID_Categoria) REFERENCES Categoria(ID_Categoria)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  UNIQUE KEY uq_item_codigo (CodigoEtiqueta),
  CHECK (QuantidadeEstoque >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Doador (
  ID_Doador   INT AUTO_INCREMENT PRIMARY KEY,
  Nome        VARCHAR(160) NOT NULL,
  CPF_CNPJ    VARCHAR(20)  NULL,
  Contato     VARCHAR(160) NULL,
  UNIQUE KEY uq_doador_cpfcnpj (CPF_CNPJ)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Doacao (
  ID_Doacao           INT AUTO_INCREMENT PRIMARY KEY,
  DataDoacao          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ID_UsuarioRecebedor INT NOT NULL,
  ID_Doador           INT NULL,
  CONSTRAINT fk_doacao_usuario
    FOREIGN KEY (ID_UsuarioRecebedor) REFERENCES Usuario(ID_Usuario)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_doacao_doador
    FOREIGN KEY (ID_Doador) REFERENCES Doador(ID_Doador)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  KEY idx_doacao_data (DataDoacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Retirada (
  ID_Retirada         INT AUTO_INCREMENT PRIMARY KEY,
  DataRetirada        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ID_Beneficiario     INT NOT NULL,
  ID_UsuarioAtendente INT NOT NULL,
  CONSTRAINT fk_retirada_benef
    FOREIGN KEY (ID_Beneficiario) REFERENCES Beneficiario(ID_Beneficiario)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_retirada_usuario
    FOREIGN KEY (ID_UsuarioAtendente) REFERENCES Usuario(ID_Usuario)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  KEY idx_retirada_data (DataRetirada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELAS ASSOCIATIVAS (N:M) COM REGRAS
-- =====================================================================

-- Doações contêm vários itens (entrada -> aumenta estoque)
CREATE TABLE Item_Doado (
  ID_Doacao   INT NOT NULL,
  ID_Item     INT NOT NULL,
  Quantidade  INT NOT NULL,
  PRIMARY KEY (ID_Doacao, ID_Item),
  CONSTRAINT fk_itemdoado_doacao
    FOREIGN KEY (ID_Doacao) REFERENCES Doacao(ID_Doacao)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_itemdoado_item
    FOREIGN KEY (ID_Item) REFERENCES Item(ID_Item)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CHECK (Quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Retiradas contêm vários itens (saída -> diminui estoque)
CREATE TABLE Item_Retirado (
  ID_Retirada INT NOT NULL,
  ID_Item     INT NOT NULL,
  Quantidade  INT NOT NULL,
  PRIMARY KEY (ID_Retirada, ID_Item),
  CONSTRAINT fk_itemret_retirada
    FOREIGN KEY (ID_Retirada) REFERENCES Retirada(ID_Retirada)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_itemret_item
    FOREIGN KEY (ID_Item) REFERENCES Item(ID_Item)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CHECK (Quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TRIGGERS DE ESTOQUE
-- Mantêm Item.QuantidadeEstoque consistente nas operações
-- sobre Item_Doado (entrada) e Item_Retirado (saída).
-- =====================================================================

DELIMITER $$

-- ---------- DOAÇÃO (ENTRADA) ----------
CREATE TRIGGER trg_item_doado_ai
AFTER INSERT ON Item_Doado
FOR EACH ROW
BEGIN
  UPDATE Item
    SET QuantidadeEstoque = QuantidadeEstoque + NEW.Quantidade
  WHERE ID_Item = NEW.ID_Item;
END$$

CREATE TRIGGER trg_item_doado_au
AFTER UPDATE ON Item_Doado
FOR EACH ROW
BEGIN
  -- Ajusta pelo delta (novo - antigo)
  UPDATE Item
    SET QuantidadeEstoque = QuantidadeEstoque + (NEW.Quantidade - OLD.Quantidade)
  WHERE ID_Item = NEW.ID_Item;
END$$

CREATE TRIGGER trg_item_doado_ad
AFTER DELETE ON Item_Doado
FOR EACH ROW
BEGIN
  UPDATE Item
    SET QuantidadeEstoque = QuantidadeEstoque - OLD.Quantidade
  WHERE ID_Item = OLD.ID_Item;
END$$

-- ---------- RETIRADA (SAÍDA) ----------
-- Antes de retirar, valida se há estoque suficiente
CREATE TRIGGER trg_item_retirado_bi
BEFORE INSERT ON Item_Retirado
FOR EACH ROW
BEGIN
  DECLARE estoque_atual INT;
  SELECT QuantidadeEstoque INTO estoque_atual FROM Item WHERE ID_Item = NEW.ID_Item FOR UPDATE;
  IF estoque_atual < NEW.Quantidade THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque insuficiente para a retirada';
  END IF;
END$$

CREATE TRIGGER trg_item_retirado_ai
AFTER INSERT ON Item_Retirado
FOR EACH ROW
BEGIN
  UPDATE Item
    SET QuantidadeEstoque = QuantidadeEstoque - NEW.Quantidade
  WHERE ID_Item = NEW.ID_Item;
END$$

-- Atualização: valida e aplica delta
CREATE TRIGGER trg_item_retirado_bu
BEFORE UPDATE ON Item_Retirado
FOR EACH ROW
BEGIN
  DECLARE estoque_atual INT;
  DECLARE delta INT;
  SET delta = NEW.Quantidade - OLD.Quantidade; -- se positivo, sairá mais; se negativo, "devolve"
  IF delta > 0 THEN
    SELECT QuantidadeEstoque INTO estoque_atual FROM Item WHERE ID_Item = NEW.ID_Item FOR UPDATE;
    IF estoque_atual < delta THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque insuficiente para atualizar a retirada';
    END IF;
  END IF;
END$$

CREATE TRIGGER trg_item_retirado_au
AFTER UPDATE ON Item_Retirado
FOR EACH ROW
BEGIN
  UPDATE Item
    SET QuantidadeEstoque = QuantidadeEstoque - (NEW.Quantidade - OLD.Quantidade)
  WHERE ID_Item = NEW.ID_Item;
END$$

-- Deleção: devolve estoque
CREATE TRIGGER trg_item_retirado_ad
AFTER DELETE ON Item_Retirado
FOR EACH ROW
BEGIN
  UPDATE Item
    SET QuantidadeEstoque = QuantidadeEstoque + OLD.Quantidade
  WHERE ID_Item = OLD.ID_Item;
END$$

DELIMITER ;

-- =====================================================================
-- ÍNDICES ÚTEIS (BUSCAS COMUNS)
-- =====================================================================

CREATE INDEX idx_benef_nome    ON Beneficiario (NomeCompleto);
CREATE INDEX idx_item_desc     ON Item (Descricao);
CREATE INDEX idx_item_cat      ON Item (ID_Categoria);
CREATE INDEX idx_doacao_user   ON Doacao (ID_UsuarioRecebedor);
CREATE INDEX idx_retirada_user ON Retirada (ID_UsuarioAtendente);
