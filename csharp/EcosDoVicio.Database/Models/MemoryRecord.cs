namespace EcosDoVicio.Database.Models;

public sealed record MemoryRecord(
    string Id,
    string Name,
    string Subtitle,
    string Icon,
    IReadOnlyList<MemorySectionRecord> Sections);

public sealed record MemorySectionRecord(
    string Label,
    string Text,
    string? UnlockRoute);
