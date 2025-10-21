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

            test('should contain "John Doe" in the first student name returned as a JSON response', async () =>
            {
                const response = await request.get('/students');
                const response_content_as_json = response.body;

                expect(response_content_as_json[0].name).toBe('John Doe');
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
                firstName: 'John',
                lastName: 'Doe',
                birthDate: '2000-01-01'
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

        test('should return a 422 response when adding a student with the same firstName+lastName+birthDate twice', async () =>
        {
            const form_data = {
                firstName: 'Jane',
                lastName: 'Smith',
                birthDate: '1999-12-31'
            };

            const first_response = await request
                .post('/students')
                .type('form')
                .send(form_data);

            expect(first_response.status).toBe(201);

            const second_response = await request
                .post('/students')
                .type('form')
                .send(form_data);

            expect(second_response.status).toBe(422);
        });
    });


    describe('PUT /students/:id', () =>
    {
        // TODO: add your tests
        test('should return a 200 response when updating only a subset of fields for the student with id = 4', async () =>
        {
            const form_data = {
                firstName: 'ModifiedFirstName',
                birthDate: '2001-02-03'
                // lastName not provided
            };

            const response = await request
                .patch('/students/4')
                .type('form')
                .send(form_data);

            expect(response.status).toBe(200);
        });

        test('should return a 422 response when updating a student with conflicting information (e.g., duplicate constraints)', async () =>
        {
            const form_data = {
                firstName: 'John',
                lastName: 'Doe',
                birthDate: '2000-01-01'
            };

            const response = await request
                .patch('/students/3')
                .type('form')
                .send(form_data);

            expect(response.status).toBe(422);
        });

        test('should return a 404 response when updating a student with id = 999 which does not exist', async () =>
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

    describe('PATCH /students/:id', () =>
    {
        // TODO: add your tests
    });

    describe('DELETE /students/:id', () =>
    {
        // TODO: add your tests
    });
});
