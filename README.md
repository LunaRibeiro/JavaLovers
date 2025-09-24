# SanemTech 🏥

Projeto para a disciplina de Oficina de Desenvolvimento de Software da UTFPR - Campus Medianeira

O sistema **SanemTech** é uma plataforma de gestão projetada para uma organização de assistência social (como um brechó beneficente) para controlar o fluxo de doações e a distribuição de itens para pessoas necessitadas.

Uma aplicação web moderna desenvolvida com **Java Spring Boot** no backend e **React** no frontend, demonstrando as melhores práticas de desenvolvimento de software.

## 🎯 Sobre o Sistema

### Principais Funcionalidades

#### 👥 Gestão de Beneficiários

- Cadastrar, aprovar e consultar o histórico de pessoas e famílias atendidas
- Emitir cartões de identificação para agilizar o atendimento
- Controle completo do perfil dos beneficiários

#### 📦 Controle de Doações e Estoque

- Registrar os itens recebidos em doação
- Catalogar produtos com códigos únicos
- Gerenciar a quantidade de produtos disponíveis no estoque
- Controle de entrada e saída de itens

#### 🎁 Distribuição de Itens

- Registrar a retirada de itens por um beneficiário
- Baixa automática no estoque
- Aplicação de regras como limite mensal de retiradas
- Controle de distribuição por período

#### 👨‍💼 Administração e Relatórios

- Gerenciar usuários com diferentes permissões (Atendente e Administrador)
- Gerar relatórios detalhados sobre doações
- Relatórios de distribuições e posição do estoque
- Análise completa da operação

## 🚀 Tecnologias Utilizadas

### Backend

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **MySQL 8.0** - Banco de dados
- **JWT** - Tokens de autenticação
- **Maven** - Gerenciamento de dependências

### Frontend

- **React 18**
- **React Router DOM** - Roteamento
- **Styled Components** - Estilização
- **React Hook Form** - Gerenciamento de formulários
- **React Query** - Gerenciamento de estado do servidor
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
JavaLovers/
├── backend/                    # Backend Java Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/javalovers/
│   │   │   │   ├── JavaLoversApplication.java
│   │   │   │   └── config/
│   │   │   │       └── SecurityConfig.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                   # Frontend React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Header.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── Dashboard.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── Dockerfile
├── Banco de Dados/            # Scripts do banco de dados
│   ├── Diagrama MER.pdf
│   ├── script-create-tables.sql
│   └── script-insert-values.sql
├── docker-compose.yml         # Orquestração dos containers
├── .gitignore
└── README.md
```

## 🛠️ Configuração e Execução

### Pré-requisitos

- Java 17 ou superior
- Node.js 18 ou superior
- MySQL 8.0 ou superior
- Docker e Docker Compose (opcional)

### Execução com Docker (Recomendado)

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd JavaLovers
   ```

2. **Execute com Docker Compose**

   ```bash
   docker-compose up -d
   ```

3. **Acesse a aplicação**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - MySQL: localhost:3306

### Execução Manual

#### Backend

1. **Navegue para a pasta do backend**

   ```bash
   cd backend
   ```

2. **Configure o banco de dados**

   - Crie um banco de dados MySQL chamado `javalovers`
   - Execute os scripts SQL na pasta `Banco de Dados/`

3. **Configure as credenciais do banco**

   - Edite o arquivo `src/main/resources/application.yml`
   - Atualize as credenciais do MySQL

4. **Execute a aplicação**
   ```bash
   mvn spring-boot:run
   ```

#### Frontend

1. **Navegue para a pasta do frontend**

   ```bash
   cd frontend
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Execute a aplicação**
   ```bash
   npm start
   ```

## 🔧 Configuração do Banco de Dados

### Criação do Banco

```sql
CREATE DATABASE javalovers;
```

### Configuração das Credenciais

No arquivo `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/javalovers?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: seu_usuario
    password: sua_senha
```

## 📚 Funcionalidades

### Implementadas

- ✅ Estrutura base do backend Spring Boot
- ✅ Configuração de segurança com Spring Security
- ✅ Interface React moderna e responsiva
- ✅ Páginas de Login e Cadastro
- ✅ Dashboard do usuário
- ✅ Configuração de CORS
- ✅ Containerização com Docker

### Em Desenvolvimento

#### 👥 Gestão de Beneficiários

- 🔄 CRUD completo de beneficiários
- 🔄 Sistema de aprovação de cadastros
- 🔄 Geração de cartões de identificação
- 🔄 Histórico de atendimentos

#### 📦 Controle de Estoque

- 🔄 Cadastro de itens doados
- 🔄 Sistema de códigos únicos
- 🔄 Controle de entrada e saída
- 🔄 Alertas de estoque baixo

#### 🎁 Sistema de Distribuição

- 🔄 Registro de retiradas
- 🔄 Controle de limites mensais
- 🔄 Baixa automática no estoque
- 🔄 Validação de regras de distribuição

#### 👨‍💼 Administração

- 🔄 Sistema de permissões (Atendente/Administrador)
- 🔄 Gestão de usuários
- 🔄 Relatórios de doações
- 🔄 Relatórios de distribuições
- 🔄 Dashboard administrativo

#### 🔧 Infraestrutura

- 🔄 Sistema de autenticação JWT
- 🔄 Integração frontend-backend
- 🔄 Validação de formulários
- 🔄 Testes unitários e de integração

## 🧪 Testes

### Backend

```bash
cd backend
mvn test
```

### Frontend

```bash
cd frontend
npm test
```

## 📦 Build para Produção

### Backend

```bash
cd backend
mvn clean package
```

### Frontend

```bash
cd frontend
npm run build
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe SanemTech
- **Disciplina**: Oficina de Desenvolvimento de Software
- **Instituição**: UTFPR - Campus Medianeira

- **Alunos**: Emilly Pessutti, Luna Santos, Rafael Tomkowski, Vitor Paladini

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub.

---

**Desenvolvido com ❤️ pelos JavaLovers para auxiliar organizações de assistência social**
