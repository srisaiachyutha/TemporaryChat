using System.ComponentModel.DataAnnotations;

namespace temporarychat.Models.Requests
{
    public class RoomRequest
    {
        [Required]
        public string RoomName { get; set; }

        [Required]
        public string UserName { get; set; }
    }
}
