using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace BattleShip.Hubs
{
    public static class Extensions
    {
        public static Task RemoveFromGroupAsync(this IGroupManager groupManager, string connectionId, Guid groupName,
                                                CancellationToken cancellationToken = default(CancellationToken))
        {
            return groupManager.RemoveFromGroupAsync(connectionId, groupName.ToString(), cancellationToken);
        }

        public static Task AddToGroupAsync(this IGroupManager groupManager, string connectionId, Guid groupName,
                                           CancellationToken cancellationToken = default(CancellationToken))
        {
            return groupManager.AddToGroupAsync(connectionId, groupName.ToString(), cancellationToken);
        }

        public static T OthersInGroup<T>(this IHubCallerClients<T> callerClients, Guid groupName)
        {
            return callerClients.OthersInGroup(groupName.ToString());
        }
    }
}