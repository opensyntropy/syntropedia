# PRD - Syntropedia (Product Requirements Document)

**Versão:** 2.1  
**Data:** Dezembro 2025  
**Projeto:** Sistema Open-Source de Gestão Colaborativa de Espécies para Agrofloresta

---

## 1. VISÃO GERAL

### 1.1 Propósito

Syntropedia é uma plataforma web open-source para catalogar e compartilhar conhecimento sobre espécies vegetais voltadas para agricultura sintrópica e agrofloresta. O sistema permite que usuários contribuam com fotos, moderadores gerenciem dados estruturados com controle de versionamento, e a comunidade discuta via integração com fórum Discourse.

### 1.2 Objetivos

- Criar um banco de dados estruturado e confiável de espécies para sistemas agroflorestais
- Facilitar a colaboração e troca de conhecimento através da integração com fórum
- Manter integridade e rastreabilidade das informações através de sistema de versionamento
- Promover transparência com dados abertos (exportação CSV)
- Construir uma comunidade ativa em torno do conhecimento sintrópico

### 1.3 Público-Alvo

- **Praticantes de agricultura sintrópica**: Agricultores e agrofloresteiros
- **Pesquisadores**: Acadêmicos e técnicos
- **Estudantes**: Interessados em aprender sobre agrofloresta
- **Moderadores**: Especialistas que validam e gerenciam informações
- **Contribuidores**: Qualquer pessoa que queira compartilhar fotos e conhecimento

---

## 2. ESCOPO DO PRODUTO

### 2.1 Funcionalidades Incluídas (MVP)

- Cadastro e gestão de espécies vegetais com dados estruturados
- Sistema de autenticação integrado com fórum Discourse (SSO)
- Upload e moderação de fotos das espécies
- Sistema de versionamento com histórico de alterações
- Catálogo público com busca e filtros
- Exportação de dados em formato CSV
- Integração com fórum Discourse para discussões
- Painel de moderação

### 2.2 Funcionalidades Excluídas (Futuro)

- Aplicativo mobile nativo
- Reconhecimento de espécies por IA
- Mapas de distribuição geográfica
- Calculadora de consórcios
- API pública REST
- Internacionalização (i18n)
- Sistema de gamificação

---

## 3. REQUISITOS FUNCIONAIS

### 3.1 Autenticação e Autorização

#### RF-001: Login via SSO Discourse
**Descrição:** Usuários devem fazer login através do fórum Discourse hospedado em `placenta.opensyntropy.earth`  
**Critérios de Aceitação:**
- Usuário clica em "Login" e é redirecionado para Discourse
- Após autenticação no Discourse, retorna autenticado para Syntropedia
- Perfil do usuário é sincronizado (nome, email, avatar)
- Sessão persiste entre Syntropedia e Discourse

#### RF-002: Níveis de Permissão
**Descrição:** Sistema deve suportar 3 níveis de usuário  
**Níveis:**
- **USER**: Visualizar espécies, fazer upload de fotos, participar do fórum
- **MODERATOR**: Todas as permissões de USER + criar/editar espécies, aprovar fotos, reverter alterações
- **ADMIN**: Todas as permissões de MODERATOR + gerenciar usuários e permissões

**Critérios de Aceitação:**
- Cada função tem acesso apenas às features permitidas
- Tentativa de acesso não autorizado resulta em erro/redirect

---

### 3.2 Gestão de Espécies

#### RF-003: Criar Nova Espécie
**Descrição:** Moderadores podem criar novas espécies no sistema  
**Permissão:** MODERATOR, ADMIN  
**Campos Obrigatórios:**
- Nome científico
- Estrato (EMERGENTE, ALTO, MEDIO, BAIXO, RASTEIRO)
- Estágio Sucessional (PIONEIRA, SECUNDARIA_INICIAL, SECUNDARIA_TARDIA, CLIMAX)

**Campos Opcionais:**
- Nomenclatura: gênero, espécie, autor, nomes populares, sinônimos, família botânica, variedade
- Dados Base: ciclo de vida, altura, largura da copa, formato da copa
- Complementares: origem, bioma, folhagem, velocidade de crescimento, sistema radicular, fixação de nitrogênio, produção de biomassa, frutificação
- Usos: lista de usos da planta
- Propagação: métodos de propagação
- Observações: campo de texto livre

