MEDAGENDA - ENTREGA DO TRABALHO

Arquivos criados:
- frontend/Dockerfile
- backend/Dockerfile
- docker-compose.yml
- sistema completo frontend + backend

Como executar no seu computador:
1. Instale o Docker Desktop.
2. Abra a pasta do projeto no terminal.
3. Execute:
   docker compose up -d --build
4. Acesse:
   Frontend: http://localhost:5173
   Backend: http://localhost:3000/api/health

Como gerar os logs pedidos no trabalho:
- Log do backend:
  docker logs medagenda-backend > log-backend.txt

- Log do frontend:
  docker logs medagenda-frontend > log-frontend.txt

Como gerar a imagem dos containers:
- Execute:
  docker ps
- Tire um print da tela e salve como imagem.

Observação importante:
Os logs do Docker Desktop e a imagem do docker ps precisam ser gerados no seu computador, porque dependem da execução real dos containers no Docker.
