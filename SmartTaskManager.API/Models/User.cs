public class User
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public ICollection<Task> Tasks { get; set; }
}