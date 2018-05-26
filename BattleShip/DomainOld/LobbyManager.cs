using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace BattleShip.DomainOld
{
    public class LobbyManager
    {
        private readonly ConcurrentDictionary<Guid, Lobby> _lobbies;

        public LobbyManager()
        {
            _lobbies = new ConcurrentDictionary<Guid, Lobby>();

            var defaultLobby = new DefaulLobby();
            _lobbies.AddOrUpdate(defaultLobby.Id, defaultLobby, (id, l) => defaultLobby);
        }

        public Lobby DefaultLobby => _lobbies[Constant.DefaultLobbyId];

        public IEnumerable<Lobby> All => _lobbies.Values;

        public Lobby CreateLobby()
        {
            var lobby = new Lobby();
            _lobbies.AddOrUpdate(lobby.Id, lobby, (id, l) => lobby);

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
                _lobbies.TryRemove(oldLobby.Id, out _);
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