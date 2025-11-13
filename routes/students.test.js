const {describe, expect, test} = require("@jest/globals");


// supertest is a framework that allows to easily test web APIs
const supertest = require('supertest');
const app = require('./../app');
const request = supertest(app);


describe('REST APIs for students', () =>
{
    describe('REST APIs for students', () =>
    {
        describe('GET /students', () =>
        {
            test('should return a 200 (ok) status code', async () =>
            {
                const response = await request.get('/students');
                expect(response.status).toBe(200);
                // or:
                // await request.get('/students').expect(200);
            });


            test('should have Content-Type "application/json"', async () =>
            {
                const response = await request.get('/students');
                expect(response.header['content-type']).toMatch(/application\/json/);
                // or:
                // await request.get('/students').expect('Content-Type', /application\/json/);
            });


            test('should contain the key "id" in the first student returned as a JSON response', async () =>
            {
                const response = await request.get('/students');
                const response_content_as_json = response.body;


                expect(response_content_as_json[0]).toHaveProperty('id');
            });


            test('should contain "Alice Agnesi" in the first student name returned as a JSON response', async () => {
                const response = await request.get('/students');
                const students = response.body;


                const fullName = students[0].firstName + ' ' + students[0].lastName;
                expect(fullName).toBe('Alice Agnesi');
            });
        });
    });


    describe('GET /students/:id', () =>
    {
        // TODO: add your tests


        test('should return a 200 status code', async () =>
        {
            const response = await request.get('/students/1');
            expect(response.status).toBe(200);
        });


        test('should have Content-Type "application/json"', async () =>
        {
            const response = await request.get('/students/1');
            expect(response.header['content-type']).toMatch(/application\/json/);
        });


        test('should contain the correct student as JSON', async () =>
        {
            const response = await request.get('/students/1');
            const actual_response_content_as_json = response.body;


            const expected_response_as_json = {
                id: 1,
                firstName: 'Alice',
                lastName: 'Agnesi',
                birthDate: '1991-01-01'
            };


            expect(actual_response_content_as_json).toEqual(expected_response_as_json);
        });


        test('should return a 404 (not found) status code when the student with id = 999 does not exist', async () =>
        {
            const response = await request.get('/students/999');
            expect(response.status).toBe(404);
        });
    });


    describe('POST /students', () =>
    {
        // TODO: add your tests


        test('should return a 400 response when the "firstName" field is missing', async () =>
        {
            const form_data = {
                // firstName: 'John',
                lastName: 'Doe',
                birthDate: '2000-01-01'
            };


            const response = await request
                .post('/students')
                .type('form')
                .send(form_data);


            expect(response.status).toBe(400);
        });


        test('should return a 201 response when all required fields are provided', async () =>
        {
            const form_data = {
                firstName: 'John',
                lastName: 'Doe',
                birthDate: '2000-01-01'
            };


            const response = await request
                .post('/students')
                .type('form')
                .send(form_data);


            expect(response.status).toBe(201);
        });


        test('should return a 422 response when "birthDate" is not in ISO format', async () =>
        {
            const form_data = {
                firstName: 'John',
                lastName: 'Doe',
                birthDate: '01-01-2000' // invalid format
            };


            const response = await request
                .post('/students')
                .type('form')
                .send(form_data);


            expect(response.status).toBe(422);
        });
    });




    describe('PUT /students/:id', () =>
    {
        // TODO: add your tests
    });


    describe('PATCH /students/:id', () =>
    {
        // TODO: add your tests
        test('should return a 200 response when updating only a subset of fields for the student with id = 4', async() =>
        {
            const form_data = {
                firstName: 'Emm',
                lastName: 'Einstein',
                birthDate: '1995-05-05'
            };


            const response = await request
                .patch('/students/4')
                .type('form')
                .send(form_data);


            expect(response.status).toBe(200);
        });


        test('should return a 404 response when updating a student with id = 999 which does not exist', async() =>
        {
            const form_data = {
                firstName: 'NewFirstName',
                lastName: 'NewLastName',
                birthDate: '2002-05-06'
            };


            const response = await request
                .patch('/students/999')
                .type('form')
                .send(form_data);


            expect(response.status).toBe(404);
        });
    });


    describe('DELETE /students/:id', () =>
    {
        // TODO: add your tests
        test('should return a 204 response when deleting the student with id = 6', async () =>
        {
            const response = await request.delete('/students/6');
            expect(response.status).toBe(204);
        });


        test('should return a 422 response when deleting the student with id = 1 which is referenced from another table', async () =>
        {
            const response = await request.delete('/students/1');


            // student with id = 1 might be referenced in another table (e.g., registered_students)
            // deleting it would violate a foreign key constraint
            // therefore, the server should catch the SQL error and return 422
            expect(response.status).toBe(422);
        });


        test('should return a 404 response when deleting the student with id = 999 which does not exist', async () =>
        {
            const response = await request.delete('/students/999');
            expect(response.status).toBe(404);
        });
    });
});
