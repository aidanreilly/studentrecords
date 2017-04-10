/**
 * @file main application file for the student records node.js application
 * @author Aidan Reilly 
 */

/**
 * http module is for sending and receiving http traffic in the node application
 */
var http = require('http');
/**
 * qs  is for parsing and formatting URL query strings
 */
var qs = require('querystring');
/**
 * fs is for file i/o operations
 */
var fs = require('fs');
/**
 * Path is for manipulating file paths, finding the basename, file type, etc.
 */
var path = require('path');
/**
 * hogan.js is a templating engine that simplifies html development.
 */
var hogan = require('hogan.js');
/**
 * The cache var is instantiated here so that it can store content later in the program.
 */
var cache = {};
/**
 * Thestore is a "braced" complex variable with arrays, students, subjects, teachers, grades
 */
var thestore = {
    students: [],
    subjects: [],
    teachers: [],
    grades: []
};

console.log("running on http://localhost:3000/")

//
//

/**
 * The store var is a json format text file stored in the root dir. It contains the json that maps to the student records.
 * @type {String}
 */
var store = "./store.txt";
/**
 * The two header vars set the column headers that are used for the two arrays, students and subjects in the store object - a json "database" basically.
 * @type {Array}
 */
var Studentheaders = [
    "First Name", "Second Name", "Subjects - Grades", "Operation"
];
var Subjectheaders = [
    "Name", "Teacher", "Room", "Operation"
];

/**
 * The loadOrInitializeArray function takes the var store as an input.
 */
loadOrInitializeArray(store);
/**
 <p>The http server var processes requests and responses. The createServer method creates the server and sets it up to process requests and responses. The url var is parsed from the http req input. The request and URL is pushed to the console. The main body of the application is set up in the server object here.
 
  <p>If the method is a POST method and has /addStudent encoded in the URL, print to the console, process the req request. The request on method processes the request body, binds it to the POST event.
  
  <p>The var body quotation is used to construct the URL starting with  a quotation to open the concatenated data from the POST request.  
 
  <p>Once the request ends, the qs module parses the body of the POST addStudent request into the student object and prints to  the console. and print the student var to the console.

 <p>The unique id for the student is obtained by getting the length value of the students array   

 <p>The subjects attribute can be undefined if the user does not select a subject for the student.

 <p> The message is then stringified and pushed to the console and the store.

 <p> The various methods POST methods print to the console and then process the req request, pushing the content to thestore and then regenerating the updated html in the browser.
 */