**Critérios de Aceitação:**
- Formulário valida campos obrigatórios
- Sistema gera slug único baseado no nome científico
- Espécie criada com status RASCUNHO
- Moderador é registrado como criador

#### RF-004: Editar Espécie Existente
**Descrição:** Moderadores podem editar dados de espécies existentes  
**Permissão:** MODERATOR, ADMIN  
**Critérios de Aceitação:**
- Formulário pré-preenchido com dados atuais
- Validação de campos obrigatórios
- Alterações são salvas
- Registro de alteração criado no histórico
- Cache da página é revalidado

#### RF-005: Visualizar Espécie
**Descrição:** Qualquer visitante pode visualizar detalhes de uma espécie publicada  
**Permissão:** Pública  
**Informações Exibidas:**
- Todos os dados cadastrados da espécie
- Galeria de fotos aprovadas
- Link para tópico de discussão no fórum
- Histórico de alterações (apenas para moderadores)

**Critérios de Aceitação:**
- Página carrega com todos os dados
- Imagens são otimizadas
- SEO adequado (meta tags, schema.org)

#### RF-006: Listar Espécies (Catálogo)
**Descrição:** Visitantes podem navegar pelo catálogo de espécies  
**Permissão:** Pública  
**Funcionalidades:**
- Grid de cards com foto principal e dados básicos
- Busca por nome científico ou popular
- Filtros múltiplos (ver RF-008)
- Paginação (20 espécies por página)
- Ordenação (alfabética, recente)

**Critérios de Aceitação:**
- Cards exibem: foto, nome científico, nomes populares, estrato, estágio sucessional
- Busca retorna resultados relevantes
- Filtros funcionam isolados e combinados
- Performance adequada mesmo com centenas de espécies

#### RF-007: Buscar Espécies
**Descrição:** Sistema de busca por texto livre  
**Permissão:** Pública  
**Funcionalidades:**
- Campo de busca no header (presente em todas as páginas)
- Busca em: nome científico, nomes populares, família botânica
- Autocomplete com sugestões
- Tolerância a erros de digitação (fuzzy search)

**Critérios de Aceitação:**
- Busca retorna resultados em menos de 1 segundo
- Autocomplete mostra até 10 sugestões
- Busca com erro de digitação ainda encontra resultados relevantes

#### RF-008: Filtrar Espécies
**Descrição:** Filtros avançados no catálogo  
**Permissão:** Pública  
**Filtros Disponíveis:**
- Estrato (múltipla seleção)
- Estágio Sucessional (múltipla seleção)
- Família Botânica (seleção única)
- Usos (múltipla seleção)
- Fixadora de Nitrogênio (sim/não)
- Tem Fruto Comestível (sim/não)
- Formato da Copa (múltipla seleção)
- Tipo de Folhagem (múltipla seleção)

**Critérios de Aceitação:**
- Filtros refletem na URL (query params)
- Múltiplos filtros podem ser combinados
- Contador mostra quantos resultados cada filtro retornaria
- Botão "Limpar filtros" remove todos de uma vez
- Filtros persistem ao navegar entre páginas

---

### 3.3 Gestão de Fotos

#### RF-009: Upload de Fotos
**Descrição:** Usuários autenticados podem fazer upload de fotos de espécies  
**Permissão:** USER, MODERATOR, ADMIN  
**Funcionalidades:**
- Upload via drag-and-drop ou seleção de arquivo
- Formatos aceitos: JPG, PNG, WEBP
- Tamanho máximo: 5MB por foto
- Múltiplas fotos podem ser enviadas de uma vez
- Campos: legenda (opcional), tags, localização (opcional)

**Critérios de Aceitação:**
- Sistema valida formato e tamanho
- Imagem é comprimida automaticamente se necessário
- Foto fica pendente de aprovação
- Usuário recebe confirmação de upload bem-sucedido
- Preview da foto antes de enviar

#### RF-010: Moderar Fotos
**Descrição:** Moderadores aprovam ou rejeitam fotos enviadas  
**Permissão:** MODERATOR, ADMIN  
**Funcionalidades:**
- Painel lista fotos pendentes de aprovação
- Visualização em tamanho maior
- Botões: Aprovar, Rejeitar
- Possibilidade de editar legenda e tags
- Definir foto como principal da espécie

