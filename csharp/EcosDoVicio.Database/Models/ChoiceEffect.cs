namespace EcosDoVicio.Database.Models;

public sealed record ChoiceEffect(
    int Gold = 0,
    int Psy = 0,
    int Spec = 0,
    string? Route = null,
    string? ItemId = null,
    string? MemoryId = null);
