using System;
using System.Collections.Generic;
using System.Linq;
using BattleShip.Domain.Entity;

namespace BattleShip.Hubs
{
    public class ConnectModel
    {
        public string Name { get; set; }
    }

    public class ConnectedModel
    {
        public PlayerModel Player { get; set; }

        public Guid DefaultLobbyId { get; set; }
    }

    public class JoinLobbyModel
    {
        public Guid LobbyId { get; set; }
    }

    public class LobbyJoinedModel
    {
        public LobbyModel Lobby { get; set; }
    }

    public class RequestMatchModel
    {
        public PlayerModel From { get; set; }

        public PlayerModel To { get; set; }
    }

    public class FireShotModel
    {
        public int X { get; set; }

        public int Y { get; set; }

        public PlayerModel To { get; set; }
    }

    public class FireShotResponseModel
    {
        public int X { get; set; }

        public int Y { get; set; }

        public PlayerModel To { get; set; }

        public bool IsSunk { get; set; }

        public bool IsHit { get; set; }

        public List<ShipModel> RemainingShips { get; set; }
    }

    public class ShipModel
    {
        public int Length { get; set; }

        public bool IsSunk { get; set; }
    }

    public class PlayerModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public static PlayerModel Map(Player player)
        {
            return new PlayerModel
            {
                Id = player.Id,
                Name = player.Name
            };
        }
    }

    public class LobbyModel
    {
        public Guid Id { get; set; }

        public IEnumerable<PlayerModel> Players { get; set; }

        public static LobbyModel Map(Lobby lobby)
        {
            return new LobbyModel {Id = lobby.Id, Players = lobby.Players.Select(PlayerModel.Map)};
        }
    }
}