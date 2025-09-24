USE doacoes;

-- ========================
-- PERFIL
-- ========================
INSERT INTO Perfil (Nome, Descricao) VALUES
                                         ('Administrador', 'Acesso total ao sistema'),
                                         ('Atendente', 'Realiza cadastros e retiradas'),
                                         ('Avaliador', 'Aprova ou reprova beneficiários');

-- ========================
-- USUÁRIO
-- (senha simulada com hash fictício)
-- ========================
INSERT INTO Usuario (Nome, Login, Email, SenhaHash, Status, ID_Perfil) VALUES
                                                                           ('Ana Souza', 'ana', 'ana@email.com', '$2a$10$hash1', 'Ativo', 1),
                                                                           ('Bruno Lima', 'bruno', 'bruno@email.com', '$2a$10$hash2', 'Ativo', 2),
                                                                           ('Carlos Mendes', 'carlos', 'carlos@email.com', '$2a$10$hash3', 'Ativo', 3);

-- ========================
-- BENEFICIÁRIO
-- ========================
INSERT INTO Beneficiario (NomeCompleto, CPF, Endereco, Contato, DadosSocioeconomicos, Status, ID_UsuarioAprovador)
VALUES
    ('Maria Oliveira', '111.111.111-11', 'Rua A, 123', '11-99999-1111', 'Baixa renda', 'Aprovado', 3),
    ('José Santos', '222.222.222-22', 'Rua B, 456', '11-99999-2222', 'Situação de vulnerabilidade', 'Pendente', NULL),
    ('Clara Silva', '333.333.333-33', 'Rua C, 789', '11-99999-3333', 'Desempregada', 'Reprovado', 3);

-- ========================
-- CARTÃO (1:1 com beneficiário aprovado/reprovado)
-- ========================
INSERT INTO Cartao (NumeroUnico, ID_Beneficiario) VALUES
                                                      ('CARD-001', 1),
                                                      ('CARD-002', 2),
                                                      ('CARD-003', 3);

-- ========================
-- CATEGORIA
-- ========================
INSERT INTO Categoria (Nome) VALUES
                                 ('Alimentos'),
                                 ('Roupas'),
                                 ('Higiene');

-- ========================
-- ITEM
-- ========================
INSERT INTO Item (Descricao, QuantidadeEstoque, CodigoEtiqueta, ID_Categoria) VALUES
                                                                                  ('Arroz 5kg', 50, 'ETQ-ARROZ-01', 1),
                                                                                  ('Camiseta M', 30, 'ETQ-CAMISETA-01', 2),
                                                                                  ('Sabonete 90g', 100, 'ETQ-SABONETE-01', 3);

-- ========================
-- DOADOR
-- ========================
INSERT INTO Doador (Nome, CPF_CNPJ, Contato) VALUES
                                                 ('Supermercado Bom Preço', '12.345.678/0001-99', '11-4002-8922'),
                                                 ('Maria Costa', '444.444.444-44', '11-98888-4444'),
                                                 ('Associação Solidária', '98.765.432/0001-11', '11-97777-1234');

-- ========================
-- DOAÇÃO
-- ========================
INSERT INTO Doacao (ID_UsuarioRecebedor, ID_Doador) VALUES
                                                        (2, 1), -- Bruno recebe doação do supermercado
                                                        (2, 2), -- Bruno recebe doação da Maria
                                                        (1, 3); -- Ana recebe doação da associação

-- ========================
-- RETIRADA
-- ========================
INSERT INTO Retirada (ID_Beneficiario, ID_UsuarioAtendente) VALUES
                                                                (1, 2), -- Bruno atende Maria
                                                                (2, 2), -- Bruno atende José
                                                                (3, 2); -- Bruno atende Clara

-- ========================
-- ITEM_DOADO (entrada → aumenta estoque)
-- ========================
INSERT INTO Item_Doado (ID_Doacao, ID_Item, Quantidade) VALUES
                                                            (1, 1, 10), -- 10 sacos de arroz
                                                            (2, 2, 5),  -- 5 camisetas
                                                            (3, 3, 20); -- 20 sabonetes

-- ========================
-- ITEM_RETIRADO (saída → diminui estoque)
-- ========================
INSERT INTO Item_Retirado (ID_Retirada, ID_Item, Quantidade) VALUES
                                                                 (1, 1, 2), -- Maria retira 2 sacos de arroz
                                                                 (2, 2, 1), -- José retira 1 camiseta
                                                                 (3, 3, 3); -- Clara retira 3 sabonetes

