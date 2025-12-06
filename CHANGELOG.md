# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Em Desenvolvimento
- Autenticação SSO com Discourse
- CRUD de espécies
- Sistema de versionamento
- Upload de fotos
- Catálogo público

## [0.1.0] - 2025-12-06

### Adicionado
- Setup inicial do projeto com Next.js 14
- Configuração do Prisma com PostgreSQL
- Schema completo do banco de dados
  - Modelo User com roles (USER, MODERATOR, ADMIN)
  - Modelo Species com 40+ campos
  - Modelo Photo com sistema de aprovação
  - Modelo ChangeHistory para versionamento
- Estrutura de pastas organizada
- Configuração do Tailwind CSS e shadcn/ui
- Documentação completa (README, CONTRIBUTING, PRD)
- Templates de Issues e Pull Requests
- GitHub Actions para CI/CD
- Licença MIT para código
- Licenças Creative Commons para dados e fotos

### Configurado
- TypeScript com tipagem estrita
- ESLint para qualidade de código
- Variáveis de ambiente (.env.example)
- Git com commit inicial

[Unreleased]: https://github.com/opensyntropy/syntropedia/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/opensyntropy/syntropedia/releases/tag/v0.1.0