**Critérios de Aceitação:**
- Fotos aprovadas aparecem na galeria da espécie
- Fotos rejeitadas não aparecem e usuário é notificado
- Foto principal aparece em destaque no card e página de detalhe
- Apenas uma foto pode ser principal por espécie

#### RF-011: Galeria de Fotos
**Descrição:** Exibição de fotos aprovadas na página da espécie  
**Permissão:** Pública  
**Funcionalidades:**
- Carousel com foto principal em destaque
- Grid de thumbnails
- Lightbox para visualização em tela cheia
- Informações: legenda, tags, quem enviou, quando

**Critérios de Aceitação:**
- Imagens carregam de forma otimizada (lazy loading)
- Navegação entre fotos é fluida
- Lightbox tem controles (próximo, anterior, fechar, zoom)
- Tags são clicáveis e filtram fotos

---

### 3.4 Sistema de Versionamento

#### RF-012: Registrar Alterações
**Descrição:** Toda edição em dados de espécie gera registro no histórico  
**Permissão:** Automático (sistema)  
**Dados Registrados:**
- Campos alterados
- Valor anterior
- Valor novo
- Usuário que alterou
- Data e hora
- Motivo da alteração (opcional)

**Critérios de Aceitação:**
- Registro criado antes de salvar alteração
- Registro preservado mesmo se espécie for deletada (soft delete)
- Performance não degradada com muitos registros

#### RF-013: Visualizar Histórico
**Descrição:** Moderadores podem ver histórico de alterações  
**Permissão:** MODERATOR, ADMIN  
**Funcionalidades:**
- Timeline de alterações ordenada por data
- Comparação lado a lado (diff) entre versões
- Filtros: por campo, por usuário, por período
- Busca no histórico

**Critérios de Aceitação:**
- Timeline mostra todas as alterações
- Diff destaca claramente o que mudou
- Filtros funcionam corretamente
- Interface é clara e fácil de entender

#### RF-014: Reverter Alterações
**Descrição:** Moderadores podem reverter espécie para versão anterior  
**Permissão:** MODERATOR, ADMIN  
**Funcionalidades:**
- Botão "Reverter para esta versão" em cada entrada do histórico
- Preview do que será revertido
- Confirmação obrigatória
- Reversão cria nova entrada no histórico (não deleta registros)

**Critérios de Aceitação:**
- Sistema reverte para estado exato da versão selecionada
- Nova entrada no histórico registra a reversão
- Usuário original é notificado (se possível)
- Não há perda de dados do histórico

---

### 3.5 Integração com Discourse

#### RF-015: Link para Tópico de Discussão
**Descrição:** Cada espécie tem link para tópico dedicado no fórum  
**Permissão:** Pública (visualização), MODERATOR (criação)  
**Funcionalidades:**
- Campo URL para tópico do Discourse
- Botão "Participar da Discussão" visível na página da espécie
- Widget mostrando últimas respostas do tópico

**Critérios de Aceitação:**
- Link abre tópico em nova aba
- Widget carrega via API do Discourse
- Se tópico não existir, opção de criar novo

#### RF-016: Widget de Discussões
**Descrição:** Últimas discussões do fórum exibidas na página da espécie  
**Permissão:** Pública  
**Funcionalidades:**
- Mostra últimos 5 posts do tópico
- Exibe: autor, avatar, preview do texto, data
- Link para ver discussão completa

**Critérios de Aceitação:**
- Widget carrega de forma assíncrona (não bloqueia página)
- Fallback se API do Discourse estiver indisponível
- Cache de 5 minutos para performance

---

### 3.6 Exportação de Dados

#### RF-017: Exportar Catálogo em CSV
**Descrição:** Qualquer visitante pode exportar dados em formato CSV  
**Permissão:** Pública  
**Funcionalidades:**
- Botão "Exportar CSV" no catálogo
- Exporta espécies visíveis (respeitando filtros ativos)
- Opção de exportar tudo ou apenas filtradas

