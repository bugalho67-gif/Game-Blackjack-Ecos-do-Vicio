namespace EcosDoVicio.Database.Rules;

public sealed class BlackjackRules
{
    public int Score(IEnumerable<CardRecord> hand)
    {
        var total = 0;
        var aces = 0;
        foreach (var card in hand)
        {
            total += card.Value switch { "A" => 11, "J" or "Q" or "K" => 10, _ => int.Parse(card.Value) };
            if (card.Value == "A") aces += 1;
        }
        while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
        return total;
    }

    public bool MustDealerHit(IEnumerable<CardRecord> dealerHand) => Score(dealerHand) < 17;
    public bool IsBust(IEnumerable<CardRecord> hand) => Score(hand) > 21;
}
