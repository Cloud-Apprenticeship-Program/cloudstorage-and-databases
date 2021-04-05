const express = require('express');
var azure = require('azure-storage');
const bodyParser = require('body-parser');
var cors = require('cors')
var app = express()
var connectionString = 'connectionstring';

app.use(cors())
let port = 9000;
var tableSvc = azure.createTableService(connectionString);
var count = 1;

app.use(bodyParser.urlencoded({ extended: true }))

app.post('/newtable', cors(), async (req, res) => {
    var table = req.body.table_name
tableSvc.createTableIfNotExists(table, function(error, result, response){
    if(!error){
       
      console.log('created');
      res.redirect('/');
    }
  });

});

try {
app.post('/insert',cors(), (req, res) => {
var entGen = azure.TableUtilities.entityGenerator;
var task = {
  PartitionKey: entGen.String('hometasks'),
  RowKey: entGen.String( ''+(count++)+'',),
  name: entGen.String(req.body.task),
  category: entGen.String(req.body.category),
  description: entGen.String(req.body.description),
  dueDate: entGen.DateTime(new Date(Date.UTC(2015, 6, 20))),
};

tableSvc.insertEntity('mytable',task, function (error, result, response) {
    if(!error){
      console.log('DOne');
    }
  });
      
    res.redirect('/');
    })
  
  }catch (err) {
      console.log(err.message);
    }


app.post('/delete', cors(), async (req, res) => {
       var task = {
    PartitionKey: {'_':req.body.PartitionKey},
    RowKey: {'_': req.body.RowKey}
  };
  
  tableSvc.deleteEntity('mytable', task, function(error, response){
    if(!error) {
      res.json(req.body.RowKey)
    }
  });
    
    })

  

  app.get('/get',cors(), (req, res) => {
    var options = { payloadFormat: "application/json;odata=nometadata" };
    var query = new azure.TableQuery()
    .top(5)
    .where('PartitionKey eq ?', 'hometasks');
  
    tableSvc.queryEntities('mytable',query, null,options, function(error, result, response) {
      if(!error) {
       res.send(response.body);
      }
    });
  })

  app.get('/',cors(), (req, res) => {
    res.sendFile(__dirname + '/storage.html')
  })


app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