**Formato do CSV:**
- Encoding: UTF-8
- Separador: vírgula
- Headers em português
- Todas as colunas da espécie
- URLs das fotos (separadas por ponto-e-vírgula)
- Primeira linha: licença Creative Commons BY-SA 4.0

**Critérios de Aceitação:**
- Arquivo baixa automaticamente
- CSV abre corretamente no Excel/LibreOffice
- Dados estão completos e corretos
- Performance adequada até 1000 espécies

---

### 3.7 Painel de Moderação

#### RF-018: Dashboard do Moderador
**Descrição:** Painel centralizado para atividades de moderação  
**Permissão:** MODERATOR, ADMIN  
**Widgets:**
- Fotos pendentes de aprovação (contador + lista)
- Espécies em rascunho (lista)
- Últimas edições realizadas (timeline)
- Estatísticas: total de espécies, fotos, usuários ativos

**Critérios de Aceitação:**
- Dashboard carrega rapidamente
- Contadores são atualizados em tempo real
- Links diretos para ações (aprovar foto, editar espécie)
- Responsivo para tablets

---

## 4. ESTRUTURA DE DADOS

### 4.1 Entidade: Espécie

**Nomenclatura:**
- Nome científico (obrigatório, texto)
- Gênero (opcional, texto)
- Espécie (opcional, texto)
- Autor (opcional, texto) - autor da descrição botânica
- Nomes populares (opcional, lista de textos)
- Sinônimos (opcional, lista de textos) - nomes científicos antigos
- Família botânica (opcional, texto)
- Variedade (opcional, texto) - cultivar

**Dados Base:**
- Estrato (obrigatório, enum): EMERGENTE, ALTO, MEDIO, BAIXO, RASTEIRO
- Estágio Sucessional (obrigatório, enum): PIONEIRA, SECUNDARIA_INICIAL, SECUNDARIA_TARDIA, CLIMAX
- Ciclo de Vida - Duração (opcional, enum): ANUAL, BIENAL, PERENE_CURTA, PERENE_MEDIA, PERENE_LONGA, CENTENARIA
- Ciclo de Vida - Anos (opcional, texto) - ex: "20-50", "80-150"
- Altura em metros (opcional, decimal)
- Largura da copa em metros (opcional, decimal)
- Formato da copa (opcional, enum): CONICA, PIRAMIDAL, COLUNARE, ARREDONDADA, GLOBOSA, OVAL, IRREGULAR, PENDENTE, UMBELIFORME, PALMEIRA

**Complementares:**
- Centro de origem (opcional, texto) - ex: "América do Sul"
- Bioma global (opcional, texto) - classificação internacional
- Bioma regional (opcional, lista de textos) - nomes locais/regionais
- Tipo de folhagem (opcional, enum): PERENIFOLIA, SEMIPERENIFOLIA, CADUCIFOLIA, SEMIDECIDUA
- Época de queda das folhas (opcional, texto)
- Velocidade de crescimento (opcional, enum): MUITO_RAPIDO, RAPIDO, MEDIO, LENTO, MUITO_LENTO
- Sistema radicular (opcional, enum): PIVOTANTE, FASCICULADO, TUBEROSO, ADVENTICIO, PNEUMATOFORO, ESCORA, MISTO
- Fixadora de nitrogênio (booleano, padrão: false)
- Produção de biomassa (opcional, enum): MUITO_ALTA, ALTA, MEDIA, BAIXA, MUITO_BAIXA
- Tem fruto (booleano, padrão: false)
- Fruto comestível (booleano, padrão: false)
- Frutificação início (opcional, inteiro) - idade em anos
- Frutificação fim (opcional, inteiro) - idade em anos

**Usos (lista, seleção múltipla):**
- ALIMENTACAO_HUMANA, ALIMENTACAO_ANIMAL, MADEIRA, MEDICINAL, ORNAMENTAL, CERCA_VIVA, SOMBRA, QUEBRA_VENTO, COBERTURA_SOLO, MEL, FIBRA, OLEO, LENHA, ARTESANATO

**Propagação:**
- Métodos de propagação (opcional, lista de textos) - ex: ["Semente", "Estaca", "Enxertia"]

**Outros:**
- Observações (opcional, texto longo)
- Status (enum): RASCUNHO, PUBLICADO, EM_REVISAO
- Link para tópico Discourse (opcional, URL)
- Slug (único, gerado automaticamente)

