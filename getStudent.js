if (url == "/addStudent") {
    var body = '';
    console.log("add Student ");
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var student = qs.parse(body);
        console.log('body '+body);
        console.log(student);
        student.id = thestore.students.length;

        // The subjects attribute can be undefined if the user does not
        // select a subject for the student.
        if (student.subjects === undefined) {
            student.subjects = [];
            console.log("student subjects is undefined");
        }
        else
        // Convert the subjects variable into an Array if there is only be one subject
        if  (!(student.subjects instanceof Array)) {
            if (student.subjects != null)
                student.subjects = [student.subjects];
            else {
                console.log("student subjects is null");
                student.subjects = [];
            }
        }
        console.log('student: '+JSON.stringify(student, null, 2));
        thestore.students.push(student);
        storeTheStore(store);
        showPage(req, res, displayStudents(true), "./studentfooter.html");


    });
}