# 🚀 Guia de Integração Frontend + Backend

## 📋 Resumo das Alterações

### ✅ **Backend (Spring Boot)**
- **Base URL**: `http://localhost:8080/api`
- **Endpoints disponíveis**:
  - `/donor` - CRUD para doadores
  - `/item` - CRUD para itens/estoque
  - `/user` - CRUD para usuários
  - `/category` - CRUD para categorias
  - `/profile` - CRUD para perfis
  - `/card` - CRUD para cartões
  - `/beneficiary` - CRUD para beneficiários (NOVO)

### ✅ **Frontend (Next.js)**
- **Removido**: Uso de `localStorage` para persistência
- **Adicionado**: Integração completa com APIs do backend
- **Melhorado**: Sistema de autenticação (removida senha hardcoded)
- **Criado**: Serviços de API, hooks personalizados, mapeadores de dados

## 🛠️ Como Executar

### 1. **Backend (Spring Boot)**
```bash
cd backend
./mvnw spring-boot:run
# ou
mvn spring-boot:run
```

**Configuração do Banco:**
- MariaDB/MySQL na porta 3306
- Database: `javalovers`
- Usuário: `root`
- Senha: `root`

### 2. **Frontend (Next.js)**
```bash
cd frontend
npm install
npm run dev
```

**Configuração da API:**
- Crie um arquivo `.env.local` na pasta `frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🔧 Estrutura de Arquivos Criados/Modificados

### **Novos Arquivos Frontend:**
```
frontend/src/
├── services/
│   ├── api.js              # Serviço principal de API
│   └── authService.js      # Serviço de autenticação
├── hooks/
│   └── useApi.js           # Hook personalizado para APIs
├── config/
│   └── api.js              # Configuração da API
└── components/
    └── ProtectedRoute.js   # Componente de proteção de rotas
```

### **Arquivos Modificados:**
- `frontend/src/app/page.js` - Login refatorado
- `frontend/src/app/cadastrodoador/page.js` - Integração com API
- `frontend/src/app/cadastrodoador/lista/page.js` - Integração com API
- `frontend/src/app/cadastrobeneficiario/page.js` - Integração com API
- `frontend/src/app/cadastrobeneficiario/lista/page.js` - Integração com API
- `frontend/src/app/estoque/page.js` - Integração com API

### **Novos Arquivos Backend:**
- `backend/src/main/java/com/javalovers/core/beneficiary/controller/BeneficiaryController.java`

## 🔄 Mapeamento de Dados

### **Doadores (Donor)**
```javascript
// Frontend → Backend
{
  nomeCompleto: "João Silva",
  cpf: "12345678901",
  telefoneCelular: "11999999999"
}
↓
{
  name: "João Silva",
  cpfCnpj: "12345678901",
  contact: "11999999999"
}
```

### **Itens (Item)**
```javascript
// Frontend → Backend
{
  nome: "Produto A",
  categoria: "Roupas",
  quantidade: 10
}
↓
{
  name: "Produto A",
  description: "",
  quantity: 10,
  categoryId: null
}
```

### **Beneficiários (Beneficiary)**
```javascript
// Frontend → Backend
{
  nomeCompleto: "Maria Santos",
  cpfCrnm: "98765432100",
  telefoneCelular: "11888888888",
  endereco: "Rua A, 123"
}
↓
{
  fullName: "Maria Santos",
  cpf: "98765432100",
  phone: "11888888888",
  socioeconomicData: '{"endereco":"Rua A, 123"}',
  registrationDate: "2024-01-01T00:00:00Z",
  beneficiaryStatus: "PENDING"
}
```

## 🔐 Sistema de Autenticação

### **Antes:**
- Senha hardcoded: `"1234"`
- Sem validação de usuário
- Sem integração com backend

### **Depois:**
- Sistema de autenticação baseado em token
- Validação de usuário e senha
- Persistência de sessão
- Proteção de rotas

## 🧪 Testando a Integração

### 1. **Teste de Login**
1. Acesse `http://localhost:3000`
2. Digite qualquer usuário e senha
3. Deve redirecionar para `/home`

### 2. **Teste de Cadastro de Doador**
1. Acesse `/cadastrodoador`
2. Preencha o formulário
3. Verifique se os dados são salvos no banco

### 3. **Teste de Lista de Doadores**
1. Acesse `/cadastrodoador/lista`
2. Verifique se os dados são carregados do banco
3. Teste edição e exclusão

### 4. **Teste de Estoque**
1. Acesse `/estoque`
2. Adicione, edite e exclua itens
3. Verifique se as operações são persistidas

## 🚨 Problemas Conhecidos

1. **Beneficiários**: O controller foi criado, mas pode precisar de ajustes nos DTOs
2. **Voluntários**: Ainda usa localStorage (precisa ser refatorado)
3. **Autenticação**: Sistema mock - precisa implementar JWT real
4. **Validação**: Algumas validações do frontend podem não coincidir com o backend

## 🔄 Próximos Passos

1. **Implementar JWT real** no backend
2. **Refatorar voluntários** para usar API
3. **Adicionar tratamento de erros** mais robusto
4. **Implementar paginação** nas listas
5. **Adicionar testes** de integração
6. **Configurar CORS** adequadamente
7. **Implementar refresh token**

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o backend está rodando na porta 8080
2. Verifique se o banco de dados está configurado corretamente
3. Verifique os logs do console do navegador
4. Verifique os logs do Spring Boot