**Metadados:**
- Criado por (referência a usuário)
- Criado em (data/hora)
- Atualizado por (referência a usuário)
- Atualizado em (data/hora)

**Relacionamentos:**
- Uma espécie tem muitas fotos
- Uma espécie tem muitos registros de histórico

### 4.2 Entidade: Foto

**Atributos:**
- URL da imagem (obrigatório)
- Legenda (opcional, texto)
- Tags (lista de textos) - ex: ["flor", "fruto", "folha", "planta-jovem"]
- Localização (opcional, texto)
- Upload por (referência a usuário)
- Upload em (data/hora)
- Aprovado (booleano, padrão: false)
- Principal (booleano, padrão: false) - foto de destaque da espécie

**Relacionamentos:**
- Uma foto pertence a uma espécie

### 4.3 Entidade: Histórico de Alteração

**Atributos:**
- Campo(s) alterado(s) (texto)
- Valor anterior (JSON)
- Valor novo (JSON)
- Motivo da alteração (opcional, texto)
- Alterado por (referência a usuário)
- Alterado em (data/hora)

**Relacionamentos:**
- Um registro de histórico pertence a uma espécie

### 4.4 Entidade: Usuário

**Atributos:**
- Nome (texto)
- Email (texto, único)
- Avatar/Imagem (URL)
- Role (enum): USER, MODERATOR, ADMIN
- Discourse ID (texto, único)
- Criado em (data/hora)
- Atualizado em (data/hora)

---

## 5. REQUISITOS NÃO-FUNCIONAIS

### 5.1 Performance

**RNF-001: Tempo de Carregamento**
- Páginas públicas devem carregar em menos de 2 segundos (LCP)
- Time to Interactive menor que 3 segundos
- First Input Delay menor que 100ms
- Cumulative Layout Shift menor que 0.1

**RNF-002: Escalabilidade**
- Sistema deve suportar 1000+ espécies sem degradação de performance
- Catálogo deve carregar rapidamente mesmo com filtros complexos
- Upload de fotos deve processar em menos de 5 segundos

**RNF-003: Cache e Otimização**
- Páginas de espécies devem usar Incremental Static Regeneration
- Imagens devem ser otimizadas automaticamente
- API do Discourse deve ter cache de 5 minutos

### 5.2 SEO

**RNF-004: Otimização para Motores de Busca**
- Todas as páginas públicas devem ser renderizadas no servidor (SSR/SSG)
- Meta tags apropriadas em cada página (title, description, Open Graph)
- Schema.org markup para espécies
- Sitemap.xml gerado automaticamente
- URLs amigáveis (slugs legíveis)

### 5.3 Acessibilidade

**RNF-005: WCAG 2.1 Level AA**
- Contraste de cores adequado (mínimo 4.5:1)
- Navegação completa por teclado
- Suporte a screen readers
- Labels em todos os campos de formulário
- Textos alternativos em todas as imagens
- Foco visível em elementos interativos

### 5.4 Segurança

**RNF-006: Proteção de Dados**
- Autenticação obrigatória para ações de modificação
- Validação de inputs em servidor e cliente
- Rate limiting para uploads e APIs
- Proteção contra SQL injection (ORM)
- Proteção contra XSS
- HTTPS obrigatório em produção

**RNF-007: Controle de Acesso**
- Verificação de permissões em todas as rotas protegidas
- Sessões seguras e expiráveis
- Logs de ações administrativas

### 5.5 Usabilidade

**RNF-008: Experiência do Usuário**
- Interface responsiva (mobile, tablet, desktop)
- Mensagens de erro claras e úteis
- Feedback visual para todas as ações
- Loading states durante operações assíncronas
- Confirmação antes de ações destrutivas

**RNF-009: Compatibilidade**
- Suporte aos navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- Funcional em dispositivos móveis iOS e Android

### 5.6 Manutenibilidade

**RNF-010: Código e Documentação**
- Código TypeScript com tipagem estrita
- Componentes reutilizáveis e modulares
- Documentação de APIs e componentes
- Testes automatizados para funcionalidades críticas
- Git flow com branches para features

### 5.7 Disponibilidade

