using System;

namespace BattleShip.Domain.Entity
{
    public class Player
    {
        internal Player(string connectionId, string name)
        {
            Id = Guid.NewGuid();
            Lobby = null;
            ConnectionId = connectionId;
            Name = name;
        }

        public Guid Id { get; }

        public string ConnectionId { get; }

        public string Name { get; private set; }

        public Lobby Lobby { get; private set; }

        public void UpdateName(string name)
        {
            Name = name;
        }

        public void Join(Lobby lobby)
        {
            Lobby = lobby;
            Lobby.AddPlayer(this);
        }

        public Lobby LeaveLobby()
        {
            var l = Lobby;
            Lobby.RemovePlayer(this);
            Lobby = null;

            return l;
        }
    }
}