//Each var element instantiates the various node components for use in the node application.
//http module is for sending and receiving http traffic in the node application
//qs  is for parsing and formatting URL query strings
//fs is for file i/o operations
//path is for manipulating file paths, finding the basename, file type, etc.
//hogan.js is a tempalting engine that simlifies html development
//the cache var is instantiated here so that it can store content later in the program
//thestore is a "braced" complex variable with two arrays, students and subjects

var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var path = require('path');
var hogan = require('hogan.js');
var cache = {};
var thestore = {
    students: [],
    subjects: [],
    teachers: [],
    grades: []
};

//prints the URL to the console
console.log("running on http://localhost:3000/")

//The store var is a text file stored in the root dir. 
//It contains the json that maps to the student records.
//The two header vars set the column headers that are used for the two arrays, 
//students and subjects in the store object - a json "database" basically.
var store = "./store.txt";
var Studentheaders = [
    "First Name", "Second Name", "Subjects", "Operation"];
var Subjectheaders = [
    "Name","Teacher", "Room", "Operation"];

//The loadOrInitializeArray function takes the var store as an input.
//The http server var processes requests and responses.
//the createServer method creates the server and sets it up to process requests and responses
// The url var is parsed from the http req input
//push the request and URL and the request method to the console
//the filePath var is initiated as false. 
//the main body of the application is set up in the server variable here.
loadOrInitializeArray(store);
var server = http.createServer(function (req, res) {
    var url = req.url;
    console.log('request ' + url + ' method ' + req.method);
    var filePath = false;

//if the method is a POST method and has /addStudent encoded in the URL, 
//print to the console, process the req request
//the request on method processes the request body, 
//binds it to the POST event
//the var body quotation is used to construct the URL starting with  a quoatation
// to open the concatenated data from the POST request  

    if (req.method == 'POST') {
        if (url == "/addStudent") {
            var body = '';
            //why not var body = [];?
            console.log("add Student ");   
            req.on('data', function (data) {
                body += data;
            });
//once the request ends, the qs module parses the body of the POST addStudent request into the student object
// print to  the console, and print the student var to the console.
//the unique id for the student is obtained by getting the length value of the students array   
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
                // Convert the subjects variable into an Array if there is only one subject
                if  (!(student.subjects instanceof Array)) {
                    if (student.subjects != null)
                        student.subjects = [student.subjects];
                    else {
                        console.log("student subjects is null");
                        student.subjects = [];
                    }
                }
                //now we stringify the message using the JSON stringify method and post it to the console.
                console.log('student: '+JSON.stringify(student, null, 2));
                thestore.students.push(student);
                //storeTheStore function adds the student record to the json txt file.
                storeTheStore(store);
                showPage(req, res, displayStudents(true), "./studentfooter.html");


            });
        }

//if the method is a POST method and has /addSubject encoded in the URL, 
//print to the console, process the req request
//the request on method processes the request body, 
//binds it to the POST event
//the var body quotation is used to construct the URL starting with  a quoatation
// to open the concatenated data from the POST request  
        else if (url == "/addSubject") {
            var body = '';
            console.log("add Subject ");
            req.on('data', function (data) {
                body += data;
            });
            // on completing the request, print the entire body of the request to the console
            req.on('end', function () {
                var subject = qs.parse(body);
                console.log('body '+body);
                console.log(subject);
                subject.id = thestore.subjects.length;

                //parse subject and add subject object into thestore.subjects - not sure this is working

                if (thestore.subjects === undefined) {
                    thestore.subjects = [];
                    console.log("subjects is undefined");
                }
                else
                // Convert the subjects variable into an Array if there is only one subject
                if  (!(thestore.subjects instanceof Array)) {
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

                //now we stringify the message using the JSON stringify method and post it to the console.
                console.log('subject: '+JSON.stringify(subject, null, 2));
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
            req.on('data', function (data) {
                body += data;
            });
//req.on binds the URL event to the object passed in the URL when the end event is triggered
            req.on('end', function () {
                console.log(body);
                //querystring parser parses the body of the url body
                var obj = qs.parse(body);
                console.log('body '+body);
                console.log(obj);
                // TODO parse delete and remove the student
                //storeTheStore function adds the subjects to the json txt file.
                storeTheStore(store);
                // launch the showpage function, has a request and response  param, 
                //a  displayStudents method, and an included footer file 
                showPage(req, res, displayStudents(), "./studentfooter.html");
            });

        }

//if the method is a POST method and has /deleteSubject encoded in the URL, 
//print to the console, process the req request
//the request on method processes the request body, 
//binds it to the POST event
//the var body quotation is used to construct the URL starting with  a quotation
// to open the concatenated data from the POST request  

        else if (url == "/deleteSubject") {
            var body = '';
            console.log("delete subject ");
            req.on('data', function (data) {
                body += data;
            });

//parse the /deleteSubject request
// put the parsed post in the store
            req.on('end', function () {
                var post = qs.parse(body);
//show the store page and append the subjectfooter.html page
//storeTheStore function adds the subjects to the json txt file.
                storeTheStore(store);
                showPage(req, res, displaySubjects(), "./subjectfooter.html");
            });

        }
    }
    //if the url is getStudents, print to the log 
    //show page function displays the students and append the footer html page
    else if (url == "/getStudents") {
        console.log("getstudents");
        showPage(req, res, displayStudents(), "./studentfooter.html");
    }

    //if the url is getSubjects, print to the log 
    //show page function  display the subjects and append the footer html page
    else if (url == "/getSubjects") {
        console.log("getSubjects");
        showPage(req, res, displaySubjects(), "./subjectfooter.html");
    }

    else
        showPage(req, res, displayStudents(), "./studentfooter.html");


});

//listen on port 3000
server.listen(3000);

//showPage function  is called whenever a reqest or response is triggered.
// the res.writehead method posts response code 200, has a content type of text/html
//print show page on the console
//the data var is populated by the filesystem module.
//the readfileSync method of the fs module
function showPage(req, res, str, footer) {
    res.writeHead(
        200,
        {"content-type": 'text/html'}
    );
    //returns the page to the browser
    //the data variable is populated with the contents of the header.html 
    // which is parsed by the ReadFileSync file read method, encoded in utf 8.
    console.log("showpage");
    data = fs.readFileSync("./header.html", 'utf8');
//str is added to the data var and saved to the data var 
    data += str;
//the res response ends when the res.end and sends the data without specifying a content-type  
    res.end(data);
}
//define the storeTheStore function which takes file as a parameter  
function storeTheStore(file) {
    //the fs writeFile method stringifys
    // the json thestore complex var in utf8, 
    // and can also pass an error to the callback function
    fs.writeFile(file, JSON.stringify(thestore, null, 2), 'utf8', function (err) {
        //if an err is experienced, throw the err exception
        if (err) throw err;
        //otherwise print' 'Saved' to the log.
        console.log('Saved.');
    });
}

//define the loadOrInitializeArray function which takes a file parameter.
//fs checks if the file exists, if it does, read the file encoded as UTF8
// to the data var.
//then, turn the data var into a string

function loadOrInitializeArray(file) {
    fs.exists(file, function (exists) {
        if (exists) {
            var data = fs.readFileSync(file, 'utf8');
            data = data.toString();
//evaluate the data string and parse it into thestore  students and subjects arrays.
            thestore = JSON.parse(data || '{'  +
                '"students":[],'+
                '"subjects":[],'+
                '"teachers":[],'+
                '"grades" :[]}');
        }
    });
}

//defines the displayStudents function, takes doEdit and student params
//the out var encodes the header when output to html
//the for loop builds the table.
// iterate over i for the number of studentheader elements
//create the <th> entries in the table and populate with the values of each studentheader entry
//do the same for students and id
function displayStudents(doEdit,student) {
    var out = "<h1> Students</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Studentheaders.length; i++) {
        out += '<th >' + Studentheaders[i] + '</th>';
    }
    out += "</tr>";
//put the store values into the table
//the editStudent and deleteStudent functions are defined in header.h
    for (i = 0; i < thestore.students.length; i++) {
    	out += '<tr style="font-size: 20px;" >';
	out +='<td>'+thestore.students[i].firstname+'</td>'
	out +='<td>'+thestore.students[i].surname+'</td>'
	out +='<td>'+thestore.students[i].subjects+'</td>'
    	out += '<td><button onclick="editStudent('+thestore.students[i].id+')">Edit</button> <button onclick="deleteStudent('+thestore.students[i].id+')">Delete</button></td>'
//see jquery bits, how to fit the plumbing togwther?!!
     // TODO Output Studthestoreents
     //   out+= '<td>'+thestore.students[i].firstname+'</td>'
    //'<td>'+'<button onclick="deleteStudent('+thestore.students[i].id+')">Delete</button>'
    //'</td>';
    }
    out += "</table>";
//the template  var is buit by fs readfile which takes the input from studentfooter.html
    var template =  fs.readFileSync("./studentfooter.html", 'utf8');
    var context = {subjects: 
//TODO need to loop through this to build the options list

        '<option value="maths">Maths</option>'+
        // TODO output student subjects
    '<option value="english">English</option>'+
    '<option value="irish">Irish</option>'+
        '<option value="french">French</option>'+
            '<option value="latin">Latin</option>'};
    var template = hogan.compile(template);
    //hogan compiles the template for output to the browser
    out+=template.render(context);
    //return the out to the browser
    return out;
}
//defines the displaySubjects function  
//similiarly to the Students above
//the html is appended to the out var, and rendered to the browser with hogan
function displaySubjects(doEdit,subject) {
    var out = "<h1>Subjects</h1><table border=1 width=100%>";
    var i;
    out += '<tr style="font-size: 20px;" >';
    for (i = 0; i < Subjectheaders.length; i++) {
        out += '<th >' + Subjectheaders[i] + '</th>';
    }
    out += "</tr>";
//put the store values into the table
//the editSubject and deleteSubject functions are defined in header.h TODO TODO
    for (i = 0; i < thestore.subjects.length; i++) {
        out += '<tr style="font-size: 20px;" >';
    out +='<td>'+thestore.subjects[i].name+'</td>'
    out +='<td>'+thestore.subjects[i].room+'</td>'
    out +='<td>'+thestore.subjects[i].teacher+'</td>'
        out += '<td><button onclick="editSubject('+thestore.subjects[i].id+')">Edit</button> <button onclick="deleteSubject('+thestore.subjects[i].id+')">Delete</button></td>'
    }
    out += "</table>";

//copied the above table from students

    var template =  fs.readFileSync("./subjectfooter.html", 'utf8');
    var context = {teachers: '<option value="Mr. T">Mr. T</option>'+
    '<option value="Ms. Q">Ms. Q</option>'+
        '<option value="Mr. O">Mr. O</option>'+
        '<option value="Mrs. P">Mrs. P</option>'};
    var template = hogan.compile(template);
    out+=template.render(context);
    console.log(out);
    return out;
}

//404 function for typos in the URL, etc
function send404(response) {
    console.log("404");
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}
//the sendFile function  writes the file content to the browser http response
function sendFile(response, filePath, fileContents) {
    console.log("send file" + filePath);
    console.log(fileContents);
    response.write(fileContents);
}

//if the page exists in the browser cache, server that before fetching from server
function serveStatic(response, cache, absPath) {
    //cached in memory
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
        // Serve file from memory
    } else {
        fs.exists(absPath, function (exists) {
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