**RNF-011: Uptime**
- Sistema deve ter 99% de disponibilidade
- Backups diários automáticos do banco de dados
- Plano de recuperação de desastres

---

## 6. FLUXOS DE USUÁRIO

### 6.1 Fluxo: Buscar e Visualizar Espécie

1. Usuário acessa página inicial
2. Digita nome da espécie na busca ou clica em "Explorar Catálogo"
3. Se busca: sistema exibe resultados
4. Se catálogo: sistema exibe grid com filtros
5. Usuário aplica filtros (opcional)
6. Usuário clica em card de espécie
7. Sistema exibe página de detalhe com todos os dados
8. Usuário pode ver galeria de fotos
9. Usuário pode clicar para participar da discussão no fórum

### 6.2 Fluxo: Contribuir com Foto

1. Usuário faz login via Discourse (se não autenticado)
2. Acessa página de uma espécie
3. Clica em "Adicionar Foto"
4. Faz upload da imagem (drag-drop ou seleção)
5. Preenche legenda e tags (opcional)
6. Confirma envio
7. Sistema exibe mensagem: "Foto enviada! Aguardando aprovação de moderador"
8. Moderador recebe notificação
9. Moderador aprova foto
10. Foto aparece na galeria da espécie

### 6.3 Fluxo: Criar Nova Espécie (Moderador)

1. Moderador faz login
2. Acessa painel de moderação
3. Clica em "Nova Espécie"
4. Preenche formulário (campos obrigatórios + opcionais)
5. Salva como rascunho ou publica diretamente
6. Sistema gera slug único
7. Se publicado: espécie aparece no catálogo
8. Sistema cria tópico no Discourse (opcional/automático)

### 6.4 Fluxo: Editar Espécie com Versionamento

1. Moderador acessa página de espécie
2. Clica em "Editar"
3. Sistema carrega formulário pré-preenchido
4. Moderador altera campos necessários
5. Opcionalmente adiciona motivo da alteração
6. Confirma edição
7. Sistema salva estado anterior no histórico
8. Sistema atualiza espécie com novos dados
9. Moderador pode visualizar histórico de alterações
10. Se necessário, pode reverter para versão anterior

### 6.5 Fluxo: Exportar Dados

1. Usuário acessa catálogo
2. Aplica filtros desejados (opcional)
3. Clica em "Exportar CSV"
4. Sistema gera arquivo CSV com dados filtrados
5. Download inicia automaticamente
6. Usuário abre arquivo em software de planilhas

---

## 7. REQUISITOS DE INTERFACE

### 7.1 Páginas Principais

#### Página: Home
**Elementos:**
- Hero com busca em destaque
- Grid de 6 espécies em destaque
- Estatísticas (contadores): total de espécies, fotos, contribuidores
- CTAs: "Explorar Catálogo", "Contribuir"
- Footer com links e informações

**Layout:**
- Hero full-width
- Grid responsivo (3 colunas desktop, 2 tablet, 1 mobile)

#### Página: Catálogo
**Elementos:**
- Header com busca global
- Sidebar com filtros (desktop) ou drawer (mobile)
- Grid de cards de espécies
- Paginação
- Contador de resultados

**Layout Desktop:**
```
┌─────────────────────────────────────┐
│ Header + Busca                      │
├──────────┬──────────────────────────┤
│ Filtros  │  Grid de Cards           │
│ Sidebar  │  (3 colunas)             │
│ (300px)  │                          │
│          │  [Paginação]             │
└──────────┴──────────────────────────┘
```

**Layout Mobile:**
- Header com botão filtros
- Grid 1 coluna
- Drawer lateral para filtros

#### Página: Detalhe da Espécie
**Elementos:**
- Breadcrumb
- Galeria de fotos (carousel + thumbnails)
- Seções de dados:
  - Nomenclatura
  - Dados Base (cards visuais)
  - Complementares (tabs ou accordion)
  - Usos (badges)
  - Propagação
  - Observações
- Widget de discussões do fórum
- Botão "Editar" (apenas para moderadores)
- Botão "Adicionar Foto"

