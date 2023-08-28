# FullstackReactDemo

This is a minimum viable product of a simple client-server service. It was
created as an interview project.

## Usage

This project may be run using the `dotnet` CLI. It can be viewed by using
running `dotnet run` from the repository root. To use the Bing search feature,
you must set the `REACT_APP_AZURE_SUBSCRIPTION_KEY` environment variable to
contain an Azure subscription key.

## The Assignment

Front-end

- Create a ReactJS application that leverages the Bing search API
- Must take a search input and display list of results

Backend

- Create a Web API that will allow CRUD operations on a user profile
- User profile need only be: first name, last name, email
- API should be restful

## Future Direction

The application could broadly use some UX considerations. I've made a vague
attempt at it, but most of what I currently have came from the template I
generated this repo from.

The _Search Page_ calls to Bing directly. This was useful for testing, but it
would require a production app to distribute an Azure subscription key. If
there is a way for Azure to programmatically generate a temporary, limited,
revocable key, then that could be acceptable. Otherwise, I would route the Bing
traffic through the back end so that the secret key would never leave my
server.

The _Manage Users_ page, it is a little contrived. It's job is to highlight
restful operations of a dataset of users. A more realistic scenario would be
for this to be related to user creating, viewing, updating, and deleting their
own account.

Authentication middleware should be added to secure the _Manage Users_ portal
so that only authorized personal can modify user data. This would include a
log-in mechanism. I could have gotten much of that for free had I generated
this repo using `dotnet new react -au Individual`, but I was unaware of that at
the time. Instead, I would add that myself.