var server = http.createServer(function(req, res) {
    var url = req.url;
    console.log('request ' + url + ' method ' + req.method);
    /**
     The filePath var is initiated as false. 
     * @type {Boolean}
     */
    var filePath = false;

    if (req.method == 'POST') {
        if (url == "/addStudent") {
            var body = '';
            console.log("add Student ");
            req.on('data', function(data) {
                body += data;
            });

            req.on('end', function() {
                var student = qs.parse(body);
                console.log('body ' + body);
                console.log(student);
                student.id = thestore.students.length;


                if (student.subjects === undefined) {
                    student.subjects = [];
                    console.log("student subjects is undefined");
                } else

                //Convert the subjects variable into an Array if there is only one subject
                if (!(student.subjects instanceof Array)) {
                    if (student.subjects != null)
                        student.subjects = [student.subjects];
                    else {
                        console.log("student subjects is null");
                        student.subjects = [];
                    }
                }
                //now we stringify the message using the JSON stringify method and post it to the console and push it to the student store.
                console.log('student: ' + JSON.stringify(student, null, 2));
                thestore.students.push(student);
                //storeTheStore function adds the student record to the json txt file.
                storeTheStore(store);
                //showpage method pushes the studentfooter to the browser.
                showPage(req, res, displayStudents(true), "./studentfooter.html");


            });
        }

        //if the method is a POST method and has /addSubject encoded in the URL, 
        //print to the console, process the req request to the store
        //the request on method processes the request body, 
        //binds it to the POST event
        //the var body quotation is used to construct the URL starting with  a quoatation
        // to open the concatenated data from the POST request  
        else if (url == "/addSubject") {
            var body = '';
            console.log("add Subject ");
            req.on('data', function(data) {
                body += data;
            });
            // on completing the request, print the entire body of the request to the console and make the unique student id
            req.on('end', function() {
                var subject = qs.parse(body);
                console.log('body ' + body);
                console.log(subject);
                subject.id = thestore.subjects.length;

                //parse subject and add subject object into thestore.subjects - not sure this is working
                if (thestore.subjects === undefined) {
                    thestore.subjects = [];
                    console.log("subjects is undefined");
                } else
                // Convert the subjects variable into an Array if there is only one subject
                if (!(thestore.subjects instanceof Array)) {
                    //if thestore.subjects is an array and if the subjects array is not null, 
                    //then push the subjects into the array 
                    if (thestore.subjects != null)
                        thestore.subjects = [thestore.subjects];
                    else {
                        console.log("student subjects is null");
                        thestore.subjects = [];
                    }
                }
                // added the modified students bit above.

                //now we stringify the message using the JSON stringify method and post it to the console and push to thestore.
                console.log('subject: ' + JSON.stringify(subject, null, 2));
                thestore.subjects.push(subject);
                //storeTheStore function adds the student record to the json txt file.

                storeTheStore(store);
                // launch the showpage function, has a request and response  param, 
                //a  displaySubject method, and an included footer file 
                showPage(req, res, displaySubjects(true), "./subjectfooter.html");



            });
        }

        //if the method is a POST method and has /deleteStudent encoded in the URL, 
        //print to the console, process the req request
        //the request on method processes the request body, 
        //binds it to the POST event
        //the var body quotation is used to construct the URL starting with  a quotation
        // to open the concatenated data from the POST request  
        else if (url == "/deleteStudent") {
            var body = '';
            console.log("delete student");
            req.on('data', function(data) {
                body += data;
            });
            //req.on binds the URL event to the object passed in the URL when the end event is triggered
            req.on('end', function() {
                console.log('body contains ' + body);
                //querystring parser parses the body of the url body
                var obj = qs.parse(body);
                console.log('body ' + body);
                console.log(obj);
                // TODO parse delete and remove the student
                //storeTheStore function adds the subjects to the json txt file.
                storeTheStore(store);
                // launch the showpage function, has a request and response  param, 
                //a  displayStudents method, and an included footer file 
                showPage(req, res, displayStudents(true), "./studentfooter.html");
            });

        } else if (url == "/editStudent") {
            var body = '';
            console.log("edit student");
            req.on('data', function(data) {
                body += data;
            });
            //req.on binds the URL event to the object passed in the URL when the end event is triggered
            req.on('end', function() {
                console.log(body);
                //querystring parser parses the body of the url body
                var obj = qs.parse(body);
                console.log('body ' + body);
                console.log(obj);
                //storeTheStore function adds the subjects to the json txt file.
                storeTheStore(store);
                // launch the showpage function, has a request and response  param, 
                //a  displayStudents method, and an included footer file 
                showPage(req, res, displayStudents(true), "./studentEdit.html");
            });
        } else if (url == "/deleteSubject") {
            var body = '';
            console.log("delete subject ");
            req.on('data', function(data) {
                body += data;
            });


            //if the method is a POST method and has /deleteSubject encoded in the URL, 
            //print to the console, process the req request
            //the request on method processes the request body, 
            //binds it to the POST event
            //the var body quotation is used to construct the URL starting with  a quotation
            // to open the concatenated data from the POST request  


            //parse the /deleteSubject request
            // put the parsed post in the store
            req.on('end', function() {
                var post = qs.parse(body);
                //show the store page and append the subjectfooter.html page
                //storeTheStore function adds the subjects to the json txt file.
                storeTheStore(store);
                showPage(req, res, displaySubjects(true), "./subjectfooter.html");
            });

        }
    }
    //if the url is getStudents, print to the log 
    //show page function displays the students and append the footer html page
    else if (url == "/getStudents") {
        console.log("getstudents");
        showPage(req, res, displayStudents(true), "./studentfooter.html");
    }
    //TODO: added this to push grade work to the edit page with a gradeStudent.html footer
    else if (url == "/gradeStudent") {
        console.log("getstudents");
        showPage(req, res, displayStudents(true), "./gradeStudent.html");
    }

    //if the url is getSubjects, print to the log 
    //show page function  display the subjects and append the footer html page
    else if (url == "/getSubjects") {
        console.log("getSubjects");
        showPage(req, res, displaySubjects(true), "./subjectfooter.html");
    } else if (url == "/editSubject") {
        console.log("editSubjects");
        showPage(req, res, displaySubjects(true), "./subjectfooter.html");
    } else
        showPage(req, res, displayStudents(true), "./studentfooter.html");
});

//listen on port 3000
/**
 * applcation listens on port 3000
 */
server.listen(3000);

