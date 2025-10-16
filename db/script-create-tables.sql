-- =====================================================================
-- ESQUEMA: Sistema de Doações / Beneficiários
-- Requisitos: MySQL 8.0+
-- =====================================================================

-- Opcional: crie um schema dedicado
CREATE DATABASE IF NOT EXISTS sanem
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE sanem;

-- =====================================================================
-- TABELAS BÁSICAS
-- =====================================================================

CREATE TABLE profile (
  profile_id       INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  description       VARCHAR(255) NULL,
  UNIQUE KEY uq_profile_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE app_user (
  user_id      INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(120) NOT NULL,
  login           VARCHAR(60)  NOT NULL,
  email           VARCHAR(160) NOT NULL,
  password_hash       VARCHAR(255) NOT NULL, -- armazene a senha já criptografada (bcrypt/argon2)
  status          ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  profile_id       INT NOT NULL,
  CONSTRAINT fk_user_profile
    FOREIGN KEY (profile_id) REFERENCES profile(profile_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  UNIQUE KEY uq_user_login (login),
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE beneficiary (
  beneficiary_id     INT AUTO_INCREMENT PRIMARY KEY,
  full_name        VARCHAR(160) NOT NULL,
  cpf                 VARCHAR(14)  NOT NULL, -- formate/valide na aplicação; aqui garantimos unicidade
  address            VARCHAR(255) NULL,
  phone             VARCHAR(120) NULL,
  socioeconomic_data TEXT NULL,
  beneficiary_status              ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  approver_user_id INT NULL,
  CONSTRAINT fk_benef_approver
    FOREIGN KEY (approver_user_id) REFERENCES app_user(user_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  UNIQUE KEY uq_benef_cpf (cpf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1:1 com Beneficiário (um cartão por beneficiário)
CREATE TABLE card (
  card_id        INT AUTO_INCREMENT PRIMARY KEY,
  unique_number      VARCHAR(64) NOT NULL,
  beneficiary_id  INT NOT NULL,
  CONSTRAINT fk_card_benef
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  UNIQUE KEY uq_card_number (unique_number),
  UNIQUE KEY uq_card_benef (beneficiary_id)  -- garante 1:1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE category (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_category_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE item (
  item_id            INT AUTO_INCREMENT PRIMARY KEY,
  description          VARCHAR(200) NOT NULL,
  stock_quantity  INT NOT NULL DEFAULT 0,
  tag_code     VARCHAR(64) NULL, -- código de barras / QR code (pode ser único, se desejar)
  category_id       INT NOT NULL,
  CONSTRAINT fk_item_category
    FOREIGN KEY (category_id) REFERENCES category(category_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  UNIQUE KEY uq_item_code (tag_code),
  CHECK (stock_quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE donor (
  donor_id   INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(160) NOT NULL,
  cpf_cnpj    VARCHAR(20)  NULL,
  contact     VARCHAR(160) NULL,
  UNIQUE KEY uq_donor_cpfcnpj (cpf_cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE donation (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  receiver_user_id INT NOT NULL,
  donor_id           INT NULL,
  CONSTRAINT fk_donation_user
    FOREIGN KEY (receiver_user_id) REFERENCES app_user(user_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_donation_donor
    FOREIGN KEY (donor_id) REFERENCES donor(donor_id)
    ON UPDATE RESTRICT ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE withdrawal (
  withdrawal_id         INT AUTO_INCREMENT PRIMARY KEY,
  beneficiary_id     INT NOT NULL,
  attendant_user_id INT NOT NULL,
  CONSTRAINT fk_withdrawal_benef
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiary(beneficiary_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_withdrawal_user
    FOREIGN KEY (attendant_user_id) REFERENCES app_user(user_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TABELAS ASSOCIATIVAS (N:M) COM REGRAS
-- =====================================================================

-- Doações contêm vários itens (entrada -> aumenta estoque)
CREATE TABLE item_donated (
  donation_id   INT NOT NULL,
  item_id     INT NOT NULL,
  quantity  INT NOT NULL,
  PRIMARY KEY (donation_id, item_id),
  CONSTRAINT fk_itemdonated_donation
    FOREIGN KEY (donation_id) REFERENCES donation(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_itemdonated_item
    FOREIGN KEY (item_id) REFERENCES item(item_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Retiradas contêm vários itens (saída -> diminui estoque)
CREATE TABLE item_withdrawn (
  withdrawal_id INT NOT NULL,
  item_id     INT NOT NULL,
  quantity  INT NOT NULL,
  PRIMARY KEY (withdrawal_id, item_id),
  CONSTRAINT fk_itemwithdrawn_withdrawal
    FOREIGN KEY (withdrawal_id) REFERENCES withdrawal(withdrawal_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_itemwithdrawn_item
    FOREIGN KEY (item_id) REFERENCES item(item_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- TRIGGERS DE ESTOQUE
-- Mantêm Item.QuantidadeEstoque consistente nas operações
-- sobre Item_Doado (entrada) e Item_Retirado (saída).
-- =====================================================================

DELIMITER $$

-- ---------- DOAÇÃO (ENTRADA) ----------
CREATE TRIGGER trg_item_donated_ai
AFTER INSERT ON item_donated
FOR EACH ROW
BEGIN
  UPDATE item
    SET stock_quantity = stock_quantity + NEW.quantity
  WHERE item_id = NEW.item_id;
END$$

CREATE TRIGGER trg_item_donated_au
AFTER UPDATE ON item_donated
FOR EACH ROW
BEGIN
  -- Ajusta pelo delta (novo - antigo)
  UPDATE item
    SET stock_quantity = stock_quantity + (NEW.quantity - OLD.quantity)
  WHERE item_id = NEW.item_id;
END$$

CREATE TRIGGER trg_item_donated_ad
AFTER DELETE ON item_donated
FOR EACH ROW
BEGIN
  UPDATE item
    SET stock_quantity = stock_quantity - OLD.quantity
  WHERE item_id = OLD.item_id;
END$$

-- ---------- RETIRADA (SAÍDA) ----------
-- Antes de retirar, valida se há estoque suficiente
CREATE TRIGGER trg_item_withdrawn_bi
BEFORE INSERT ON item_withdrawn
FOR EACH ROW
BEGIN
  DECLARE estoque_atual INT;
  SELECT stock_quantity INTO estoque_atual FROM item WHERE item_id = NEW.item_id FOR UPDATE;
  IF estoque_atual < NEW.quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque insuficiente para a retirada';
  END IF;
END$$

CREATE TRIGGER trg_item_withdrawn_ai
AFTER INSERT ON item_withdrawn
FOR EACH ROW
BEGIN
  UPDATE item
    SET stock_quantity = stock_quantity - NEW.quantity
  WHERE item_id = NEW.item_id;
END$$

-- Atualização: valida e aplica delta
CREATE TRIGGER trg_item_withdrawn_bu
BEFORE UPDATE ON item_withdrawn
FOR EACH ROW
BEGIN
  DECLARE estoque_atual INT;
  DECLARE delta INT;
  SET delta = NEW.quantity - OLD.quantity; -- se positivo, sairá mais; se negativo, "devolve"
  IF delta > 0 THEN
    SELECT stock_quantity INTO estoque_atual FROM item WHERE item_id = NEW.item_id FOR UPDATE;
    IF estoque_atual < delta THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque insuficiente para atualizar a retirada';
    END IF;
  END IF;
END$$

CREATE TRIGGER trg_item_withdrawn_au
AFTER UPDATE ON item_withdrawn
FOR EACH ROW
BEGIN
  UPDATE item
    SET stock_quantity = stock_quantity - (NEW.quantity - OLD.quantity)
  WHERE item_id = NEW.item_id;
END$$

-- Deleção: devolve estoque
CREATE TRIGGER trg_item_withdrawn_ad
AFTER DELETE ON item_withdrawn
FOR EACH ROW
BEGIN
  UPDATE item
    SET stock_quantity = stock_quantity + OLD.quantity
  WHERE item_id = OLD.item_id;
END$$

DELIMITER ;

-- =====================================================================
-- ÍNDICES ÚTEIS (BUSCAS COMUNS)
-- =====================================================================

CREATE INDEX idx_benef_name    ON beneficiary (full_name);
CREATE INDEX idx_item_desc     ON item (description);
CREATE INDEX idx_item_cat      ON item (category_id);
CREATE INDEX idx_donation_user   ON donation (receiver_user_id);
CREATE INDEX idx_withdrawal_user ON withdrawal (attendant_user_id);
