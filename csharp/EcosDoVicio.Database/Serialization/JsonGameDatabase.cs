using System.Text.Json;
using EcosDoVicio.Database.Models;
using EcosDoVicio.Database.Repositories;

namespace EcosDoVicio.Database.Serialization;

public sealed class JsonGameDatabase : IGameDatabase
{
    private readonly string _contentPath;
    private readonly string _savePath;
    private readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web) { WriteIndented = true };

    public JsonGameDatabase(string contentPath, string savePath)
    {
        _contentPath = contentPath;
        _savePath = savePath;
    }

    public async Task<GameDatabaseSnapshot> LoadContentAsync(CancellationToken cancellationToken = default)
    {
        await using var stream = File.OpenRead(_contentPath);
        return await JsonSerializer.DeserializeAsync<GameDatabaseSnapshot>(stream, _jsonOptions, cancellationToken)
            ?? new GameDatabaseSnapshot([], [], [], [], []);
    }

    public async Task<EnemyRecord?> GetEnemyAsync(string enemyId, CancellationToken cancellationToken = default)
    {
        var snapshot = await LoadContentAsync(cancellationToken);
        return snapshot.Enemies.FirstOrDefault(enemy => enemy.Id == enemyId);
    }

    public async Task<IReadOnlyList<MapEventRecord>> GetEventsByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        var snapshot = await LoadContentAsync(cancellationToken);
        return snapshot.Events.Where(gameEvent => gameEvent.Category == category).ToArray();
    }

    public async Task SaveGameAsync(SaveGameRecord save, CancellationToken cancellationToken = default)
    {
        var payload = save with { SaveTimestamp = DateTimeOffset.UtcNow };
        Directory.CreateDirectory(Path.GetDirectoryName(_savePath) ?? ".");
        await using var stream = File.Create(_savePath);
        await JsonSerializer.SerializeAsync(stream, payload, _jsonOptions, cancellationToken);
    }

    public async Task<SaveGameRecord?> LoadSaveAsync(CancellationToken cancellationToken = default)
    {
        if (!File.Exists(_savePath)) return null;
        await using var stream = File.OpenRead(_savePath);
        return await JsonSerializer.DeserializeAsync<SaveGameRecord>(stream, _jsonOptions, cancellationToken);
    }
}
