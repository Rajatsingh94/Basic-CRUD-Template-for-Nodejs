# Redis CRUD API with Node.js

This is a CRUD API server built with Node.js that connects to a Redis database to store and manage user data. The server exposes the following RESTful endpoints:

- `GET /redis/allusers`: Retrieves all users from the Redis database.
- `GET /redis/users/:id`: Retrieves a user from the Redis database by ID.
- `POST /redis/createuser`: Creates a new user in the Redis database.
- `PUT /redis/:id`: Updates an existing user in the Redis database by ID.
- `DELETE /redis/users/:id`: Deletes a user from the Redis database by ID.

## Requirements

This project requires the following dependencies:

- Node.js
- Express.js
- Redis

## Installation

To install and run this server, follow these steps:

1. Clone this repository to your local machine.
2. Install the dependencies by running `npm install` in the project directory.
3. Start the server by running `npm start`.
4. The server will listen on `localhost:3000` by default.

## Usage

### Retrieving all users

To retrieve all users from the Redis database, send a GET request to `/redis/allusers`. The server will respond with an array of user objects.

### Retrieving a user by ID

To retrieve a user from the Redis database by ID, send a GET request to `/redis/users/:id`, where `:id` is the ID of the user you want to retrieve. The server will respond with the user object, or a 404 error if the user is not found.

### Creating a new user

To create a new user in the Redis database, send a POST request to `/redis/createuser` with the user object in the request body. The server will respond with a success message if the user was added successfully.

### Updating an existing user

To update an existing user in the Redis database, send a PUT request to `/redis/:id`, where `:id` is the ID of the user you want to update. Include the updated user object in the request body. The server will respond with a success message if the user was updated successfully, or a 404 error if the user is not found.

### Deleting a user

To delete a user from the Redis database by ID, send a DELETE request to `/redis/users/:id`, where `:id` is the ID of the user you want to delete. The server will respond with a success message if the user was deleted successfully, or a 404 error if the user is not found.

## Credits

This project was created by [your name here]. It is released under the [MIT License](https://opensource.org/licenses/MIT).
