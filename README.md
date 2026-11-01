# Presidente do Brasil - Jogo de Gerenciamento Político

Jogo de navegador separado em **backend (Node.js/Express)** e **frontend (HTML/JS/CSS)**.

## Estrutura

```
Game Politica/
├── backend/
│   ├── package.json
│   ├── server.js          # Toda a lógica de jogo e API
│   └── data/              # Salvamentos (criado automaticamente)
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js          # Renderização e chamadas à API
└── README.md
```

## Como rodar

### 1. Instalar dependências do backend

No terminal, dentro da pasta `backend`:

```powershell
cd backend
npm install
```

### 2. Iniciar o backend

```powershell
npm start
```

O servidor fica em `http://localhost:3001`.

### 3. Abrir o jogo

Acesse no navegador:

```
http://localhost:3001
```

Ou abra diretamente o arquivo `frontend/index.html` (ele consome a API em `http://localhost:3001/api`).

## Como jogar

1. **Criar candidato**: nome, partido, estado eleitoral, origem/perfil.
2. **Carreira política**: comece como prefeito, governador ou senador. Cada cargo tem mandato de 4 anos.
3. **Modo história**: para disputar a presidência, você precisa já ter um cargo eletivo (prefeito/governador/senador).
4. **Eleições**: campanha com comícios, debates, redes sociais e arrecadação. A presidência usa o colégio eleitoral brasileiro.
5. **Presidência**: nomeie ministros, gerencie áreas, aprove leis no Congresso, forme coalizão, cuide do Banco Central (Copom), sobreviva a CPIs e impeachment.
6. **Eventos aleatórios**: greves, dengue, operações da PF, queimadas na Amazônia, escândalos, etc.

## Arquitetura

- **Backend**: contém todo o estado do jogo, regras de negócio, cálculos eleitorais, eventos e persistência em `data/save.json`. Expõe rotas REST em `/api/*`.
- **Frontend**: consome a API via `fetch`, renderiza as telas e envia as ações do jogador.

## Próximos passos (visual)

O foco agora foi a lógica completa. Depois podemos trabalhar no visual bonito: arte de estados, mapa real do Brasil, animações, sons, etc.
