using EcosDoVicio.Database.Models;

namespace EcosDoVicio.Database.Repositories;

public interface IGameDatabase
{
    Task<GameDatabaseSnapshot> LoadContentAsync(CancellationToken cancellationToken = default);
    Task<EnemyRecord?> GetEnemyAsync(string enemyId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<MapEventRecord>> GetEventsByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task SaveGameAsync(SaveGameRecord save, CancellationToken cancellationToken = default);
    Task<SaveGameRecord?> LoadSaveAsync(CancellationToken cancellationToken = default);
}
