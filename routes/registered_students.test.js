const {describe, expect, test} = require("@jest/globals");

// supertest is a framework that allows to easily test web APIs
const supertest = require('supertest');
const app = require('./../app');
const request = supertest(app);

describe('REST APIs for registered_students', () =>
{
    describe('GET /registered_students', () =>
    {
        // TODO: add your tests
        test('should return a 200 status code', async () =>
        {
            const response = await request.get('/registered_students');
            expect(response.status).toBe(200);
        });

        test('should have Content-Type "application/json"', async () =>
        {
            const response = await request.get('/registered_students');
            expect(response.header['content-type']).toMatch(/application\/json/);
        });

        test('should return an array of registered students with expected fields', async () =>
        {
            const response = await request.get('/registered_students');
            const body = response.body;

            expect(Array.isArray(body)).toBe(true);

            if (body.length > 0)
            {
                const first = body[0];
                expect(first).toHaveProperty('studentId');
                expect(first).toHaveProperty('studentFullName');
                expect(first).toHaveProperty('code');
                expect(first).toHaveProperty('title');
            }
        });

        test('should return an empty array if there are no registered students', async () =>
        {
            // Assuming database might be empty or reset for testing
            const response = await request.get('/registered_students');
            const body = response.body;
            expect(body).not.toBeNull();
            expect(Array.isArray(body)).toBe(true);
        });
    });

    describe('POST /add_student_to_class', () =>
    {
        // TODO: add your tests
        test('should return a 201 response when successfully adding student with id = 3 to class with id = 2', async () =>
        {
            const response = await request
                .post('/add_student_to_class')
                .send({ studentId: 3, classId: 2 });

            expect(response.status).toBe(201);
            expect(response.body.message).toContain("SUCCESSFULLY added");
        });

        test('should return a 400 response when missing studentId or classId', async () =>
        {
            const response = await request
                .post('/add_student_to_class')
                .send({ studentId: 3 }); // missing classId

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("missing studentId or classId");
        });

        test('should return a 422 response when trying to add a student that already exists in the same class', async () =>
        {
            const response = await request
                .post('/add_student_to_class')
                .send({ studentId: 1, classId: 1 });

            // attempting duplicate entry should violate UNIQUE/FOREIGN constraint
            expect(response.status).toBe(422);
        });
    });

    describe('DELETE /drop_student_from_class', () =>
    {
        // TODO: add your tests
    });

    describe('GET /students_taking_class/:classCode', () =>
    {
        // TODO: add your tests
    });

    describe('GET /classes_taken_by_student/:studentId', () =>
    {
        // TODO: add your tests
    });
});
