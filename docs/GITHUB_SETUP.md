# GitHub Setup Guide

Este guia mostra como configurar o repositório GitHub para o Syntropedia.

## Opção 1: Usando GitHub CLI (Recomendado)

Se você tem o GitHub CLI (`gh`) instalado:

```bash
# 1. Crie o repositório no GitHub
gh repo create opensyntropy/syntropedia --public --description "Sistema open-source de gestão colaborativa de espécies para agrofloresta" --homepage "https://syntropedia.opensyntropy.earth"

# 2. Adicione o remote
git remote add origin https://github.com/opensyntropy/syntropedia.git

# 3. Renomeie a branch para main (opcional, mas recomendado)
git branch -M main

# 4. Faça push do código
git push -u origin main
```

## Opção 2: Manual (Usando Web Interface)

### Passo 1: Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Configure o repositório:
   - **Owner:** opensyntropy
   - **Repository name:** syntropedia
   - **Description:** Sistema open-source de gestão colaborativa de espécies para agrofloresta
   - **Visibility:** Public ✅
   - **NÃO** inicialize com README, .gitignore ou LICENSE (já temos esses arquivos)
3. Clique em "Create repository"

### Passo 2: Conectar Repositório Local

Após criar o repositório, execute:

```bash
# Adicione o remote
git remote add origin https://github.com/opensyntropy/syntropedia.git

# Renomeie a branch para main (opcional)
git branch -M main

# Faça push do código
git push -u origin main
```

## Opção 3: Fork (Para Contribuidores)

Se você não é membro da organização opensyntropy:

```bash
# 1. Faça fork do repositório na interface web
# Vá para: https://github.com/opensyntropy/syntropedia
# Clique em "Fork"

# 2. Clone SEU fork
git clone https://github.com/SEU-USUARIO/syntropedia.git
cd syntropedia

# 3. Adicione o repositório upstream
git remote add upstream https://github.com/opensyntropy/syntropedia.git

# 4. Verifique os remotes
git remote -v
```

## Configurações Recomendadas do Repositório

Após criar o repositório, configure:

### 1. Sobre / About

- **Website:** https://syntropedia.opensyntropy.earth (quando disponível)
- **Topics:**
  - `agrofloresta`
  - `agricultura-sintropica`
  - `nextjs`
  - `typescript`
  - `prisma`
  - `open-source`
  - `biodiversidade`
  - `permacultura`

### 2. Proteção da Branch Main

Settings → Branches → Add rule:

- **Branch name pattern:** `main`
- ✅ Require a pull request before merging
  - ✅ Require approvals (1)
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date
  - Status checks:
    - `lint-and-type-check`
    - `build`
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings

### 3. Secrets (Para Deploy)

Settings → Secrets and variables → Actions:

Adicione os seguintes secrets quando configurar deploy:

- `DATABASE_URL` - URL do banco de dados de produção
- `NEXTAUTH_SECRET` - Chave secreta do NextAuth
- `DISCOURSE_SSO_SECRET` - Segredo SSO do Discourse
- `DISCOURSE_API_KEY` - Chave da API do Discourse
- `VERCEL_TOKEN` - Token do Vercel (se usar Vercel)

### 4. Colaboradores

Settings → Collaborators:

Adicione os membros da equipe com permissões apropriadas:
- **Admin:** Core team
- **Write:** Moderadores e desenvolvedores frequentes
- **Read:** Contribuidores

### 5. Habilitar Discussões (Opcional)

Settings → Features:
- ✅ Discussions

Categorias sugeridas:
- 💡 Ideas (Ideias)
- 🙏 Q&A (Perguntas)
- 📣 Announcements (Anúncios)
- 🐛 Bug Reports (via Issues)

### 6. GitHub Pages (Para Documentação)

Se quiser hospedar documentação:

Settings → Pages:
- **Source:** Deploy from a branch
- **Branch:** `gh-pages` (criar depois)

## Comandos Úteis

```bash
# Ver status dos remotes
git remote -v

# Atualizar do repositório upstream (para forks)
git fetch upstream
git merge upstream/main

# Criar nova branch para feature
git checkout -b feature/minha-feature

# Push de uma nova branch
git push -u origin feature/minha-feature

# Renomear branch master para main
git branch -m master main
git push -u origin main
```

## Próximos Passos

Após configurar o GitHub:

1. ✅ Adicione badge do CI no README
2. ✅ Configure deploy automático (Vercel/Railway)
3. ✅ Convide colaboradores
4. ✅ Crie milestone para MVP
5. ✅ Crie issues para as primeiras features

## Badges para o README

Adicione estes badges ao README.md:

```markdown
[![CI](https://github.com/opensyntropy/syntropedia/workflows/CI/badge.svg)](https://github.com/opensyntropy/syntropedia/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
```

## Recursos

- [GitHub Docs](https://docs.github.com)
- [GitHub CLI](https://cli.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
