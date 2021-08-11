const mongodb = require('mongodb');
const uri = process.env["MongoDbAtlasConnectionStr"];

const jwt = require('jsonwebtoken');

// May be retained between function executions depending on whether Azure
// cleans up memory
let client = null;

module.exports = async function (context, req) {
    context.log('Running');
  
    return client !== null ? query() :  run();
  async function run() {
    try {
        client = new mongodb.MongoClient(uri, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
        });
        await client.connect();
        await query();
    } catch (err) {
        context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
      context.log("client closed.");
      client = null;
    }
  }

  async function query() {
      try {
            console.log(req.body);
            var token = req.body.access;
            var decodedToken = jwt.decode(token);
            
            console.log(decodedToken.upn);

            req.body.data['access'] = decodedToken.upn;
            
            let docs = await client.db('tracker').collection('posts').insertOne(req.body['data'])
            .catch(err => console.error(`Failed to find documents: ${err}`));
        
        return (context.res = {
            status: 200,
            body: docs,
          });
      } catch (err) {
         context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
      }       
    };

};

