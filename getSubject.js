if (url == "/addSubject") {
    var body = '';
    console.log("add subject ");
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var subject = qs.parse(body);
        console.log('body '+body);
        console.log(subject);
        subject.id = thestore.subjects.length;

        // The subjects attribute can be undefined if the user does not
        // select a subject for the subject.
        if (subject.subjects === undefined) {
            subject.subjects = [];
            console.log("subject subjects is undefined");
        }
        else
        // Convert the subjects variable into an Array if there is only be one subject
        if  (!(subject.subjects instanceof Array)) {
            if (subject.subjects != null)
                subject.subjects = [subject.subjects];
            else {
                console.log("subject subjects is null");
                subject.subjects = [];
            }
        }
        console.log('subject: '+JSON.stringify(subject, null, 2));
        thestore.subjects.push(subject);
        storeTheStore(store);
        showPage(req, res, displaysubjects(true), "./subjectfooter.html");


    });
}