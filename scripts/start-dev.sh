#!/bin/bash

# Script para inicializar o ambiente de desenvolvimento do LETZ
echo "🚀 Iniciando ambiente de desenvolvimento LETZ..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Iniciar serviços de infraestrutura
echo "🐳 Iniciando serviços de infraestrutura..."
docker-compose up -d

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Verificar se PostgreSQL está respondendo
until docker-compose exec -T postgres pg_isready -U letz_user -d letz_db; do
    echo "⏳ Aguardando PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Executar script de inicialização do banco
echo "📊 Executando script de inicialização do banco..."
docker-compose exec -T postgres psql -U letz_user -d letz_db -f /docker-entrypoint-initdb.d/init.sql

echo "✅ Ambiente de desenvolvimento iniciado com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "   🗄️  PostgreSQL: localhost:5432"
echo "   🔧 pgAdmin: http://localhost:5050 (admin@letz.com / admin123)"
echo "   🔄 Redis: localhost:6379"
echo ""
echo "👥 Usuários de teste:"
echo "   👑 Admin: admin@letz.com / admin123"
echo "   👤 João: joao@exemplo.com / admin123"
echo "   👤 Maria: maria@exemplo.com / admin123"
echo "   👤 Pedro: pedro@exemplo.com / admin123"
echo ""
echo "🚀 Para iniciar o backend:"
echo "   cd backend && mvn spring-boot:run"
echo ""
echo "🎨 Para iniciar o frontend:"
echo "   cd frontend && npm start"
echo ""
echo "📚 Documentação da API: http://localhost:8080/api/swagger-ui.html" 