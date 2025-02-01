public interface IOpenAIService
{
    Task<string> EnhanceTaskDescription(string description);
    Task<string> SuggestCategory(string description);
    Task<string> EstimateTaskDuration(string description);
}