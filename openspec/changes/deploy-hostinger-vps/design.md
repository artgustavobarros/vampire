## Context

- VPS Hostinger KVM 1 (`srv1631900.hstgr.cloud`, `177.7.51.113`), Ubuntu, com Docker Manager. Nas portas 80/443 já responde um Traefik (certificado `TRAEFIK DEFAULT CERT`, redireciona HTTP para HTTPS). Há outro projeto no VPS que vai ser retirado.
- Domínio `artbarros.tech` gerenciado na Hostinger; a raiz aponta para outro servidor (`2.57.91.91`) e continua assim. O app vai num subdomínio.
- O Traefik do VPS é o template da Hostinger, projeto próprio do Docker Manager em `/docker/traefik-5k2e`. Roda com `network_mode: host`, entrypoints `web` (:80, redireciona para HTTPS) e `websecure` (:443), cert resolver `letsencrypt` (desafio HTTP) e descobre os containers por labels. A documentação da Hostinger fala numa rede `traefik-proxy`, mas esse template não a usa.
- A action `hostinger/deploy-on-vps` não constrói imagem: manda para a API da Hostinger a URL `github.com/<dono>/<repo>/blob/<sha>/<compose>` e o VPS clona esse commit em `/docker/<projeto>/` e roda o compose com os `build:`. As variáveis vão no campo `environment` como texto `KEY=value`.
- O `web` só chama a API pelo navegador (token no `localStorage`, sem loader de SSR buscando dados), e `web/src/lib/api.ts` monta a URL como `${API_URL}${path}`.
- A API já valida `JWT_SECRET` com 32+ caracteres e tem `GET /api/health`.

## Goals / Non-Goals

**Goals:**
- App público com HTTPS num subdomínio de `artbarros.tech`, com deploy a cada push na `main`.
- Nada de segredo no repositório, nem porta de banco exposta.
- Trocar de domínio sem rebuild.

**Non-Goals:**
- Backup automático do Postgres.
- Imagens pré-construídas em registry (GHCR); o build fica no VPS por enquanto.
- Ambiente de staging.
- Mudar o compose de desenvolvimento.

## Decisions

**Um domínio, API por caminho (`/api`).** O Traefik manda `Host(APP_HOST) && PathPrefix(/api)` para a `api` e `Host(APP_HOST)` para o `web`; a regra mais longa ganha prioridade automaticamente. O `web` é construído com `VITE_API_URL=/api`. Alternativa: subdomínio `api.` separado, que exigiria dois registros DNS, dois certificados, CORS e a URL absoluta presa na imagem. O caminho relativo funciona porque todas as chamadas saem do navegador.

**Arquivo separado `docker-compose.prod.yml`, sem herdar do de dev.** Um override (`-f a -f b`) não serve: o Docker Manager recebe um arquivo só, e remover `ports:` por override exige `!reset`. O arquivo de produção é autocontido.

**Segredos com `${VAR:?mensagem}`.** Sem padrão, o compose falha dizendo o que falta. A senha do Postgres entra em `POSTGRES_PASSWORD` do `db` e na `DATABASE_URL` da `api`, e por isso MUST ser só letras e números (senão quebraria a URL). A action também injeta o texto das variáveis num comando de shell, outro motivo para gerar os segredos com `openssl rand -hex 32`.

**`CORS_ORIGIN=https://${APP_HOST}`.** Com mesma origem o CORS nem entra em jogo, mas o valor certo evita que o padrão `http://localhost:3000` libere alguma coisa por engano.

**`APP_HOST` como variable do GitHub, não secret.** Não é segredo e fica visível nos logs, o que ajuda a depurar.

**Sem rede externa.** Com o Traefik em `network_mode: host`, ele chega aos containers pelo IP deles na rede padrão do projeto (o host tem rota para as redes bridge do Docker). Declarar a `traefik-proxy` como `external` faria o `up` falhar, porque ela não existe. Testado localmente com um Traefik em modo host.

**Nome de projeto fixo `vampire`.** O volume vira `vampire_pgdata` no VPS e a pasta `/docker/vampire/`. Routers e services com prefixo `vampire-` para não colidir com outros projetos no mesmo Traefik.

**Healthchecks com `wget` do busybox.** As imagens são `node:24-alpine`, que já têm `wget`; não precisa instalar `curl`. Com healthcheck, o Traefik só roteia para o container depois que ele fica saudável.

**Workflow com validação e `concurrency`.** Um passo antes da action confere os secrets e variables e falha com mensagem clara; `concurrency` impede dois deploys ao mesmo tempo. `workflow_dispatch` permite reimplantar sem commit.

**Mestre por variável, garantido na subida.** A migração `0001_roles` inseria `admin@admin.com` com senha em texto num comentário e hash no SQL; com o repositório público, isso daria o papel de Mestre em produção a qualquer um. O `INSERT` sai da migração (o journal do Drizzle não guarda hash, e bancos que já a aplicaram não a rodam de novo) e um provider `AdminBootstrap` faz upsert do Mestre em `onApplicationBootstrap`, com a senha de `ADMIN_PASSWORD`. A variável é a fonte da verdade: trocar o secret e reimplantar troca a senha. Alternativas: trocar a senha à mão depois do deploy (deixa uma janela com senha pública) ou promover a própria conta por SQL (sem caminho de recuperação).

**Swagger continua em `/api/docs`.** O app é de uso entre amigos e a documentação ajuda a depurar; fica fora deste change desligar por variável.

## Risks / Trade-offs

- [O Traefik está parado no VPS] → ligar o projeto `traefik-5k2e` no Docker Manager antes do primeiro deploy.
- [Se o template do Traefik mudar para uma rede própria] → as labels e a seção de redes do compose são o único lugar a ajustar.
- [Build no VPS a cada push: mais lento e pesa no KVM 1] → aceitável agora; se incomodar, migrar para imagens no GHCR.
- [Deploy da Hostinger é assíncrono: o workflow fica verde quando a API aceita o pedido, não quando o app sobe] → acompanhar pelo Docker Manager (logs do projeto) nos primeiros deploys.
- [Let's Encrypt só emite se o DNS já aponta para o VPS] → criar o registro A antes do primeiro deploy e esperar propagar.
- [Sem backup do banco] → fora deste change; a snapshot do VPS no hPanel cobre o básico.

## Migration Plan

1. Usuário: confere o Traefik, cria o registro A, cria o repositório público, a chave da API e os secrets e variables.
2. Push na `main` dispara o primeiro deploy; a `api` aplica as migrações num banco vazio.
3. Rollback: reverter o commit na `main` (novo deploy do anterior) ou parar o projeto `vampire` no Docker Manager. O volume `vampire_pgdata` não é apagado por redeploy.

## Open Questions

- Nome final do subdomínio (é só o valor de `APP_HOST`).
