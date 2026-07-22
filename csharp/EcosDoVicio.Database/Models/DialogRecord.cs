namespace EcosDoVicio.Database.Models;

public sealed record DialogRecord(
    string Id,
    int TriggerHand,
    string Text,
    string Note,
    IReadOnlyList<DialogChoiceRecord> Choices);
