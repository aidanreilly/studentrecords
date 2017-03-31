function loadOrInitializeArray(file) {
    fs.exists(file, function (exists) {
        if (exists) {
            var data = fs.readFileSync(file, 'utf8');
            data = data.toString();

            thestore = JSON.parse(data || '{'  +
                '"students":[],'+
                '"subjects" :[]}');
            
        }


    });
}
