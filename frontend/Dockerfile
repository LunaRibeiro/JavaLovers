# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o código fonte
COPY . .

# Constrói a aplicação Next.js
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Define o comando para iniciar a aplicação
CMD ["npm", "start"]
