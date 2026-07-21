namespace EcosDoVicio.Database.Rules;

public sealed class BlackjackAiAdvisor
{
    private readonly BlackjackRules _rules = new();

    public string Recommend(IReadOnlyList<CardRecord> playerHand, CardRecord? dealerVisibleCard, int psy)
    {
        var score = _rules.Score(playerHand);
        if (score <= 11) return "hit";
        if (score >= 17) return "stand";
        if (psy < 25) return "stand";
        var dealerPressure = dealerVisibleCard is not null && (dealerVisibleCard.Value == "A" || dealerVisibleCard.Value is "7" or "8" or "9" or "10" or "J" or "Q" or "K");
        return dealerPressure ? "hit" : "stand";
    }

    public IReadOnlyList<string> DetectCheats(IReadOnlyList<CardRecord> playerHand, IReadOnlyList<CardRecord> dealerHand, bool dealerStopped)
    {
        var issues = new List<string>();
        if (dealerStopped && _rules.MustDealerHit(dealerHand)) issues.Add("Dealer parou antes de 17.");
        if (_rules.Score(playerHand) > 31 || _rules.Score(dealerHand) > 31) issues.Add("Pontuação impossível detectada.");
        if (playerHand.Count > 12 || dealerHand.Count > 12) issues.Add("Quantidade de cartas suspeita para uma mão.");
        return issues;
    }
}
