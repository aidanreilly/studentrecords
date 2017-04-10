#Overview of the Studentrecords.js node.js application

The student records application works as follows:

The node server is created and launches the student records home page. The student records homepage is generated from a parsed JSON txt file and rendered as a simple table by Node.js using hogan.js templating. The POST action to push new content to store.txt is triggered by the user when a new student is added. jQuery reads the values of the form, parses the values to JSON, and pushes it to the store object. A read is done of this store object every time the page is refreshed. 

Each entry on the subject and student array has a unique id that is generated from the length of the array when each array item is added. 

To add student and subject entries on the store object,  a POST action pushes JSONified data to the store object. 

To delete student and subject entries on the store object, a POST action splices an empty entry into the an id ideintfied JSON entry store thereby deleting that entry in the JSON file. 

To edit student and subject entries, a GET action pulls the relevant store entry and populates the information in edit fields for the user to edit. Once the edit is complete, a seperate POST action pushes the information back to the store.  

This doc was built with jsdoc.

    jsdoc studentrecs.js -d out  -r --readme README.md

output is at out/index.html