USE doacoes;

-- ========================
-- PERFIL
-- ========================
INSERT INTO Perfil (Nome, Descricao) VALUES
                                         ('Administrador', 'Acesso total ao sistema'),
                                         ('Atendente', 'Realiza cadastros e retiradas'),
                                         ('Avaliador', 'Aprova ou reprova beneficiários');

-- ========================
-- USUÁRIO
-- (senha simulada com hash fictício)
-- ========================
INSERT INTO Usuario (Nome, Login, Email, SenhaHash, Status, ID_Perfil) VALUES
                                                                           ('Ana Souza', 'ana', 'ana@email.com', '$2a$10$hash1', 'Ativo', 1),
                                                                           ('Bruno Lima', 'bruno', 'bruno@email.com', '$2a$10$hash2', 'Ativo', 2),
                                                                           ('Carlos Mendes', 'carlos', 'carlos@email.com', '$2a$10$hash3', 'Ativo', 3);

-- ========================
-- BENEFICIÁRIO
-- ========================
INSERT INTO Beneficiario (NomeCompleto, CPF, Endereco, Contato, DadosSocioeconomicos, Status, ID_UsuarioAprovador)
VALUES
    ('Maria Oliveira', '111.111.111-11', 'Rua A, 123', '11-99999-1111', 'Baixa renda', 'Aprovado', 3),
    ('José Santos', '222.222.222-22', 'Rua B, 456', '11-99999-2222', 'Situação de vulnerabilidade', 'Pendente', NULL),
    ('Clara Silva', '333.333.333-33', 'Rua C, 789', '11-99999-3333', 'Desempregada', 'Reprovado', 3);

-- ========================
-- CARTÃO (1:1 com beneficiário aprovado/reprovado)
-- ========================
INSERT INTO Cartao (NumeroUnico, ID_Beneficiario) VALUES
                                                      ('CARD-001', 1),
                                                      ('CARD-002', 2),
                                                      ('CARD-003', 3);

-- ========================
-- CATEGORIA
-- ========================
INSERT INTO Categoria (Nome) VALUES
                                 ('Alimentos'),
                                 ('Roupas'),
                                 ('Higiene');

-- ========================
-- ITEM
-- ========================
INSERT INTO Item (Descricao, QuantidadeEstoque, CodigoEtiqueta, ID_Categoria) VALUES
                                                                                  ('Arroz 5kg', 50, 'ETQ-ARROZ-01', 1),
                                                                                  ('Camiseta M', 30, 'ETQ-CAMISETA-01', 2),
                                                                                  ('Sabonete 90g', 100, 'ETQ-SABONETE-01', 3);

-- ========================
-- DOADOR
-- ========================
INSERT INTO Doador (Nome, CPF_CNPJ, Contato) VALUES
                                                 ('Supermercado Bom Preço', '12.345.678/0001-99', '11-4002-8922'),
                                                 ('Maria Costa', '444.444.444-44', '11-98888-4444'),
                                                 ('Associação Solidária', '98.765.432/0001-11', '11-97777-1234');

-- ========================
-- DOAÇÃO
-- ========================
INSERT INTO Doacao (ID_UsuarioRecebedor, ID_Doador) VALUES
                                                        (2, 1), -- Bruno recebe doação do supermercado
                                                        (2, 2), -- Bruno recebe doação da Maria
                                                        (1, 3); -- Ana recebe doação da associação

-- ========================
-- RETIRADA
-- ========================
INSERT INTO Retirada (ID_Beneficiario, ID_UsuarioAtendente) VALUES
                                                                (1, 2), -- Bruno atende Maria
                                                                (2, 2), -- Bruno atende José
                                                                (3, 2); -- Bruno atende Clara

-- ========================
-- ITEM_DOADO (entrada → aumenta estoque)
-- ========================
INSERT INTO Item_Doado (ID_Doacao, ID_Item, Quantidade) VALUES
                                                            (1, 1, 10), -- 10 sacos de arroz
                                                            (2, 2, 5),  -- 5 camisetas
                                                            (3, 3, 20); -- 20 sabonetes

-- ========================
-- ITEM_RETIRADO (saída → diminui estoque)
-- ========================
INSERT INTO Item_Retirado (ID_Retirada, ID_Item, Quantidade) VALUES
                                                                 (1, 1, 2), -- Maria retira 2 sacos de arroz
                                                                 (2, 2, 1), -- José retira 1 camiseta
                                                                 (3, 3, 3); -- Clara retira 3 sabonetes

