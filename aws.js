var AWS = require("aws-sdk");
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
var app = express()
app.use(cors())

let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "yourkey", "secretAccessKey": "yourkey"
};
AWS.config.update(awsConfig);

let port = 1000;
var count = 1;

app.use(bodyParser.urlencoded({ extended: true }))

let docClient = new AWS.DynamoDB.DocumentClient();

app.get('/get', cors(), async (req, res) => {
    var params = {
        TableName: "testtable",
        // Key: {
        //     "id": "1"
        // }
    };

    let scanResults = [];
    let items;
    do{
        items =  await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != "undefined");
    res.json(scanResults);
  })
  
app.post('/insert',cors(), (req, res) => {
    
    var input = {
        "id": ''+(count++)+'', 
        "name": req.body.task, 
        "category": req.body.category,
        "description": req.body.description,
        "created_on": new Date().toString(), 
         "is_deleted": false
    };
    var params = {
        TableName: "testtable",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        if (err) {
            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
           res.redirect('/');                     
        }
    });
    
  })

app.post('/update',cors(), async (req,res)=>{
    var params = {
        TableName: "testtable",
        Key: { "id": "1" },
        UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue",
        ExpressionAttributeValues: {
            ":byUser": "updateUser",
            ":boolValue": true
        },
        ReturnValues: "UPDATED_NEW"

    };
    docClient.update(params, function (err, data) {

        if (err) {
            console.log("users::update::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("users::update::success "+JSON.stringify(data) );
        }
    });
});

app.post('/delete',cors(),async (req,res)=>{
// console.log(req.body)
// return false;
var params = {
    TableName: "testtable",
    Key: {
        "id": req.body.id,
    }
};
docClient.delete(params, function (err, data) {

    if (err) {
        console.log("users::delete::error - " + JSON.stringify(err, null, 2));
    } else {
        console.log("users::delete::success");
        res.json(req.body.id)
    }
    });
})


app.get('/',cors(), (req, res) => {
    res.sendFile(__dirname + '/aws.html')
  })

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

