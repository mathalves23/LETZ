#!/bin/bash

# 🚀 Script de Inicialização do LETZ
# Inicia backend e frontend com as configurações corretas

echo "🎉 Iniciando LETZ - Organizador de Eventos"
echo "=========================================="

# Verificar se estamos no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto LETZ"
    exit 1
fi

# Função para verificar se uma porta está em uso
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        echo "⚠️  Porta $port já está em uso"
        return 1
    fi
    return 0
}

# Verificar portas
echo "🔍 Verificando portas..."
if ! check_port 5005; then
    echo "❌ Porta 5005 (backend) já está em uso. Pare o processo ou use outra porta."
    exit 1
fi

if ! check_port 3000; then
    echo "⚠️  Porta 3000 (frontend) já está em uso. O React pode usar outra porta automaticamente."
fi

# Iniciar Backend
echo ""
echo "🔧 Iniciando Backend (porta 5005)..."
cd backend
nohup mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend iniciado com PID: $BACKEND_PID"
cd ..

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
for i in {1..30}; do
    if curl -s http://localhost:5005/api/health > /dev/null 2>&1; then
        echo "✅ Backend funcionando!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend não iniciou em 30 segundos"
        echo "📋 Verifique o log: tail -f backend.log"
        exit 1
    fi
    sleep 1
    echo -n "."
done

# Iniciar Frontend
echo ""
echo "🎨 Iniciando Frontend (porta 3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
echo "Frontend iniciado com PID: $FRONTEND_PID"
cd ..

# Aguardar frontend inicializar
echo "⏳ Aguardando frontend inicializar..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend funcionando!"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ Frontend não iniciou em 60 segundos"
        echo "📋 Verifique se as dependências estão instaladas: cd frontend && npm install"
        exit 1
    fi
    sleep 1
    echo -n "."
done

echo ""
echo "🎉 LETZ iniciado com sucesso!"
echo "=========================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5005/api"
echo "📚 Swagger: http://localhost:5005/api/swagger-ui.html"
echo "🗄️ H2 Console: http://localhost:5005/api/h2-console"
echo ""
echo "👥 Usuários de teste:"
echo "   - admin@letz.com / admin123"
echo "   - joao@exemplo.com / admin123"
echo "   - maria@exemplo.com / admin123"
echo "   - pedro@exemplo.com / admin123"
echo ""
echo "📋 Logs:"
echo "   - Backend: tail -f backend.log"
echo "   - Frontend: logs no terminal"
echo ""
echo "🛑 Para parar:"
echo "   - Backend: kill $BACKEND_PID"
echo "   - Frontend: Ctrl+C no terminal do npm"
echo ""
echo "✨ Bom desenvolvimento!" 