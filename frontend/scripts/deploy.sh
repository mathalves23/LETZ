#!/bin/bash

# Script de Deploy LETZ para Netlify
echo "🚀 Iniciando deploy do LETZ para Netlify..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório frontend/"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Executar testes (opcional)
echo "🧪 Executando testes..."
npm run test:ci || echo "⚠️  Alguns testes falharam, continuando..."

# Build de produção
echo "🔨 Criando build de produção..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build criado com sucesso!"
    
    # Verificar se Netlify CLI está instalado
    if command -v netlify &> /dev/null; then
        echo "🌐 Fazendo deploy no Netlify..."
        netlify deploy --prod --dir=build
        
        if [ $? -eq 0 ]; then
            echo "🎉 Deploy realizado com sucesso!"
            echo "🔗 Acesse sua aplicação no link fornecido acima"
        else
            echo "❌ Erro no deploy. Verifique suas configurações do Netlify."
        fi
    else
        echo "⚠️  Netlify CLI não encontrado."
        echo "📋 Para instalar: npm install -g netlify-cli"
        echo "📋 Depois execute: netlify login"
        echo "📋 E rode este script novamente"
        echo ""
        echo "📁 Build criado em: ./build"
        echo "🌐 Você pode fazer upload manual no Netlify.com"
    fi
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi 