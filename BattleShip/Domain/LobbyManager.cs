using System;
using System.Collections.Generic;

namespace BattleShip.Domain
{
    public class LobbyManager
    {
        private readonly Dictionary<Guid, Lobby> _lobbies;

        public LobbyManager()
        {
            _lobbies = new Dictionary<Guid, Lobby>();

            Add(new Lobby(DefaultLobbyId));
        }

        public static Guid DefaultLobbyId { get; } = Guid.Parse("F93B7255-6B78-42B0-A16B-AB80B9F57DD5");

        public Lobby DefaultLobby => _lobbies[DefaultLobbyId];

        public IEnumerable<Lobby> All => _lobbies.Values;

        public void Add(Lobby lobby)
        {
            _lobbies.Add(lobby.Id, lobby);
        }

        public Lobby Get(Guid modelId)
        {
            return _lobbies.TryGetValue(modelId, out var lobby) ? lobby : null;
        }


        internal void Remove(Lobby oldLobby)
        {
            if (oldLobby.IsEmpty)
            {
                _lobbies.Remove(oldLobby.Id);
            }
            else
            {
                throw new Exception("Cannot remove lobby with players");
            }
        }
    }
}