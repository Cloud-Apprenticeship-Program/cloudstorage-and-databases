const express = require('express');
const bodyParser = require('body-parser');
const CosmosClient = require("@azure/cosmos").CosmosClient;

var cors = require('cors')
var app = express()

app.use(cors())

let port = 3000;
app.use(bodyParser.urlencoded({ extended: true }))
const endpoint = 'https://pratimadb.documents.azure.com:443/'
const key = 'yourkey'
const client = new CosmosClient({ endpoint, key });
const database = client.database('todo');
const container = database.container('pratima');
var count = 1;

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/get', cors(), async (req, res) => {
  console.log(`Querying container: Items`);
  const querySpec = {
    query: "SELECT * from c"
  };
  // read all items in the Items container
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();
  
  items.forEach(item => {
    console.log(`${item.id} - ${item.description}`);
  });
  
  res.json(items);

})

try {
  app.post('/insert',cors(), (req, res) => {
    const newItem = {
    "id": ''+(count++)+'',
    "category": req.body.category,
    "name": req.body.task,
    "description": req.body.description,
  }
  console.log(newItem)
  container.items.create(newItem).catch(error => console.error(error)); 
  res.redirect('/');
  })

}catch (err) {
    console.log(err.message);
  }

app.post('/delete', cors(), async (req, res) => {
  console.log(req.body);
    
    const { resource: result } = await container.item(req.body.id, req.body.category).delete();
    res.json(req.body.id);
  
  })


app.get('/',cors(), (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});