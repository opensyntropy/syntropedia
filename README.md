# Syntropedia

[![CI](https://github.com/opensyntropy/syntropedia/workflows/CI/badge.svg)](https://github.com/opensyntropy/syntropedia/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Data License: CC BY-SA 4.0](https://img.shields.io/badge/Data%20License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Sistema open-source de gestão colaborativa de espécies para agrofloresta e agricultura sintrópica.

## Sobre o Projeto

Syntropedia é uma plataforma web para catalogar e compartilhar conhecimento sobre espécies vegetais voltadas para agricultura sintrópica e agrofloresta. O sistema permite que usuários contribuam com fotos, moderadores gerenciem dados estruturados com controle de versionamento, e a comunidade discuta via integração com fórum Discourse.

### Principais Funcionalidades

- Cadastro e gestão de espécies vegetais com dados estruturados
- Sistema de autenticação integrado com fórum Discourse (SSO)
- Upload e moderação de fotos das espécies
- Sistema de versionamento com histórico de alterações
- Catálogo público com busca e filtros avançados
- Exportação de dados em formato CSV
- Integração com fórum Discourse para discussões
- Painel de moderação

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **UI:** Tailwind CSS + shadcn/ui
- **Autenticação:** NextAuth.js com Discourse SSO
- **Validação:** Zod
- **Formulários:** React Hook Form

## Pré-requisitos

- Node.js 18+ (recomendado 20+)
- PostgreSQL 14+
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/opensyntropy/syntropedia.git
cd syntropedia
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
- `DATABASE_URL`: URL de conexão do PostgreSQL
- `NEXTAUTH_SECRET`: Chave secreta para NextAuth (gere com `openssl rand -base64 32`)
- `DISCOURSE_URL`: URL do fórum Discourse
- `DISCOURSE_SSO_SECRET`: Segredo SSO do Discourse
- `DISCOURSE_API_KEY`: Chave da API do Discourse

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev --name init
```

5. (Opcional) Popule o banco com dados de exemplo:
```bash
npx prisma db seed
```

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linter
- `npx prisma studio` - Abre interface visual do Prisma
- `npx prisma migrate dev` - Cria nova migração do banco

## Estrutura do Projeto

```
syntropedia/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── app/                   # App Router (Next.js)
│   │   ├── (public)/          # Rotas públicas
│   │   │   ├── especies/      # Páginas de espécies
│   │   │   └── catalogo/      # Catálogo
│   │   ├── (auth)/            # Rotas autenticadas
│   │   ├── moderacao/         # Painel de moderação
│   │   └── api/               # API Routes
│   ├── components/            # Componentes React
│   │   ├── ui/                # Componentes shadcn/ui
│   │   ├── especies/          # Componentes de espécies
│   │   ├── fotos/             # Componentes de fotos
│   │   └── layout/            # Componentes de layout
│   ├── lib/                   # Utilitários e helpers
│   ├── types/                 # Definições TypeScript
│   └── hooks/                 # Custom React hooks
├── public/                    # Arquivos estáticos
└── PRD.md                     # Product Requirements Document
```

## Níveis de Usuário

- **USER**: Visualizar espécies, fazer upload de fotos, participar do fórum
- **MODERATOR**: Todas as permissões de USER + criar/editar espécies, aprovar fotos, reverter alterações
- **ADMIN**: Todas as permissões de MODERATOR + gerenciar usuários e permissões

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

- **Código-fonte:** MIT License
- **Dados (espécies):** Creative Commons BY-SA 4.0
- **Fotos:** Creative Commons BY 4.0 (padrão, configurável pelo usuário)

## Comunidade

- **Fórum:** [placenta.opensyntropy.earth](https://placenta.opensyntropy.earth)
- **Documentação Completa:** Ver PRD.md

## Roadmap

### Fase 1 - MVP (em desenvolvimento)
- [x] Setup inicial do projeto
- [x] Estrutura de dados e Prisma
- [ ] Autenticação SSO com Discourse
- [ ] CRUD de Espécies
- [ ] Sistema de versionamento
- [ ] Catálogo e busca
- [ ] Upload e moderação de fotos
- [ ] Exportação CSV
- [ ] Painel do moderador

### Fase 2 - Consolidação
- [ ] Sistema de notificações
- [ ] Melhorias na busca
- [ ] Estatísticas e dashboards
- [ ] Melhorias de UX

### Fase 3 - Expansão
- [ ] API pública REST
- [ ] PWA
- [ ] Mapas de distribuição
- [ ] Reconhecimento de espécies por IA
- [ ] Calculadora de consórcios
- [ ] Internacionalização

---

**Versão:** 1.0.0
**Última Atualização:** Dezembro 2025
