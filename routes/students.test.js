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
    });

    describe('PUT /students/:id', () =>
    {
        // TODO: add your tests
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
