using System.Text.Json;
using EcosDoVicio.Database.Models;
using MySqlConnector;

namespace EcosDoVicio.Database.MySql;

public sealed class MySqlSaveDatabase
{
    private const string UpsertSaveSql = """
        INSERT INTO save_games (slot_id, player_id, payload_json, save_timestamp)
        VALUES (@slotId, @playerId, @payloadJson, @saveTimestamp)
        ON DUPLICATE KEY UPDATE payload_json = VALUES(payload_json), save_timestamp = VALUES(save_timestamp);
        """;

    private readonly string _connectionString;
    private readonly JsonSerializerOptions _jsonOptions = new(JsonSerializerDefaults.Web) { WriteIndented = false };

    public MySqlSaveDatabase(string connectionString)
    {
        _connectionString = connectionString;
    }

    public async Task SaveAsync(string slotId, string playerId, SaveGameRecord save, CancellationToken cancellationToken = default)
    {
        var payload = save with { SaveTimestamp = DateTimeOffset.UtcNow };
        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = new MySqlCommand(UpsertSaveSql, connection);
        command.Parameters.AddWithValue("@slotId", slotId);
        command.Parameters.AddWithValue("@playerId", playerId);
        command.Parameters.AddWithValue("@payloadJson", JsonSerializer.Serialize(payload, _jsonOptions));
        command.Parameters.AddWithValue("@saveTimestamp", payload.SaveTimestamp?.UtcDateTime);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<SaveGameRecord?> LoadAsync(string slotId, string playerId, CancellationToken cancellationToken = default)
    {
        await using var connection = new MySqlConnection(_connectionString);
        await connection.OpenAsync(cancellationToken);
        await using var command = new MySqlCommand("SELECT payload_json FROM save_games WHERE slot_id = @slotId AND player_id = @playerId", connection);
        command.Parameters.AddWithValue("@slotId", slotId);
        command.Parameters.AddWithValue("@playerId", playerId);
        var payload = await command.ExecuteScalarAsync(cancellationToken) as string;
        return payload is null ? null : JsonSerializer.Deserialize<SaveGameRecord>(payload, _jsonOptions);
    }
}
