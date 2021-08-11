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
        decodedToken = decodedToken.upn;
        req.headers['access'] = decodedToken.toString();     
        let regex = "^" + req.headers['access'] + '$';
        var filter = {'access': {$regex: new RegExp(regex), $options: 'i'}};
        var field = "family." + req.headers.role + ".";
        
        console.log(typeof(req.body))
        console.log(Object.keys(req.body))
        var info = {};
        Object.entries(req.body).forEach(([key, value]) => {
          info[field + key] = value;
        })
        console.log(info)
        let docs = await client.db('tracker').collection('users').updateOne(filter, 
        {$set: info},
        {upsert: true})
        .catch(err => console.error(`Insert failed: ${err}`));
        
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

