public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public DateTime DueDate { get; set; }
    public bool IsCompleted { get; set; }
}