**Layout Desktop:**
```
┌─────────────────────────────────────┐
│ Breadcrumb                          │
├─────────────────┬───────────────────┤
│  Galeria Fotos  │  Dados Principais │
│  (Carousel)     │  (Cards)          │
├─────────────────┴───────────────────┤
│ Tabs: Complementares | Propagação | │
│       Observações                   │
├─────────────────────────────────────┤
│ Widget Discussões Fórum             │
└─────────────────────────────────────┘
```

#### Página: Painel do Moderador
**Elementos:**
- Cards/widgets:
  - Fotos pendentes (badge de contagem)
  - Espécies em rascunho
  - Últimas edições
  - Estatísticas gerais
- Links rápidos para ações

**Layout:**
- Grid de cards 2x2 (desktop)
- Coluna única (mobile)

### 7.2 Componentes

#### Componente: Card de Espécie
**Dimensões:** 360x420px (desktop)  
**Elementos:**
- Imagem (aspect-ratio 4/3, object-cover)
- Nome científico (itálico, 18px)
- Nomes populares (cinza, 14px)
- Badges: Estrato + Estágio Sucessional
- Hover: lift effect + sombra maior

#### Componente: Filtros
**Elementos:**
- Seções colapsáveis por categoria
- Checkboxes para seleção múltipla
- Selects para seleção única
- Toggles para booleanos
- Contador de resultados por filtro
- Botão "Limpar todos"

#### Componente: Galeria de Fotos
**Elementos:**
- Carousel principal (imagem grande)
- Grid de thumbnails abaixo
- Controles: anterior, próximo, fullscreen
- Lightbox para visualização expandida
- Informações: legenda, tags, autor, data

#### Componente: Histórico de Alterações
**Elementos:**
- Timeline vertical
- Cards de alteração com:
  - Usuário + avatar
  - Data/hora
  - Campos alterados
  - Botão "Ver detalhes"
  - Botão "Reverter" (moderadores)
- Modal de comparação (diff view)

---

## 8. INTEGRAÇÕES

### 8.1 Discourse (Fórum)

**Propósito:** SSO e discussões  
**Endpoints Utilizados:**
- Autenticação via OAuth/SSO
- GET `/t/{topic_id}.json` - buscar tópico
- GET `/posts/{post_id}.json` - buscar posts
- POST `/posts.json` - criar tópico (futuro)

**Dados Sincronizados:**
- Perfil do usuário (nome, email, avatar)
- ID do usuário no Discourse

**Frequência de Sincronização:**
- Autenticação: a cada login
- Widget de discussões: cache de 5 minutos

### 8.2 Storage de Imagens

**Propósito:** Armazenar fotos uploadadas  
**Requisitos:**
- Suporte a URLs públicas
- CDN para performance
- Possibilidade de transformação de imagens (resize, compress)

**Opções Recomendadas:**
- Vercel Blob
- Cloudflare R2
- AWS S3
- MinIO (self-hosted)

---

## 9. REQUISITOS DE DADOS

### 9.1 Licenciamento

**Código-fonte:** MIT License  
**Dados (espécies):** Creative Commons BY-SA 4.0  
**Fotos:** Creative Commons BY 4.0 (padrão, configurável pelo usuário)

### 9.2 Backup e Recuperação

**Backup:**
- Backup diário automático do banco de dados
- Retenção de 30 dias
- Backup de imagens (semanal)

**Recuperação:**
- RTO (Recovery Time Objective): 4 horas
- RPO (Recovery Point Objective): 24 horas

### 9.3 Migração de Dados

**Importação Inicial:**
- Sistema deve permitir importação de CSV com dados de espécies
- Validação de dados durante importação
- Relatório de erros e sucessos

**Exportação:**
- CSV com todas as colunas
- Encoding UTF-8
- Licença explícita no arquivo

---

## 10. CRITÉRIOS DE SUCESSO

### 10.1 Métricas de Adoção (3 meses após lançamento)

- 50+ espécies cadastradas
- 200+ fotos aprovadas
- 100+ usuários registrados
- 20+ discussões ativas no fórum

### 10.2 Métricas de Qualidade

- Lighthouse Score > 90 (Performance, Acessibilidade, Melhores Práticas, SEO)
- 0 erros críticos de acessibilidade (WAVE)
- Tempo de resposta médio < 500ms
- Taxa de erro < 1%

