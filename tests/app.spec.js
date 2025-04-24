// tests/app.test.js

const request = require('supertest');
const app = require('../app');  // Import the app.js module that contains the Express app

let appBoundaryTest = `AppController boundary test`;

describe('App Controller', () => {
    describe('boundary', () => {

        // Test for the root route ("/")
        it(`${appBoundaryTest} should return a welcome message in JSON format`, async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Welcome to the User API!');
        });

        // Test for the /users route
        it(`${appBoundaryTest} should return a list of users in JSON format`, async () => {
            const response = await request(app).get('/users');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);  // Ensure users are returned
            expect(response.body[0]).toHaveProperty('id');  // Ensure each user has an ID
        });

        // Test for the /users/:id route (Get user by ID)
        it(`${appBoundaryTest} should return a user by ID in JSON format`, async () => {
            const response = await request(app).get('/users/1');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', 1);  // Ensure the user with ID 1 is returned
            expect(response.body.name).toBe('John Doe');  // Check if the name matches
        });

        // Test for the /users/:id route (User not found)
        it(`${appBoundaryTest} should return 404 if user is not found`, async () => {
            const response = await request(app).get('/users/999');  // Non-existent user ID
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        // Test for the /users/filter route (Filter users by name)
        it(`${appBoundaryTest} should return filtered users by name`, async () => {
            const response = await request(app).get('/users/filter?name=John');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);  // Ensure some users are returned
            expect(response.body[0].name).toContain('John');  // Ensure name contains 'John'
        });

        // Test for the /users/filter route (Filter users by email)
        it(`${appBoundaryTest} should return filtered users by email`, async () => {
            const response = await request(app).get('/users/filter?email=example.com');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(0);  // Ensure some users are returned
            expect(response.body[0].email).toContain('example.com');  // Ensure email contains 'example.com'
        });

        // Test for the /users POST route (Create new user)
        it(`${appBoundaryTest} should create a new user and return the created user`, async () => {
            const newUser = { name: "Test User", email: "testuser@example.com" };
            const response = await request(app)
                .post('/users')
                .send(newUser);
            expect(response.status).toBe(201);
            expect(response.body.name).toBe(newUser.name);
            expect(response.body.email).toBe(newUser.email);
            expect(response.body).toHaveProperty('id');
        });

        // Test for the /users PUT route (Update an existing user)
        it(`${appBoundaryTest} should update an existing user and return the updated user`, async () => {
            const updatedUser = { name: "Updated Name", email: "updated@example.com" };
            const response = await request(app)
                .put('/users/1')
                .send(updatedUser);
            expect(response.status).toBe(200);
            expect(response.body.name).toBe(updatedUser.name);
            expect(response.body.email).toBe(updatedUser.email);
        });

        // Test for the /users PUT route (User not found for update)
        it(`${appBoundaryTest} should return 404 when updating a non-existent user`, async () => {
            const updatedUser = { name: "Non-existent User", email: "nonexistent@example.com" };
            const response = await request(app)
                .put('/users/999')  // Non-existent user ID
                .send(updatedUser);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        // Test for the /users DELETE route (Delete an existing user)
        it(`${appBoundaryTest} should delete a user and return success message`, async () => {
            const response = await request(app)
                .delete('/users/1');  // Delete user with ID 1
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
        });

        // Test for the /users DELETE route (User not found for deletion)
        it(`${appBoundaryTest} should return 404 when deleting a non-existent user`, async () => {
            const response = await request(app)
                .delete('/users/999');  // Non-existent user ID
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('User not found');
        });

        // Test for an invalid route (404)
        it(`${appBoundaryTest} should return 404 for invalid routes`, async () => {
            const response = await request(app).get('/invalid-route');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Not Found');
        });
    });
});