/**showPage function returns status 200 (OK) and pushes the html to the browser. showPage function  is called whenever a reqest or response is triggered.
 *The data variable is populated with the contents of the header.html using fs. Str is added to the data var and saved to the data var which is parsed by the ReadFileSync file read method, encoded in utf 8. Res.end sends the data.
 */
function showPage(req, res, str, footer) {
    res.writeHead(
        200, { "content-type": 'text/html' }
    );
    console.log("showpage");
    data = fs.readFileSync("./header.html", 'utf8');
    //str is added to the data var and saved to the data var 
    data += str;
    res.end(data);
}

/** the storeTheStore function pushes the students records to the JSON store.txt. The fs writeFile method stringifys the json thestore complex var in utf8, and can also pass an error to the callback function. **/
function storeTheStore(file) {
    fs.writeFile(file, JSON.stringify(thestore, null, 2), 'utf8', function(err) {
        //if an err is experienced, throw the err exception
        if (err) throw err;
        //otherwise print' 'Saved' to the log.
        console.log('Saved.');
    });
}

/**
The loadOrInitializeArray function is used to read the JSON into thestore. It evaluate the data string and parses it into thestore. fs checks if the file exists, if it does, read the file encoded as UTF8 to the data var. Then, parse the data object into thestore.
 */
function loadOrInitializeArray(file) {
    fs.exists(file, function(exists) {
        if (exists) {
            var data = fs.readFileSync(file, 'utf8');
            data = data.toString();
            //evaluate the data string and parse it into thestore  students and subjects arrays.
            //also added teachers and grades arrays
            thestore = JSON.parse(data || '{' +
                '"students":[],' +
                '"subjects":[],' +
                '"teachers":[],' +
                '"grades" :[]}');
        }
    });
}


/** 
The displayStudents function, takes doEdit and student params. The out object encodes the header when output to html. The upper for loop builds the table. The code iterates over i for the number of studentheader elements and create the <th> entries in the table and populate with the values of each studentheader entry. It does the same for students and ids. Hogan.js is used to render the output as html.
 */
function displayStudents(doEdit, student) {
    var out = "<h1> Students</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Studentheaders.length; i++) {
        out += '<th >' + Studentheaders[i] + '</th>';
    }
    out += '</tr>';
    //put the store values into the table
    for (i = 0; i < thestore.students.length; i++) {
        out += '<tr style="font-size: 20px;" >';
        out += '<td>' + thestore.students[i].firstname + '</td>'
        out += '<td>' + thestore.students[i].surname + '</td>'
        out += '<td><ol>'
            //display the results in an ordered list.
        j = 0;
        for (j = 0; j < thestore.students[i].subjects.length; j++) {
            //hardcoding the grade causes an error here. commented it out. if the grades function was working correctly, this is how i would display it. 
            out += '<li>' + thestore.students[i].subjects[j] + '</li>'
                //out += '<li>' + thestore.students[i].subjects[j] + ' , ' + thestore.students[i].grades[j] + '</li>'
        }
        out += '</td></ol>'
            //out += '<td><button onclick="editStudent(' + thestore.students[i].id + ')">Edit</button> <button onclick="deleteStudent(' + thestore.students[i].id + ')">Delete</button> <button onclick="gradeStudent(' + thestore.students[i].id + ')">Add Grade(s)</button></td>'
        out += '<td><form method="post" action="/deleteStudent(' + thestore.students[i].id + ')">' + '<button type="submit">Delete</button>' + '</form><form method="post" action="/editStudent(' + thestore.students[i].id + ')">' + '<button type="submit">Edit</button>' + '</form></form><form method="post" action="/gradeStudent(' + thestore.students[i].id + ')">' + '<button type="submit">Add Grade(s)</button>' + '</form></td>'
            //see jquery bits, how to fit the plumbing together?!!
            // TODO make this work - crai
    }
    out += "</table>";
    //the template  var is buit by fs readfile which takes the input from studentfooter.html
    var template = fs.readFileSync("./studentfooter.html", 'utf8');
    var subjectsList;
    //For loop to display all the students subjects in the record
    //This works by reading the studentfooter into memory
    //and for every subject in the store, putting it into a hogan template, compiling it, and pushing it to the browser using out and rendering the template.
    for (i = 0; i < thestore.subjects.length; i++) {
        subjectsList += '<option value=' + thestore.subjects[i].name + '>' + thestore.subjects[i].name + '</option>'
    }
    var context = { subjects: subjectsList };
    var template = hogan.compile(template)
    out += template.render(context);
    return out;
}


