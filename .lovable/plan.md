# Publicar código no GitHub

## Objetivo
Sincronizar o código-fonte do projeto no GitHub, usando um repositório existente como destino.

## Estado atual verificado
- O projeto ainda não está conectado a um repositório GitHub (`.git` aponta para o template interno do Lovable, não para um repo externo).
- `.gitignore` já está configurado corretamente para excluir `node_modules`, `dist`, `.vinxi`, `.wrangler`, etc.

## Limitação importante
A integração nativa de sync do Lovable com GitHub **não conecta diretamente a repositórios existentes**. Ela cria um novo repositório no momento da conexão. Há duas formas de contornar isso:

### Opção A — Usar o repositório existente (recomendado se você quer manter a URL/histórico atual)
1. Conectar o projeto Lovable ao GitHub criando um **novo repositório** temporário via Lovable (Plus menu → GitHub → Connect project).
2. Após o sync inicial, clonar esse repositório localmente.
3. Adicionar o repositório existente como novo `origin` (ou `upstream`) e fazer push com `--force` para sobrescrever o conteúdo do repo existente.
4. (Opcional) Arquivar o repositório temporário criado pelo Lovable.

**Risco:** o histórico de commits do repositório existente será substituído pelo conteúdo do projeto Lovable. Se o repo existente tiver commits que você quer preservar, essa opção exige merge manual.

### Opção B — Criar um novo repositório e usar ele como oficial
1. Conectar o projeto Lovable ao GitHub criando um novo repositório (ex: `pinotti-portfolio`).
2. Usar esse novo repositório como o repositório oficial do projeto.
3. (Opcional) Adicionar uma nota no README do repositório antigo apontando para o novo.

## Etapas do plano
1. Confirmar com você qual opção prefere (A ou B) e, se A, qual a URL/nome do repositório existente.
2. Iniciar a conexão GitHub no Lovable pela UI (Plus menu → GitHub → Connect project).
3. Resolver conflitos de arquivos de configuração sensíveis (`.env`, segredos de API como `AIROPS_API_KEY`, `AIROPS_WEBHOOK_SECRET`) para que **não vazem no repositório público**. Verificar se `.env` já está no `.gitignore` (sim, ele não está listado, mas `.env` geralmente é ignorado por padrão — precisamos adicionar se necessário).
4. Se Opção A: executar os comandos Git localmente para substituir o conteúdo do repositório existente.
5. Se Opção B: validar o novo repositório no GitHub e ativar o sync contínuo.
6. Verificar se o sync bidirecional está funcionando (fazer uma pequena alteração no Lovable e confirmar que reflete no GitHub, ou vice-versa).

## O que muda no código?
Provavelmente nada, exceto ajustes de segurança: garantir que arquivos de segredo (`.env`, variáveis de API) não sejam versionados. Se o repositório for público, isso é crítico.

## Segurança
- **Não commitar** `.env` com valores reais.
- **Não commitar** `supabase/config.toml` se contiver segredos (verificar antes).
- Documentar no README quais variáveis de ambiente são necessárias para rodar o projeto localmente.
