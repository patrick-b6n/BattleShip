using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BattleShip.Domain.Entity;

namespace BattleShip.Domain
{
    public class LobbyManager
    {
        private readonly List<Lobby> _lobbies;

        public LobbyManager()
        {
            _lobbies = new List<Lobby>();

            DefaultLobby = Create();
        }

        public Lobby DefaultLobby { get; }

        public IReadOnlyList<Lobby> Lobbies => _lobbies;

        public Lobby Create()
        {
            _lobbies.RemoveAll(l => l != DefaultLobby
                                    && l.Players.Count == 0
                                    && DateTime.UtcNow - l.Created > TimeSpan.FromMinutes(1));

            var lobby = new Lobby();
            _lobbies.Add(lobby);
            return lobby;
        }

        public (Result, Lobby) Get(Guid lobbyId)
        {
            var lobby = _lobbies.FirstOrDefault(x => x.Id == lobbyId);

            if (lobby != null)
            {
                return (Result.Success, lobby);
            }
            else
            {
                return (Result.NotFound, null);
            }
        }
    }
}