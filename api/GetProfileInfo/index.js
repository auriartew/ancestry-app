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
      
    }
  }

  async function query() {
      try {
        var token = req.headers.access;
        var decodedToken = jwt.decode(token);
        context.log(decodedToken.toString());
        decodedToken = decodedToken.upn;
        req.headers['access'] = decodedToken.toString();
        context.log(req.headers.access)

        let regex = "^" + req.headers['access'] + "$";

        var query = {'access': {$regex: new RegExp(regex), $options: 'i'}};
        var project = {projection: {"_id" : 0, "access": 0}};
        let findExistingUser = await client.db('tracker').collection('users').findOne(query, project);
        /**
         * 
         let docs = await client.db('tracker').collection('users').insertOne(req.body)
        .catch(err => console.error(`Failed to find documents: ${err}`));6E8uMBf3iD89qBx
         */
        
        context.log(findExistingUser);
        return (context.res = {
            status: 200,
            body: findExistingUser,
          });
      } catch (err) {
         context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
      }       
    };

};

