public class UserDto
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
}

// You might also want to add these additional DTOs in the same file for user operations:

public class UserLoginDto
{
    public string Email { get; set; }
    public string Password { get; set; }
}

public class UserRegistrationDto
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class UserResponseDto
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Token { get; set; }
}