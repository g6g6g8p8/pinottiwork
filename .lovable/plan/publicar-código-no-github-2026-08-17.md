# Publicar código no GitHub

## Objetivo
Sincronizar o código-fonte do projeto no repositório GitHub já conectado: `https://github.com/g6g6g8p8/pinottiwork.git`.

## Estado atual verificado
- O projeto possui uma configuração `.git` que aponta para o template interno do Lovable (`/nix/store/.../template-pool/git/repo.git/worktrees/dev-server`), não para o GitHub.
- O usuário informa que a integração GitHub do Lovable já está conectada ao repositório `g6g6g8p8/pinottiwork`.
- `.gitignore` já está configurado corretamente para excluir `node_modules`, `dist`, `.vinxi`, `.wrangler`, `.tanstack/**`, `.nitro`, etc.

## O que será feito
1. Confirmar a conexão GitHub via interface do Lovable (Plus menu → GitHub) e verificar se o repositório está listado.
2. Forçar o sync do estado atual do projeto para o GitHub, garantindo que todo o código atual esteja refletido no repositório.
3. Revisar segurança antes do push:
   - Verificar se `.env` está no `.gitignore` (ele não está listado atualmente; precisa ser adicionado se existir um arquivo `.env` real com segredos).
   - Garantir que arquivos como `supabase/config.toml` não contenham segredos no conteúdo versionado.
   - Confirmar que variáveis como `AIROPS_API_KEY` e `AIROPS_WEBHOOK_SECRET` não estão hardcoded no código (elas são lidas de `process.env`, então o risco é só se `.env` for commitado).
4. Verificar se `.env` existe no projeto. Se existir, adicionar `.env` e `.env.*` ao `.gitignore` para evitar vazamento.
5. Confirmar no GitHub que o último commit reflete o código atual do projeto.

## O que muda no código
- Apenas ajustes de segurança no `.gitignore` se necessário (`+.env` e `+.env.*`).
- Nenhuma alteração funcional no site.

## Riscos
- Se o repositório no GitHub for público, commitar `.env` ou outros segredos expõe credenciais. Verificaremos antes de qualquer sync.
- O sync Lovable → GitHub pode gerar conflitos se houver commits no GitHub que não existam no Lovable. Neste caso, o Lovable geralmente sobrescreve com o estado atual do projeto.
