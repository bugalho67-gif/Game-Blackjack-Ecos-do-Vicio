namespace EcosDoVicio.Database.Models;

public sealed record TransformRecord(
    float X,
    float Y,
    float Z,
    float Pitch,
    float Yaw,
    float Roll,
    float Scale = 1.0f);
