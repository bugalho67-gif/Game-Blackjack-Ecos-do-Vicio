namespace EcosDoVicio.Database.Models;

public sealed record MapEventRecord(
    string Id,
    string Category,
    string Text,
    bool Once,
    IReadOnlyList<MapEventChoiceRecord> Choices);

public sealed record MapEventChoiceRecord(
    string Label,
    ChoiceEffect Effect);
