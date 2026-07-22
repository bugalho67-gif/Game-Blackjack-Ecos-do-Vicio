namespace EcosDoVicio.Database.Models;

public sealed record SaveGameRecord(
    int CurEnemy,
    int TotalEnemies,
    bool DealerFight,
    bool CampaignDone,
    Dictionary<string, int> GlobalRoute,
    int Gold,
    IReadOnlyList<string> Inventory,
    Dictionary<string, string> SavedRoutes,
    Dictionary<string, Dictionary<string, bool>> BookUnlocks,
    int Psy,
    int Spec,
    int SecretCount,
    string? LastItemEarned,
    DateTimeOffset? SaveTimestamp);
