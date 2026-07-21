namespace EcosDoVicio.Database.Models;

public sealed record EnemyRecord(
    string Id,
    string Name,
    string Subtitle,
    string Icon,
    string Color,
    string BarLabel,
    string BarColor,
    int TotalHands,
    string Bio,
    string MusicCue,
    string PortraitAsset,
    string ArenaLevel,
    IReadOnlyList<DialogRecord> Dialogs);
