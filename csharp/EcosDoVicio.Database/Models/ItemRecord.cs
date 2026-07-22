namespace EcosDoVicio.Database.Models;

public sealed record ItemRecord(
    string Id,
    string Name,
    string Description,
    int Price,
    string Rarity,
    string Color,
    string MeshAsset,
    string SfxCue);
