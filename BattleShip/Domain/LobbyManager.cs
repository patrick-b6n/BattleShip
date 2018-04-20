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

            var defaultLobby = new DefaulLobby();
            _lobbies.Add(defaultLobby.Id, defaultLobby);
        }

        public Lobby DefaultLobby => _lobbies[Constant.DefaultLobbyId];

        public IEnumerable<Lobby> All => _lobbies.Values;

        public Lobby CreateLobby()
        {
            var lobby = new Lobby();
            _lobbies.Add(lobby.Id, lobby);

            return lobby;
        }

        public Lobby Get(Guid modelId)
        {
            return _lobbies.TryGetValue(modelId, out var lobby) ? lobby : null;
        }

        public void Remove(Lobby oldLobby)
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

        private class DefaulLobby : Lobby
        {
            public DefaulLobby() : base(Constant.DefaultLobbyId)
            {
            }
        }
    }
}