/** 
The displaySubjects function works similiarly to the display Students function. The out object encodes the header when output to html. The upper for loop builds the table. The code iterates over i for the number of subjectheader elements and create the <th> entries in the table and populate with the values of each subjectheader entry. It does the same for subjects and ids. Hogan.js is used to render the teachers dropdown output as html.
 */

function displaySubjects(doEdit, subject) {
    var out = "<h1>Subjects</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Subjectheaders.length; i++) {
        out += '<th >' + Subjectheaders[i] + '</th>';
    }
    out += "</tr>";
    //put the store values into the table
    for (i = 0; i < thestore.subjects.length; i++) {
        out += '<tr style="font-size: 20px;" >';
        out += '<td>' + thestore.subjects[i].name + '</td>'
        out += '<td>' + thestore.subjects[i].teacher + '</td>'
        out += '<td>' + thestore.subjects[i].room + '</td>'
        out += '<td><form method="post" action="/deleteSubject(' + thestore.subjects[i].id + ')">' + '<button type="submit">Delete</button>' + '</form><form method="post" action="/editSubject(' + thestore.subjects[i].id + ')">' + '<button type="submit">Edit</button>' + '</form></td>'
    }
    out += "</table>";

    //copied the above table from students

    var template = fs.readFileSync("./subjectfooter.html", 'utf8');
    var teachersList;
    //For loop to display all the teacher records in the teacher array
    //This works by reading the subjectfooter into memory
    //and for every teacher record in the store, putting it into a hogan template, compiling it, and pushing it to the browser using out and rendering the template.
    for (i = 0; i < thestore.teachers.length; i++) {
        teachersList += '<option value=' + thestore.teachers[i].name + '>' + thestore.teachers[i].name + '</option>'
    }
    var context = { teachers: teachersList };
    var template = hogan.compile(template)
    out += template.render(context);
    return out;
}

/**
 editStudents function should pull the Student from the store.txt, push details to editable fields, and then allow the user to modify and resubmit. I couldn't get this working. My plan was to modify the displayStudents function. Upon calling the function, the editStudent.html footer is displayed with the student details pre-populated in the Edit Student fields. The user can then edit the various values, and then submit the changes in the same way that a student is added. The form fields are extracted from the store.txt using jquery and populated on the page using the unique student id. obtained from the onclick action of the button on the getStudents page.
 */
function editStudent(doEdit, student) {
    console.log("editStudent");

    var out = "<h1> Students</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Studentheaders.length; i++) {
        out += '<th >' + Studentheaders[i] + '</th>';
    }
    out += '</tr>';
    //put the store values into the table
    for (i = 0; i < thestore.students.length; i++) {
        out += '<tr style="font-size: 20px;" >';
        out += '<td>' + thestore.students[i].firstname + '</td>'
        out += '<td>' + thestore.students[i].surname + '</td>'
        out += '<td><ol>'
            //display the results in an ordered list.
        j = 0;
        for (j = 0; j < thestore.students[i].subjects.length; j++) {
            //hardcoding the grade causes an error here. commented it out. if the grades function was working correctly, this is how i would display it. 
            out += '<li>' + thestore.students[i].subjects[j] + '</li>'
                //out += '<li>' + thestore.students[i].subjects[j] + ' , ' + thestore.students[i].grades[j] + '</li>'
        }
        out += '</td></ol>'
        out += '<td><button onclick="editStudent(' + thestore.students[i].id + ')">Edit</button> <button onclick="deleteStudent(' + thestore.students[i].id + ')">Delete</button> <button onclick="gradeStudent(' + thestore.students[i].id + ')">Add Grade(s)</button></td>'
            //see jquery bits, how to fit the plumbing together?!!
            // TODO make this work - crai
    }
    out += "</table>";
    //the template  var is buit by fs readfile which takes the input from studentfooter.html
    var template = fs.readFileSync("./studentEdit.html", 'utf8');
    var subjectsList;
    //For loop to display all the students subjects in the record
    //This works by reading the studentfooter into memory
    //and for every subject in the store, putting it into a hogan template, compiling it, and pushing it to the browser using out and rendering the template.
    for (i = 0; i < thestore.subjects.length; i++) {
        subjectsList += '<option value=' + thestore.subjects[i].name + '>' + thestore.subjects[i].name + '</option>'
    }
    var context = { subjects: subjectsList };
    var template = hogan.compile(template)
    out += template.render(context);
    return out;
}

/**
 deleteStudent function should delete the student record by splicing empty space into the store.txt file. The getStudents page should be refreshed when a record is deleted.
 */
function deleteStudent(doEdit, student) {
    console.log("deleteStudent");
    //gah
}

