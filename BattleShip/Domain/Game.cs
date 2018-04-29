namespace BattleShip.Domain
{
    public enum BoardField
    {
        Free,
        Miss,
        Ship,
        ShipHit
    }

    public enum GamePhase
    {
        None,
        Player1Turn,
        Player2Turn,
        End
    }
}