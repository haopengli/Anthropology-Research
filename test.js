var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1qX4xKjvTuWfzzPcIuuNDB3_88pvzlchEVaxqotSoXj8');

// Authenticate with the Google Spreadsheets API.
doc.useServiceAccountAuth(creds, function (err) {

    doc.addRow(1, { last_name: 'Agnew', first_name: 'Samuel' }, function(err) {
        if(err) {
            console.log(err);
        }
    });
});