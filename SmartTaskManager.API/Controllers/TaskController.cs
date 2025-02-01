using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IOpenAIService _openAIService;

    public TaskController(ApplicationDbContext context, IOpenAIService openAIService)
    {
        _context = context;
        _openAIService = openAIService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
    {
        var tasks = await _context.Tasks
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Category = t.Category,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);

        if (task == null)
        {
            return NotFound();
        }

        var taskDto = new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Category = task.Category,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted
        };

        return Ok(taskDto);
    }

    // [HttpPost]
    // public async Task<ActionResult<TaskDto>> CreateTask(TaskDto taskDto)
    // {
    //     // Enhance description using OpenAI
    //     var enhancedDescription = await _openAIService.EnhanceTaskDescription(taskDto.Description);
    //     var suggestedCategory = await _openAIService.SuggestCategory(taskDto.Description);

    //     var task = new Task
    //     {
    //         Title = taskDto.Title,
    //         Description = enhancedDescription,
    //         Category = suggestedCategory,
    //         DueDate = taskDto.DueDate,
    //         IsCompleted = false,
    //         CreatedAt = DateTime.UtcNow
    //     };

    //     _context.Tasks.Add(task);
    //     await _context.SaveChangesAsync();

    //     taskDto.Id = task.Id;
    //     taskDto.Description = enhancedDescription;
    //     taskDto.Category = suggestedCategory;

    //     return CreatedAtAction(nameof(GetTask), new { id = task.Id }, taskDto);
    // }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(TaskDto taskDto)
    {
        
        var enhancedDescription = await _openAIService.EnhanceTaskDescription(taskDto.Description);
        var suggestedCategory = await _openAIService.SuggestCategory(taskDto.Description);

        var task = new Task
        {
            Title = taskDto.Title,
            Description = enhancedDescription, // Use original description
            Category = suggestedCategory, // Default category
            DueDate = taskDto.DueDate,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UserId = "temp-user" // Temporary user ID until we implement authentication
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        taskDto.Id = task.Id;
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, taskDto);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskDto taskDto)
    {
        if (id != taskDto.Id)
        {
            return BadRequest();
        }

        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        task.Title = taskDto.Title;
        task.Description = taskDto.Description;
        task.Category = taskDto.Category;
        task.DueDate = taskDto.DueDate;
        task.IsCompleted = taskDto.IsCompleted;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TaskExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TaskExists(int id)
    {
        return _context.Tasks.Any(e => e.Id == id);
    }
}