/**
 editSubject function should pull the Subject from the store.txt, push the subject details to editable fields, and then allow the user to modify and resubmit. I couldn't get this working. My plan was to modify the addStudents function. Upon calling the function, the editSubject.html footer is displayed with the student details pre-populated in the Edit Student fields. The user can then edit the various values, and then submit the changes in the same way that a student is added. The form fields are extracted from the store.txt using jquery and populated on the page using the unique subject id obtained from the onclick action of the button on the getSubjects page.
 */
function editSubject(doEdit, student) {
    var out = "<h1>Subjects</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Subjectheaders.length; i++) {
        out += '<th >' + Subjectheaders[i] + '</th>';
    }
    out += "</tr>";
    //put the store values into the table
    for (i = 0; i < thestore.subjects.length; i++) {
        out += '<tr style="font-size: 20px;" >';
        out += '<td>' + thestore.subjects[i].name + '</td>'
        out += '<td>' + thestore.subjects[i].teacher + '</td>'
        out += '<td>' + thestore.subjects[i].room + '</td>'
        out += '<td><form method="post" action="/deleteSubject(' + thestore.subjects[i].id + ')">' + '<button type="submit">Delete</button>' + '</form><form method="post" action="/editSubject(' + thestore.subjects[i].id + ')">' + '<button type="submit">Edit</button>' + '</form></td>'
    }
    out += "</table>";

    //copied the above table from students

    var template = fs.readFileSync("./subjectfooter.html", 'utf8');
    var teachersList;
    //For loop to display all the teacher records in the teacher array
    //This works by reading the subjectfooter into memory
    //and for every teacher record in the store, putting it into a hogan template, compiling it, and pushing it to the browser using out and rendering the template.
    for (i = 0; i < thestore.teachers.length; i++) {
        teachersList += '<option value=' + thestore.teachers[i].name + '>' + thestore.teachers[i].name + '</option>'
    }
    var context = { teachers: teachersList };
    var template = hogan.compile(template)
    out += template.render(context);
    return out;
}
/**
 deleteSubject function should delete the subject record by splicing empty space into the store.txt file. The getSubjects page should be refreshed when a record is deleted.
 */
function deleteSubject(doEdit, subject) {
    var out = "<h1>Subjects</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Subjectheaders.length; i++) {
        out += '<th >' + Subjectheaders[i] + '</th>';
    }
    out += "</tr>";
    //put the store values into the table
    for (i = 0; i < thestore.subjects.length; i++) {
        out += '<tr style="font-size: 20px;" >';
        out += '<td>' + thestore.subjects[i].name + '</td>'
        out += '<td>' + thestore.subjects[i].teacher + '</td>'
        out += '<td>' + thestore.subjects[i].room + '</td>'
        out += '<td><form method="deleteSubject" action="/deleteSubject(' + thestore.subjects[i].id + ')"><button type="submit">Delete</button></form><form method="editSubject" action="/editSubject(' + thestore.subjects[i].id + ')"><button type="submit">Edit</button></form></td>'
    }
    out += "</table>";

    //copied the above table from students

    var template = fs.readFileSync("./subjectfooter.html", 'utf8');
    var teachersList;
    //For loop to display all the teacher records in the teacher array
    //This works by reading the subjectfooter into memory
    //and for every teacher record in the store, putting it into a hogan template, compiling it, and pushing it to the browser using out and rendering the template.
    for (i = 0; i < thestore.teachers.length; i++) {
        teachersList += '<option value=' + thestore.teachers[i].name + '>' + thestore.teachers[i].name + '</option>'
    }
    var context = { teachers: teachersList };
    var template = hogan.compile(template)
    out += template.render(context);
    return out;
}

//404 function for typos in the URL, etc
/** send404 is pushed to the browser when a request is not found**/
function send404(response) {
    console.log("404");
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: resource not found.');
    response.end();
}
/** the sendFile function  writes the file content to the browser http response **/
function sendFile(response, filePath, fileContents) {
    console.log("send file" + filePath);
    console.log(fileContents);
    response.write(fileContents);
}

/** The serveStatic function checks to see if the page is available from cache -  if it exists in the browser cache, before fetching from server**/
function serveStatic(response, cache, absPath) {
    //cached in memory
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
        // Serve file from memory
    } else {
        fs.exists(absPath, function(exists) {
            //   Check if file exists
            if (exists) {
                data = fs.readFile(absPath, 'utf8');
                cache[absPath] = data;
                sendFile(response, absPath, data);
                //           Serve file read from disk
            }


        });
    }
}
