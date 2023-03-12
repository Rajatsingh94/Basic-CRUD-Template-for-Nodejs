/**
 * This module requires the built-in 'https' and 'express' modules.
 */
const express = require('express');
const app = express();

/**
 * Generates a unique identifier for each user and stores it in the Redis database.
 */
const uuid = require('uuid');

/**
 * Configures and connects to a Redis database instance. The Redis database is used
 * to store user data and can be accessed using the Redis client object. This function
 * initializes the Redis client object and sets up event listeners to handle connection
 * errors and other events.
 */
const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});

/**
 * Successfully connects to a Redis database instance running on port 6379.
 */
client.on('connect', function() {
   console.log(`Connected to Redis on port 6379`); 
});


/**
 * Configures and adds a JSON middleware parser to the Express application.
 */
app.use(express.json());

/**
 * Specifies the port number that the Express application should listen on.
 */
const port = 3000;


/**
 * Retrieve all users from the Redis database.
 *
 * @route GET /redis/allusers
 * @returns {object[]} An array of user objects retrieved from the database.
 */
app.get('/redis/allusers', (req, res)=>{
    client.keys('*', (err, key)=>{
        if(err){
            console.log(err);
            res.status(500).send("Error retrieving users");
            return;
        }
        const multi = client.multi();
        key.forEach(key=>multi.get(key));
        multi.exec((err, users)=> {
            if(err){
                console.log(err);
                res.status(500).send("Error retrieving users");
                return;
            }

            const parsedUser = users.map(user=>JSON.parse(user));
            res.json(parsedUser);
        });
    });
});

/**
 * Retrieve a user from the Redis database by ID.
 *
 * @route GET /redis/users/:id
 * @param {string} id The ID of the user to retrieve.
 * @returns {object} The user object retrieved from the database.
 */
app.get('/redis/users/:id', (req, res) => {
    const id = req.params.id;

    //getting from redisdb
    client.get(id, (err, redisRes) => {
        console.log(id);
        console.log(redisRes);
        if(err){
            console.log(err);
            res.status(500).send('Error retrieving user data');
        }else if(redisRes){
            const name = JSON.parse(redisRes);
            res.json(name);
        }else{
            res.status(404).send('user not found');
        }
    })
    
});

/**
 * Create a new user in the Redis database.
 *
 * @route POST /redis/createusers
 * @param {object} user The user object to create.
 * @returns {string} A message indicating that the user was added successfully to the database.
 */
app.post('/redis/createuser', (req, res) => {
    const user = req.body;
    const id = uuid.v4();
    const key = 'User:' + id;
  
    client.exists(key, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error checking if user exists');
        return;
      }
  
      if (result === 1) {
        res.status(400).send('User with ID ' + id + ' already exists');
      } else {
        client.set(key, JSON.stringify(user), (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error adding user to database');
            return;
          }
          res.status(201).send('User added successfully to the database');
        });
      }
    });
  });

/**
 * Update an existing user in the Redis database by ID.
 *
 * @route PUT /redis/:id
 * @param {string} id The ID of the user to update.
 * @param {object} user The updated user object.
 * @returns {string} A message indicating that the user was updated successfully.
 */
app.put('/redis/:name', (req, res) => {
    const id = req.params.name;
    const user = req.body;
    const key = 'User:' + id;
  
    client.exists(key, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error checking if user exists');
        return;
      }
  
      if (result === 0) {
        res.status(404).send('User not found');
      } else {
        client.get(key, (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error updating user in the database');
            return;
          }
  
          const oldUser = JSON.parse(result);
          const updatedUser = { ...oldUser, ...user };
  
          client.set(key, JSON.stringify(updatedUser), (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error updating user in the database');
              return;
            }
  
            res.status(200).send('User updated successfully in the database');
          });
        });
      }
    });
  });


/**
 * Delete a user from the Redis database by ID.
 *
 * @route DELETE /redis/users/:id
 * @param {string} id The ID of the user to delete.
 * @returns {string} A message indicating that the user was deleted successfully.
 */
app.delete('/redis/users/:name', (req, res) => {
    const id = req.params.name;
    const key = 'User:' + id;

    client.exists(key, (err, result) => {
        if (err) {
        console.log(err);
        res.status(500).send('Error checking if user exists');
        return;
        }

        if (result === 1) {
        client.del(key, (err, result) => {
            if (err) {
            console.log(err);
            res.status(500).send('Error deleting user from database');
            return;
            }

            res.status(200).send('User deleted from database');
        });
        } else {
        res.status(404).send('User not found');
        }
  });    
});


/** Web server listening to http request */
app.listen(3000, (req, res) => {
    console.log(`Server listening on port ${port}`);
});

