namespace EcosDoVicio.Database.Models;

public sealed record GameDatabaseSnapshot(
    IReadOnlyList<EnemyRecord> Enemies,
    IReadOnlyList<ItemRecord> Items,
    IReadOnlyList<MemoryRecord> Memories,
    IReadOnlyList<MapEventRecord> Events,
    IReadOnlyList<LevelPlacementRecord> LevelPlacements);
