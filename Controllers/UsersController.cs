using Microsoft.AspNetCore.Mvc;
using FullstackReactDemo.Models;
using System.Text.Json;

namespace FullstackReactDemo.Controllers;

//Backend Dev (dotnet)
//    - create a Web api that will allow CRUD operations on a user profile
//    - user profile need only be: first name, last name, email
//    - API should be restful

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    // TODO(levirak): get a real database
    private static Dictionary<Guid, UserModel> Users = new Dictionary<Guid, UserModel>();

    static UsersController()
    {
        Insert(new UserModel("Levi", "Rak", "levirak@email.example"));
        Insert(new UserModel("Henry", "Fonda", "henryfonda@email.example"));
    }

    private static UserModel Insert(UserModel NewUser)
    {
        // find a guid we haven't already used
        // this will likely never loop
        // TODO(levirak): not thread safe
        Guid NewId = Guid.NewGuid();
        while (Users.ContainsKey(NewId)) {
            NewId = Guid.NewGuid();
        }

        NewUser.Id = NewId;
        Users.Add(NewId, NewUser);
        return NewUser;
    }

    [HttpGet]
    public IActionResult Get() => Ok(Users.Values.ToArray());

    [HttpGet("{id:guid}")]
    public IActionResult GetUser(Guid Id)
    {
        IActionResult result;

        if (!Users.TryGetValue(Id, out UserModel? User)) {
            result = NotFound();
        }
        else {
            result = Ok(User);
        }

        return result;
    }

    [HttpPost]
    public async Task<IActionResult> PostUser()
    {
        IActionResult result;

        // TODO(levirak): test how this handles funny input
        UserModel? Body = await JsonSerializer.DeserializeAsync<UserModel>(Request.Body);
        if (Body == null) {
            result = BadRequest();
        }
        else {
            result = Ok(Insert(Body));
        }

        return result;
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> PutUser(Guid Id)
    {
        IActionResult result;
        UserModel? Body;

        if (!Users.TryGetValue(Id, out UserModel? User)) {
            result = NotFound();
        }
        else if ((Body = await JsonSerializer.DeserializeAsync<UserModel>(Request.Body)) == null) {
            // TODO(levirak): test how this handles funny input
            result = BadRequest();
        }
        else {
            User.Update(Body);
            result = Ok();
        }

        return result;
    }

    [HttpDelete("{id:guid}")]
    public IActionResult DeleteUser(Guid Id)
    {
        Users.Remove(Id);
        return Ok();
    }
}
