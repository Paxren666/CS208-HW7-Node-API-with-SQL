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
        test('should return 400 if studentId or classId is missing', async () =>
        {
            const response = await request
                .post('/add_student_to_class')
                .type('form') // 👈 this is the key fix
                .send({ studentId: 5 }); // missing classId

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'missing studentId or classId');
        });

        test('should return 201 if a student is successfully added to a class', async () =>
        {
            const response = await request
                .post('/add_student_to_class')
                .type('form') // 👈 add this
                .send({ studentId: 1, classId: 4 });

            expect(response.status).toBe(201);
            expect(response.body.message)
                .toContain('SUCCESSFULLY added the student with id = 1 to the class with id = 4');
        });

        test('should return 422 if adding a student fails (e.g., already exists or invalid)', async () =>
        {
            const response = await request
                .post('/add_student_to_class')
                .type('form') // 👈 add this
                .send({ studentId: 1, classId: 4 });

            expect(response.status).toBe(422);
            expect(response.body.error).toContain('failed to add the student');
        });
    });

    describe('DELETE /drop_student_from_class', () =>
    {
        // TODO: add your tests
        test('should return a 204 response when successfully dropping student with id = 1 from class with id = 8', async() =>
        {
            const form_data = {
                studentId: 1,
                classId: 8
            };

            const response = await request
                .delete('/drop_student_from_class')
                .type('form')
                .send(form_data);

            expect(response.status).toBe(204);
        });

        test('should return a 404 response when dropping a non-existing student', async() =>
        {
            const form_data = {
                studentId: 999,
                classId: 1
            };

            const response = await request
                .delete('/drop_student_from_class')
                .type('form')
                .send(form_data);

            expect(response.status).toBe(404);
        });

        test('should return a 404 response when dropping a student from a non-existing class', async() =>
        {
            const form_data = {
                studentId: 1,
                classId: 999
            };

            const response = await request
                .delete('/drop_student_from_class')
                .type('form')
                .send(form_data);

            expect(response.status).toBe(404);
        });

        test('should return a 400 response when required parameters are missing', async() =>
        {
            const form_data = {
                studentId: 1
                // classId is missing
            };

            const response = await request
                .delete('/drop_student_from_class')
                .type('form')
                .send(form_data);

            expect(response.status).toBe(400);
        });
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

