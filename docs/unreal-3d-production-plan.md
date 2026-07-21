# Plano de produção 3D — Blackjack: Ecos do Vício

## Direção

O jogo deve migrar para um cassino 3D sombrio, íntimo e opressivo. A mesa de blackjack continua sendo o ritual central, mas o jogador passa a atravessar espaços físicos: corredor, loja, mesas dos inimigos, livro de memórias e sala do Dealer.

## Módulos 3D previstos

| Sistema | Unreal | Fonte de dados |
| --- | --- | --- |
| Inimigos | `BP_EnemySeat` / `DA_Enemy` | `EnemyRecord` |
| Mesa | `BP_BlackjackTable` | `Battle` + `Deck` |
| Cartas | `BP_CardActor` | carta `{ v, s }` |
| Loja | `BP_VendorShop` | `ItemRecord` |
| Eventos | `BP_MapEventTrigger` | `MapEventRecord` |
| Memórias | `WBP_MemoryBook` | `MemoryRecord` |
| Save | `USaveGame` ou C# tooling | `SaveGameRecord` |
| Posicionamento | Actors/Level instances | `LevelPlacementRecord` |

## Fluxo de produção

1. Criar arenas por inimigo (`L_Joao_Table`, `L_Mariana_Table`, `L_Andre_Table`, `L_Thais_Table`, `L_Dealer_Room`).
2. Criar uma mesa 3D reutilizável que recebe dados de inimigo e estado da batalha.
3. Mapear retratos atuais para bustos/poses 3D ou ilustrações em planos no cenário.
4. Associar trilhas por inimigo via `musicCue` e SFX por ação via `AudioManager`/SoundCue.
5. Usar `LevelPlacementRecord` para manter spawn points, loja, mesa, NPCs e triggers fora de Blueprints hard-coded.
6. Manter IDs estáveis entre web, C# e Unreal para facilitar migração incremental.

## Banco de dados

A fase inicial usa JSON versionável no Git e fornece schema SQLite em `csharp/EcosDoVicio.Database/Schemas/ecos_do_vicio.sqlite.sql`. Em produção, o conteúdo pode ser empacotado como DataTables ou DataAssets, enquanto saves de usuário seguem `SaveGameRecord`.
