const students = [
    {
        id: 1,
        name: 'merna',
        email: 'merna@gmail.com',
        password: 'Merna@2112002',
        departmentId: '1'
    }
];
const courses = [
    {
        id: 1,
        name: 'java',
        content: 'courses java',
        departmentId: '1'
    }
];
const department = [
    {
        id: 1,
        name: 'it',

    }
];

const fs = require("fs");
const http = require('http');

http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.end("hello");
    }
    //--------------------------------------------------------
    // display all students
    // 2 - GetAll students

    else if (req.url === '/allStudent' && req.method === 'GET') {
        // fs.writeFileSync('./student.json', JSON.stringify(students));
        res.end(fs.readFileSync('./student.json'));
    }
    //--------------------------------------------------------
    //  Get all students with their department and courses
    // 3 -  Get all students with their department and courses

    else if (req.url === '/allStudentInDetail' && req.method === 'GET') {
        let students = JSON.parse(fs.readFileSync('./student.json'));
        let courses = JSON.parse(fs.readFileSync('./course.json'));
        let department = JSON.parse(fs.readFileSync('./department.json'))
        const Allstudents = students.map(student => {
            const findDepartment = department.find(dep => dep.id == student.departmentId);
            const findCourses = courses.filter(course => course.departmentId == student.departmentId);
            return {
                id: student.id,
                name: student.name,
                email: student.email,
                department: findDepartment ? { id: findDepartment.id, name: findDepartment.name } : null,
                courses: findCourses.map(course => ({ id: course.id, name: course.name }))
            };
        });

        res.end(JSON.stringify(Allstudents));

    }
    //--------------------------------------------------------
    // add students
    // 1 - Add student(email must be unique)
    else if (req.url === '/addStudent' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data = JSON.parse(chunk)
        });
        req.on('end', () => {
            const parseData = JSON.parse(fs.readFileSync('./student.json'))
            const emailExist = parseData.find((student) => student.email === data.email);
            const idExist = parseData.find((student) => student.id === data.id);
            //check id and email unique

            if (emailExist) {
                res.end('email exists');
            } else if (idExist) {
                res.end('id exists');
            }
            else {
                parseData.push(data);
                fs.writeFileSync('./student.json', JSON.stringify(parseData));
                // res.end(JSON.stringify(parseData));
                res.end(JSON.stringify({ message: "student is added" }))

            }
        });
    }

    //-----------------------------------------------------------
    //update students
    // 5 - update student

    else if (req.url.startsWith('/updateStudent/') && req.method === 'PUT') {
        let UrlId = Number(req.url.split('/')[2])
        const parseData = JSON.parse(fs.readFileSync('./student.json'))
        const index = parseData.findIndex((student) => student.id == UrlId)
        if (index == -1) {
            return res.end(JSON.stringify({ message: "student not found" }))
        }
        req.on('data', (chunk) => {
            const updatedStudent = JSON.parse(chunk);
            parseData[index] = { ...parseData[index], ...updatedStudent };
            fs.writeFileSync('./student.json', JSON.stringify(parseData));

            res.end(JSON.stringify({ message: "Student is updated" }))

        })

    }
    //-----------------------------------------------------------
    // delete students
    // 4 - delete student

    else if (req.url.startsWith('/deteletStudent/') && req.method === 'DELETE') {

        let UrlId = Number(req.url.split('/')[2])

        const parseData = JSON.parse(fs.readFileSync('./student.json'))
        const index = parseData.findIndex((student) => student.id == UrlId)
        if (index >= 0) {
            parseData.splice(index, 1)
            fs.writeFileSync('./student.json', JSON.stringify(parseData));
            res.end(JSON.stringify({ message: "student deleted" }))

        } else {
            res.end(JSON.stringify({ message: "student not found" }))
        }

    }

    //-------------------------------------------------------------
    // detail specific students
    // 6- search for a student by ID

    else if (req.url.startsWith('/detailStudent/') && req.method === 'GET') {

        let UrlId = Number(req.url.split('/')[2])

        const parseData = JSON.parse(fs.readFileSync('./student.json'))
        console.log(parseData)
        const index = parseData.findIndex((student) => student.id == UrlId)
        if (index >= 0) {

            res.end(JSON.stringify(parseData[index]))

        } else {
            res.end(JSON.stringify({ message: "student not found" }))
        }

    }

    //-------------------------------------------------------------
    // display all courses
    // 4- Get all courses

    else if (req.url === '/allCourses' && req.method === 'GET') {
        // fs.writeFileSync('./course.json', JSON.stringify(courses));
        res.end(fs.readFileSync('./course.json'));
    }
    //------------------------------------------------------------------

    // add courses
    // 1- Add courses 

    else if (req.url === '/addCoures' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data = JSON.parse(chunk)
        });
        req.on('end', () => {
            const parseData = JSON.parse(fs.readFileSync('./course.json'))
            //check id unique
            const idExist = parseData.find((course) => course.id === data.id);
            if (idExist) {
                res.end('course id exists');
            }
            else {
                parseData.push(data);
                fs.writeFileSync('./course.json', JSON.stringify(parseData));
                res.end(JSON.stringify({ message: "courses is added" }));
            }
        });
    }
    //-------------------------------------------------------------------
    //update courses 
    // 3- Update course

    else if (req.url.startsWith('/updateCourses/') && req.method === 'PUT') {
        let UrlId = Number(req.url.split('/')[2])
        const parseData = JSON.parse(fs.readFileSync('./course.json'))
        const index = parseData.findIndex((course) => course.id == UrlId)
        if (index == -1) {
            return res.end(JSON.stringify({ message: "course not found" }))
        }
        req.on('data', (chunk) => {
            const updatedCourse = JSON.parse(chunk);
            parseData[index] = { ...parseData[index], ...updatedCourse };
            fs.writeFileSync('./course.json', JSON.stringify(parseData));

            res.end(JSON.stringify({ message: "course is updated" }))

        })

    }
    //---------------------------------------------------------------------
    // delete courses
    // 2- Delete Course

    else if (req.url.startsWith('/deteletCourses/') && req.method === 'DELETE') {

        let UrlId = Number(req.url.split('/')[2])

        const parseData = JSON.parse(fs.readFileSync('./course.json'))
        const index = parseData.findIndex((course) => course.id == UrlId)
        if (index >= 0) {
            parseData.splice(index, 1)
            fs.writeFileSync('./course.json', JSON.stringify(parseData));
            res.end(JSON.stringify({ message: "course deleted" }))

        } else {
            res.end(JSON.stringify({ message: "course not found" }))
        }

    }

    //-------------------------------------------------------------
    // detail specific course
    // 5- Get specific course by Id
    else if (req.url.startsWith('/detailCourse/') && req.method === 'GET') {
        let UrlId = Number(req.url.split('/')[2])
        const parseData = JSON.parse(fs.readFileSync('./course.json'))
        const index = parseData.findIndex((course) => course.id == UrlId)
        if (index >= 0) {
            res.end(JSON.stringify(parseData[index]))
        } else {
            res.end(JSON.stringify({ message: "course not found" }))
        }

    }
    // ------------------------------------------------------------
    // display all department
    // 4- Get all departments

    else if (req.url === '/allDepartment' && req.method === 'GET') {
        // fs.writeFileSync('./department.json', JSON.stringify(department));
        res.end(fs.readFileSync('./department.json'));
    }
    //------------------------------------------------------------------

    // add department
    // 1- Add department

    else if (req.url === '/addDepartment' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data = JSON.parse(chunk)
        });
        req.on('end', () => {
            const parseData = JSON.parse(fs.readFileSync('./department.json'))
            //check id unique
            const idExist = parseData.find((department) => department.id === data.id);
            if (idExist) {
                res.end('Department id exists');
            }
            else {
                parseData.push(data);
                fs.writeFileSync('./department.json', JSON.stringify(parseData));
                // res.end(JSON.stringify(parseData));
                res.end(JSON.stringify({ message: "Department is added" }));

            }
        });
    }
    //-------------------------------------------------------------------

    //update department
    // 2- Update department

    else if (req.url.startsWith('/updateDepartment/') && req.method === 'PUT') {
        let UrlId = Number(req.url.split('/')[2])
        const parseData = JSON.parse(fs.readFileSync('./department.json'))
        const index = parseData.findIndex((department) => department.id == UrlId)
        if (index == -1) {
            return res.end(JSON.stringify({ message: "department not found" }))
        }
        req.on('data', (chunk) => {
            const updatedDepartment = JSON.parse(chunk);
            parseData[index] = { ...parseData[index], ...updatedDepartment };
            fs.writeFileSync('./department.json', JSON.stringify(parseData));

            res.end(JSON.stringify({ message: "department is updated" }))

        })

    }
    //-------------------------------------------------------------------
    // delete department
    // 3- Delete department

    else if (req.url.startsWith('/deteletDepartment/') && req.method === 'DELETE') {

        let UrlId = Number(req.url.split('/')[2])

        const parseData = JSON.parse(fs.readFileSync('./department.json'))
        console.log(parseData)
        const index = parseData.findIndex((department) => department.id == UrlId)
        if (index >= 0) {
            parseData.splice(index, 1)
            fs.writeFileSync('./department.json', JSON.stringify(parseData));
            res.end(JSON.stringify({ message: "department deleted" }))

        } else {
            res.end(JSON.stringify({ message: "department not found" }))
        }

    }

    //-------------------------------------------------------------
    // detail specific department 
    // 5- Get specific department by Id
    else if (req.url.startsWith('/detailDepartment/') && req.method === 'GET') {
        let UrlId = Number(req.url.split('/')[2])
        const parseData = JSON.parse(fs.readFileSync('./department.json'))
        const index = parseData.findIndex((department) => department.id == UrlId)
        if (index >= 0) {
            res.end(JSON.stringify(parseData[index]))
        } else {
            res.end(JSON.stringify({ message: "department not found" }))
        }

    }
    // ------------------------------------------------------------
}).listen(3000, () => {
    console.log("server created");
});
