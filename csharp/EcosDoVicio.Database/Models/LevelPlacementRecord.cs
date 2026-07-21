namespace EcosDoVicio.Database.Models;

public sealed record LevelPlacementRecord(
    string Id,
    string LevelName,
    string ActorBlueprint,
    string GameplayTag,
    TransformRecord Transform,
    string? EnemyId = null,
    string? ItemId = null,
    string? EventId = null);
