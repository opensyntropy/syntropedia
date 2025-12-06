# Guia de Contribuição

Obrigado por considerar contribuir com o Syntropedia! Este documento fornece diretrizes para contribuir com o projeto.

## Como Contribuir

### Reportando Bugs

Se você encontrar um bug, por favor abra uma issue incluindo:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots (se aplicável)
- Ambiente (navegador, versão do Node.js, etc.)

### Sugerindo Melhorias

Para sugerir novas funcionalidades:

1. Verifique se já não existe uma issue similar
2. Abra uma nova issue com tag `enhancement`
3. Descreva a funcionalidade e sua motivação
4. Se possível, proponha uma implementação

### Pull Requests

1. **Fork o repositório**

2. **Clone seu fork:**
   ```bash
   git clone https://github.com/seu-usuario/syntropedia.git
   cd syntropedia
   ```

3. **Crie uma branch para sua feature:**
   ```bash
   git checkout -b feature/minha-feature
   ```

   Convenção de nomes:
   - `feature/` - Nova funcionalidade
   - `fix/` - Correção de bug
   - `docs/` - Documentação
   - `refactor/` - Refatoração de código
   - `test/` - Testes

4. **Configure o ambiente de desenvolvimento:**
   ```bash
   npm install
   cp .env.example .env
   # Configure as variáveis de ambiente no .env
   npx prisma migrate dev
   ```

5. **Faça suas alterações** seguindo as diretrizes de código

6. **Teste suas alterações:**
   ```bash
   npm run lint
   npm run build
   ```

7. **Commit suas mudanças:**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade X"
   ```

   Seguimos a convenção [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - Nova funcionalidade
   - `fix:` - Correção de bug
   - `docs:` - Mudanças na documentação
   - `style:` - Formatação, ponto e vírgula faltando, etc.
   - `refactor:` - Refatoração de código
   - `test:` - Adição ou modificação de testes
   - `chore:` - Atualizações de build, configs, etc.

8. **Push para seu fork:**
   ```bash
   git push origin feature/minha-feature
   ```

9. **Abra um Pull Request** no repositório principal

## Diretrizes de Código

### TypeScript

- Use tipagem estrita
- Evite `any`, use tipos específicos ou `unknown`
- Prefira interfaces para objetos
- Use enums para valores constantes relacionados

### Componentes React

- Use componentes funcionais com hooks
- Um componente por arquivo
- Nomes de componentes em PascalCase
- Props tipadas com interface

Exemplo:
```typescript
interface MinhaComponenteProps {
  titulo: string
  opcional?: number
}

export function MinhaComponente({ titulo, opcional }: MinhaComponenteProps) {
  return <div>{titulo}</div>
}
```

### Estilo e Formatação

- Use Tailwind CSS para estilização
- Siga os padrões do shadcn/ui para componentes
- Use a função `cn()` para merge de classes
- Mantenha componentes pequenos e focados

### Banco de Dados

- Sempre crie migrations para mudanças no schema
- Nunca edite migrations existentes
- Use nomes descritivos para migrations
- Teste migrations antes de commitar

```bash
npx prisma migrate dev --name descricao_da_mudanca
```

### API Routes

- Valide inputs com Zod
- Retorne códigos HTTP apropriados
- Trate erros adequadamente
- Documente endpoints complexos

### Acessibilidade

- Use elementos HTML semânticos
- Adicione labels em formulários
- Garanta contraste adequado
- Teste navegação por teclado
- Use textos alternativos em imagens

## Estrutura de Commits

Mantenha commits pequenos e focados. Cada commit deve:

- Fazer uma única mudança lógica
- Ter uma mensagem descritiva
- Passar nos testes e linter
- Ser possível de reverter independentemente

## Code Review

Todos os PRs passam por revisão. Esperamos:

- Código limpo e legível
- Testes quando aplicável
- Documentação atualizada
- Sem conflitos de merge
- CI/CD passando

## Questões?

Se tiver dúvidas:

1. Verifique o [PRD.md](./PRD.md) para detalhes do produto
2. Consulte o [README.md](./README.md) para setup
3. Abra uma issue com a tag `question`
4. Pergunte no [fórum da comunidade](https://placenta.opensyntropy.earth)

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Seja paciente com iniciantes

---

Obrigado por contribuir com o Syntropedia!