### 10.3 Métricas de Engajamento (6 meses)

- 500+ espécies cadastradas
- 1000+ fotos
- 500+ usuários ativos (login no último mês)
- 50+ exportações de CSV por mês
- 100+ posts no fórum relacionados a espécies

---

## 11. ROADMAP

### Fase 1 - MVP (3 meses)

**Sprint 1-2: Setup e Autenticação**
- Configurar projeto Next.js + Prisma + PostgreSQL
- Implementar SSO com Discourse
- Setup de UI com shadcn/ui

**Sprint 3-4: CRUD de Espécies**
- Formulários criar/editar espécie
- Validação de dados
- Página de detalhe
- Sistema de versionamento

**Sprint 5-6: Catálogo e Busca**
- Página de catálogo com grid
- Sistema de filtros
- Busca com autocomplete
- Paginação

**Sprint 7-8: Fotos**
- Upload de fotos
- Compressão e otimização
- Galeria
- Moderação de fotos

**Sprint 9-10: Integração e Exportação**
- Widget Discourse
- Exportação CSV
- Painel do moderador

**Sprint 11-12: Polish e Deploy**
- SEO (metadata, sitemap)
- Performance (ISR, caching)
- Testes
- Documentação
- Deploy Vercel

### Fase 2 - Consolidação (2 meses)

- Sistema de notificações
- Melhorias na busca (Algolia ou similar)
- Estatísticas e dashboards
- Melhorias de UX baseadas em feedback

### Fase 3 - Expansão (Futuro)

- API pública REST
- PWA (Progressive Web App)
- Mapas de distribuição
- Reconhecimento de espécies por IA
- Calculadora de consórcios
- Internacionalização

---

## 12. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Spam de fotos/dados | Média | Alto | Sistema de moderação + rate limiting + captcha |
| Dados incorretos propagados | Alta | Alto | Versionamento robusto + moderação ativa + comunidade vigilante |
| Baixa adoção inicial | Média | Médio | Seed com dados de qualidade + marketing na comunidade + facilitar contribuição |
| Conflitos entre moderadores | Baixa | Médio | Guidelines claras + comunicação via fórum + hierarquia de decisão |
| Custos de hospedagem elevados | Média | Médio | Otimização agressiva + CDN + buscar patrocínio/doações |
| Integração Discourse quebrar | Baixa | Alto | Autenticação alternativa (fallback) + monitoramento + testes |
| Performance com muitos dados | Média | Alto | Indexação adequada + cache + paginação + lazy loading |

---

## 13. GLOSSÁRIO

**Agrofloresta:** Sistema agroflorestal que combina árvores, cultivos e/ou animais de forma integrada  
**Agricultura Sintrópica:** Sistema desenvolvido por Ernst Götsch baseado em sucessão natural  
**Estrato:** Camada vertical do sistema (emergente, alto, médio, baixo, rasteiro)  
**Estágio Sucessional:** Fase de desenvolvimento ecológico (pioneira, secundária, clímax)  
**Placenta:** Termo usado na agricultura sintrópica para espécies pioneiras  
**Fixadora de Nitrogênio:** Planta que fixa nitrogênio atmosférico através de simbiose  
**SSO (Single Sign-On):** Sistema de autenticação única entre múltiplas aplicações  
**Slug:** URL amigável gerada a partir do nome (ex: "jatoba-hymenaea-courbaril")  
**ISR (Incremental Static Regeneration):** Técnica do Next.js para atualização de páginas estáticas  
**Discourse:** Software open-source de fórum utilizado pela comunidade

---

## 14. ANEXOS

### 14.1 Referências

- Ernst Götsch - Agricultura Sintrópica
- RESOLVE Ecoregions 2017 (https://ecoregions.appspot.com/)
- Fórum Placenta (https://placenta.opensyntropy.earth)
- IUCN Red List (status de conservação)

### 14.2 Contatos

- **Fórum da Comunidade:** placenta.opensyntropy.earth
- **Repositório:** [a definir após criação]
- **Documentação Técnica:** [a definir]

---

**FIM DO PRD**

**Versão:** 2.1  
**Última Atualização:** Dezembro 2025  
**Próxima Revisão:** Após Sprint 6 (Fase MVP)