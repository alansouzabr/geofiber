#!/bin/bash

case "$1" in
  start)
    echo "🚀 Iniciando ambiente..."
    docker-compose up -d
    echo "✅ Ambiente iniciado! API em http://localhost:3001"
    ;;
    
  stop)
    echo "🛑 Parando ambiente..."
    docker-compose down
    ;;
    
  restart)
    echo "🔄 Reiniciando ambiente..."
    docker-compose restart
    ;;
    
  logs)
    docker-compose logs -f ${2:-}
    ;;
    
  shell)
    docker-compose exec ${2:-api} sh
    ;;
    
  clean)
    echo "🧹 Limpando tudo..."
    docker-compose down -v
    docker system prune -f
    ;;
    
  build)
    echo "🏗️  Buildando containers..."
    docker-compose build
    ;;
    
  status)
    docker-compose ps
    ;;
    
  test)
    echo "🧪 Testando API..."
    sleep 3
    curl -s http://localhost:3001/health || echo "❌ API não responde"
    ;;
    
  *)
    echo "Uso: ./dev.sh {start|stop|restart|logs|shell|clean|build|status|test}"
    echo ""
    echo "Comandos:"
    echo "  start   - Inicia todos containers"
    echo "  stop    - Para todos containers"
    echo "  restart - Reinicia containers"
    echo "  logs    - Mostra logs (use: ./dev.sh logs api)"
    echo "  shell   - Acessa shell do container (use: ./dev.sh shell api)"
    echo "  clean   - Remove tudo (incluindo volumes)"
    echo "  build   - Rebuild dos containers"
    echo "  status  - Mostra status dos containers"
    echo "  test    - Testa se API está respondendo"
    exit 1
    ;;
esac
