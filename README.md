# SportMap

Plataforma web para organizar e encontrar partidas de futebol amador.

## Tecnologias

- HTML, CSS e JavaScript
- PHP com `mysqli`
- MySQL/MariaDB
- Leaflet e OpenStreetMap

## Instalação

1. Copie os arquivos do repositório para `C:\xampp\htdocs\sportmap\`.
2. No phpMyAdmin, execute nesta ordem `database/sportmap.sql`, `database/sportmap_v2.sql` e `database/sportmap_v3_permissoes.sql`.
3. Acesse `http://localhost/sportmap/`.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `login/` | Login e cadastro |
| `home/` | Telas depois do login |
| `js/` | Scripts das telas |
| `php/` | Requisições ao banco |
| `css/` | Estilos |

## CRUDs

| CRUD | Criar | Ler | Alterar | Excluir |
|---|---|---|---|---|
| Usuário | `usuario_novo` | `usuario_get` | `usuario_alterar` | `usuario_excluir` |
| Partida | `partida_novo` | `partida_get` | `partida_alterar` | `partida_excluir` |
| Escalação | `escalacao_novo` | `escalacao_get` | `escalacao_alterar` | `escalacao_excluir` |
| Quadra | `quadra_novo` | `quadra_get` | `quadra_alterar` | `quadra_excluir` |
| Time | `time_novo` | `time_get` | `time_alterar` | `time_excluir` |

## Tipos de partida

| Tipo | Na busca | Entrada |
|---|---|---|
| Pública | Aparece para todos | Direta |
| Privada visível | Aparece para todos | Aprovada pelo organizador (`escalacao_validar`) |
| Privada por convite | Só para organizador, admin e convidados | Por convite (`escalacao_convidar`) |

## CRUD

- **Chadi**
  - Módulo: `Partida`
  - Ações: Criar, listar, alterar e cancelar partidas

- **Edson**
  - Módulo: `Escalação`
  - Ações: Entrar em uma partida, ver jogadores, trocar de posição e sair

- **Edward**
  - Módulo: `Quadra`
  - Ações: Cadastrar, listar, alterar e excluir quadras, além do mapa

- **Leo Neves**
  - Módulo: `Usuário`
  - Ações: Criar conta, listar, alterar perfil e desativar conta

- **Pedro Viana**
  - Módulo: `Time`
  - Ações: Criar, listar, alterar e excluir times
