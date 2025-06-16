#!/bin/bash

echo "🧪 Testando Sistema LETZ..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se um serviço está rodando
check_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${BLUE}Verificando $service_name...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service_name está rodando!${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Tentativa $attempt/$max_attempts - Aguardando $service_name...${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}❌ $service_name não está respondendo após $max_attempts tentativas${NC}"
    return 1
}

# Verificar Backend
echo -e "${BLUE}🔧 Verificando Backend...${NC}"
if check_service "http://localhost:8080/api/health" "Backend (Spring Boot)"; then
    echo -e "${GREEN}Backend está funcionando!${NC}"
    
    # Testar endpoint de health
    echo -e "${BLUE}📊 Testando endpoint de health...${NC}"
    curl -s http://localhost:8080/api/health | jq '.' || echo "Resposta recebida (jq não disponível)"
else
    echo -e "${RED}❌ Backend não está funcionando${NC}"
    exit 1
fi

# Verificar Frontend
echo -e "\n${BLUE}🎨 Verificando Frontend...${NC}"
if check_service "http://localhost:3000" "Frontend (React)"; then
    echo -e "${GREEN}Frontend está funcionando!${NC}"
else
    echo -e "${RED}❌ Frontend não está funcionando${NC}"
    exit 1
fi

# Testar registro de usuário
echo -e "\n${BLUE}👤 Testando registro de usuário...${NC}"
register_response=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Teste",
    "lastName": "Usuario",
    "username": "teste_user",
    "email": "teste@letz.com",
    "password": "123456"
  }')

if echo "$register_response" | grep -q "token"; then
    echo -e "${GREEN}✅ Registro de usuário funcionando!${NC}"
    
    # Extrair token para próximos testes
    token=$(echo "$register_response" | jq -r '.token' 2>/dev/null || echo "")
    
    if [ ! -z "$token" ] && [ "$token" != "null" ]; then
        echo -e "${GREEN}✅ Token JWT gerado com sucesso!${NC}"
        
        # Testar endpoint protegido
        echo -e "\n${BLUE}🔒 Testando endpoint protegido...${NC}"
        protected_response=$(curl -s -H "Authorization: Bearer $token" http://localhost:8080/api/users/me)
        
        if echo "$protected_response" | grep -q "email"; then
            echo -e "${GREEN}✅ Autenticação JWT funcionando!${NC}"
        else
            echo -e "${YELLOW}⚠️  Endpoint protegido pode ter problemas${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Registro pode ter problemas, mas serviços estão rodando${NC}"
fi

echo -e "\n${GREEN}🎉 Teste do sistema concluído!${NC}"
echo -e "${BLUE}📱 Acesse: http://localhost:3000${NC}"
echo -e "${BLUE}🔧 API: http://localhost:8080/api${NC}"
echo -e "${BLUE}📚 Swagger: http://localhost:8080/api/swagger-ui.html${NC}"

# Mostrar logs recentes se houver problemas
if [ $? -ne 0 ]; then
    echo -e "\n${YELLOW}📋 Logs recentes do backend:${NC}"
    tail -20 backend/logs/application.log 2>/dev/null || echo "Logs não encontrados"
fi 