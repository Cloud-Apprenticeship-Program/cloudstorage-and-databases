const CosmosClient = require("@azure/cosmos").CosmosClient;
const app = express();

const endpoint = 'https://anishdb.documents.azure.com:443/'
const key = 'FpfrHLXt9MVel5OX3IfhHskTpWsV90CN7yEPtbzYdLGEfJw4ZFAp4jZ0Euj6EpaFZ9pey96RGdaGgwSXH7l9VA=='
const client = new CosmosClient({ endpoint, key });

const database = client.database('todo');

const container = database.container('anish');


app.get('/', async (req, res) => {

  const querySpec = {
    query: "SELECT * FROM c WHERE c.id=@id",
    parameters: [
        {
            name: "@id",
            value: '3'
        }
    ]
};
const queryResponse = await container.items.query(querySpec).toArray();
console.log(queryResponse.result[0].name);

})

// const newItem = {
//     "id": "5",
//     "category": "anish",
//     "name": "Anish DB",
//     "description": "Complete anish DB Node.js Quickstart ⚡",
//     "isComplete": false,
//   };

//   const { resource: createdItem } = container.items.create(newItem);

//   const { resource: result } =  container.item('2').delete();
//   const { resource: result2 } =  container.item('4').delete();
//   const { resource: result3 } =  container.item('5').delete();