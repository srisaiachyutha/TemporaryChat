using Microsoft.AspNetCore.SignalR;

namespace temporarychat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;
        public ChatHub(
            ILogger<ChatHub> logger)
        {
            _logger = logger;
        }
        public async Task SendMessage(string user, string message)
        {
            //_logger.LogInformation(" send message {user}, {message}", user, message);
            await Clients.All.SendAsync("ReceiveMessage", user, message, Context.ConnectionId);
        }

        public async Task SendMessageToGroup(string groupName, string userName, string message)
        {
            //_logger.LogInformation(" send message {id}, {user} {message}",Context.ConnectionId, userName, message);

            await Clients.OthersInGroup(groupName)
                .SendAsync("ReceiveGroupMessage", userName, message, Context.ConnectionId);
            await Clients.Caller.SendAsync("ReceiveMessage", message, Context.ConnectionId);

        }

        public async Task JoinRoom(string roomName)
        {
            //_logger.LogInformation(" join room {connectionId}, {roomName}", Context.ConnectionId, roomName);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task LeaveRoom(string roomName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        }
    }
}
