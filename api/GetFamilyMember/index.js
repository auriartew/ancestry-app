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
        
        let role = req.headers.role;

        let regex = "^" + req.headers['access'] + "$";

        var query = {'access': {$regex: new RegExp(regex), $options: 'i'}};
        var projection = {'firstName': 1, 'lastName': 1, 'dob': 1, "_id" : 0};
        let findExistingUser = await client.db('tracker').collection('users').findOne(query, projection);
        let familyJSON = JSON.parse(JSON.stringify(findExistingUser));
        let familyMember = familyJSON["family"]
        console.log(role)

        
        context.log(familyMember[role]);
        context.log(familyMember[role] === undefined);
        context.res = (
            familyMember[role] !== undefined ? 
            {
            status: 200,
            body: familyMember[role],
          } :
          {
            status: 200,
            body: {},
          } )
        return context.res;
      } catch (err) {
         context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
      }       
    };

};

