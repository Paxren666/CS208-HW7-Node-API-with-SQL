let express = require('express');
let router = express.Router();
const db = require("./../db");


/**
 * GET /registered_students
 *
 * @return a list of registered students (extracted from a join between
 * registered_students, students and classes tables in the database) as JSON
 */
router.get("/registered_students", async function (req, res)
{
    try
    {
        const listOfRegisteredStudentJoinResults = await db.getAllRegisteredStudents();
        console.log({listOfRegisteredStudentJoinResults});

        res.send(listOfRegisteredStudentJoinResults);
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(500).json({"error": "Internal Server Error"});
    }
});


/**
 * POST /add_student_to_class
 * with the following form parameters:
 *      studentId
 *      classId
 *
 * The parameters passed in the body of the POST request will be inserted
 * into the registered_students table in the database.
 */
router.post("/add_student_to_class", async function (req, res)
{
    // TODO: implement this route
    try
    {
        const studentId = req.body.studentId;
        const classId = req.body.classId;

        console.log("studentId = " + studentId + ", classId = " + classId);

        // basic validation
        if (!studentId || !classId)
        {
            res.status(400).json({ "error": "missing studentId or classId" });
            return;
        }

        await db.addStudentToClass(studentId, classId);

        res.status(201).json({
            "message": "SUCCESSFULLY added the student with id = " + studentId + " to the class with id = " + classId
        });
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(422).json({
            "error": "failed to add the student with id = " + req.body.studentId + " to the class with id = " + req.body.classId
        });
    }
});


/**
 * DELETE /drop_student_from_class
 * with the following form parameters:
 *      studentId
 *      classId
 *
 * Deletes the student with id = {studentId} from the class with id = {classId}
 * from the registered_students in the database.
 *
 * @throws a 404 status code if the student with id = {studentId} does not exist
 * @throws a 404 status code if the class with id = {classId} does not exist
 */
router.delete("/drop_student_from_class", async function (req, res)
{
    // TODO: implement this route
    try
    {
        const studentId = req.body.studentId;
        const classId = req.body.classId;

        console.log("studentId = " + studentId);
        console.log("classId   = " + classId);

        if (studentId === undefined)
        {
            res.status(400).json({"error": "bad request: expected parameter 'studentId' is not defined"});
            return;
        }

        if (classId === undefined)
        {
            res.status(400).json({"error": "bad request: expected parameter 'classId' is not defined"});
            return;
        }

        const student = await db.getStudentWithId(studentId);
        const classItem = await db.getClassWithId(classId);

        if (student == null)
        {
            console.log("No student with id " + studentId + " exists.");
            res.status(404).json({"error": "student with id = " + studentId + " does not exist"});
            return;
        }

        if (classItem == null)
        {
            console.log("No class with id " + classId + " exists.");
            res.status(404).json({"error": "class with id = " + classId + " does not exist"});
            return;
        }

        await db.dropAnExistingStudentFromAClass(studentId, classId);

        res.status(204).send(); // No content on successful delete
    }
    catch (err)
    {
        console.error("Error:", err.message);
        res.status(422).json({"error": "failed to drop the student with id = " + req.body.studentId + " from the class with id = " + req.body.classId});
    }
});


/**
 * GET /students_taking_class/{classCode}
 *
 * @return a list of registered students (extracted from a join between
 * registered_students, students and classes tables in the database) as JSON
 * that are taking the class {classCode}
 */
// TODO: implement this route


/**
 * GET /classes_in_which_student_is_enrolled/{studentId}
 *
 * @return a list of all classes (extracted from a join between
 * registered_students, students and classes tables in the database) as JSON
 * in which the student with id = {studentId} is enrolled
 *
 * @throws a 404 status code if the student with id = {studentId} does not exist
 */
// TODO: implement this route


module.exports = router;
