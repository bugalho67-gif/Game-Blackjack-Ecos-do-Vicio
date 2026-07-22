# EcosDoVicio.Database

Camada C# inicial para preparar **Blackjack: Ecos do Vício** para produção em 3D e integração futura com Unreal.

## Objetivo

- Manter dados narrativos e de gameplay fora de Blueprints.
- Fornecer contratos fortes para inimigos, diálogos, escolhas, itens, memórias, eventos de mapa, save e posicionamento 3D.
- Permitir prototipagem com JSON e migração posterior para SQLite, backend ou DataTables exportadas para Unreal.

## Exports principais

- `IGameDatabase`: contrato de leitura de conteúdo e save/load.
- `JsonGameDatabase`: implementação inicial baseada em JSON local.
- `GameDatabaseSnapshot`: agregado de conteúdo para carregar no início do jogo.
- `EnemyRecord`, `DialogRecord`, `DialogChoiceRecord`: dados narrativos e mecânicos de inimigos.
- `ItemRecord`, `MemoryRecord`, `MapEventRecord`: loja, livro de memórias e eventos aleatórios.
- `LevelPlacementRecord`: referência entre dados de jogo e cenas 3D no Unreal.
- `SaveGameRecord`: contrato de save compatível com o estado global definido para o jogo.

## Dependências

A biblioteca usa apenas APIs do .NET (`System.Text.Json`, `System.IO`, `LINQ`) para evitar dependências externas nesta fase.

## Próximo passo Unreal

1. Exportar `GameDatabaseSnapshot` para JSON/DataTable.
2. Importar no Unreal como DataAssets ou DataTables.
3. Criar Blueprints/Actors com `GameplayTag` equivalente aos registros de `LevelPlacementRecord`.
4. Substituir o protótipo web por cenas 3D usando os mesmos IDs (`enemy.id`, `item.id`, `event.id`).
