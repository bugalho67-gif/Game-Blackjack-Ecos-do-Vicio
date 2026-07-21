namespace EcosDoVicio.Database.Models;

public sealed record DialogChoiceRecord(
    string Id,
    string Label,
    string Type,
    ChoiceEffect Effect,
    string Outcome);
