using System;

namespace BattleShip.Domain
{
    public class Player
    {
        public Player(string id)
        {
            Id = id;
            Name = Guid.NewGuid().ToString();
        }

        public string Id { get; }

        public Lobby Lobby { get; private set; }

        public string Name { get; private set; }

        public void ChangeName(string name)
        {
            Name = name;
        }

        public void Joined(Lobby lobby)
        {
            Lobby = lobby;
        }

        public Lobby LeaveLobby()
        {
            Lobby.Leave(this);

            var l = Lobby;
            Lobby = null;
            return l;
        }
    }
}