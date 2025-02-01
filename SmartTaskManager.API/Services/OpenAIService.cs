using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

public class OpenAIService : IOpenAIService
{
    private readonly OpenAIClient _openAIClient;
    private readonly string _deploymentName = "gpt35"; // Update this to match your deployment

    public OpenAIService(IConfiguration configuration)
    {
        var endpoint = configuration["OpenAI:Endpoint"] 
            ?? throw new ArgumentNullException("OpenAI:Endpoint configuration is missing");
        var key = configuration["OpenAI:ApiKey"] 
            ?? throw new ArgumentNullException("OpenAI:ApiKey configuration is missing");
        
        _openAIClient = new OpenAIClient(new Uri(endpoint), new AzureKeyCredential(key));
    }

    public async Task<string> EnhanceTaskDescription(string description)
    {
        var completionsOptions = new ChatCompletionsOptions
        {
            DeploymentName = _deploymentName,
            Messages = 
            {
                new ChatRequestSystemMessage("You are a helpful assistant that improves task descriptions to be more clear and actionable."),
                new ChatRequestUserMessage($"Enhance this task description: {description}")
            },
            MaxTokens = 100
        };

        var response = await _openAIClient.GetChatCompletionsAsync(completionsOptions);
        return response.Value.Choices[0].Message.Content;
    }

    public async Task<string> SuggestCategory(string description)
    {
        var completionsOptions = new ChatCompletionsOptions
        {
            DeploymentName = _deploymentName,
            Messages = 
            {
                new ChatRequestSystemMessage("You are a helpful assistant that categorizes tasks. Respond with only one word."),
                new ChatRequestUserMessage($"Suggest a category for this task: {description}")
            },
            MaxTokens = 50
        };

        var response = await _openAIClient.GetChatCompletionsAsync(completionsOptions);
        return response.Value.Choices[0].Message.Content.Trim();
    }

    public async Task<string> EstimateTaskDuration(string description)
    {
        var completionsOptions = new ChatCompletionsOptions
        {
            DeploymentName = _deploymentName,
            Messages = 
            {
                new ChatRequestSystemMessage("You are a helpful assistant that estimates task duration. Provide estimates in hours."),
                new ChatRequestUserMessage($"Estimate time needed for this task: {description}")
            },
            MaxTokens = 50
        };

        var response = await _openAIClient.GetChatCompletionsAsync(completionsOptions);
        return response.Value.Choices[0].Message.Content;
    }
}