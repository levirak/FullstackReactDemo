namespace FullstackReactDemo.Models;

using System.Text.Json.Serialization;

public class UserModel
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; } = Guid.Empty;

    [JsonPropertyName("firstName")]
    public string FirstName { get; set; } = String.Empty;

    [JsonPropertyName("lastName")]
    public string LastName { get; set; } = String.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = String.Empty;

    public void Update(UserModel That) {
        this.FirstName = That.FirstName;
        this.LastName = That.LastName;
        this.Email = That.Email;
    }

    public UserModel(string FirstName, string LastName, String Email) {
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
    }
}
