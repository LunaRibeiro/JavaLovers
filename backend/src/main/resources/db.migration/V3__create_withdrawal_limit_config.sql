CREATE TABLE withdrawal_limit_config (
    config_id BIGSERIAL PRIMARY KEY,
    monthly_item_limit INT NOT NULL DEFAULT 10 CHECK (monthly_item_limit > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configuração padrão
INSERT INTO withdrawal_limit_config (monthly_item_limit, is_active) VALUES (10, TRUE);

