const mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
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
    } 
  }

  async function query() {
      try {   
          /**    
            var token = req.headers.access;
            console.log(token);       
            var decodedToken = jwt.decode(token);
            decodedToken = decodedToken.upn
            */
        var data = JSON.parse(req.headers.data);
        console.log(req.headers.data)
        var query = [];
         
        Object.keys(data).map((key) => {
            if (data[key].length > 0) {
                console.log(key)
                query.push(key);
                //{$regex: `${data[key]}`}
            }
        })
        var projection = {projection: {"_id" : 0, "about": 0}};
        var test = await client.db('tracker').collection('users').find({}, projection)
        //.toArray()
        //.catch(err => console.error(`Failed to find documents: ${err}`));
        
        
        let document;
        let result = [];
        console.log(data["hardSearch"]);
        if (data["hardSearch"]) {
            while ((document = await test.next())) {
                Object.keys(document.family).forEach((key) => {
                    let familyMember = document.family[key];
                    if (familyMember.firstName === data["firstName"]
                        && familyMember.lastName === data["lastName"]) {
                            result.push(document.family[key])
                            
                    }
                })
                //console.log(document.family)
            }
        }
        else {
            while ((document = await test.next())) {
                Object.keys(document.family).forEach((key) => {
                    let familyMember = document.family[key];
                    console.log(document.family[key])
                    if (familyMember.firstName === data["firstName"]
                        || familyMember.lastName === data["lastName"]) {
                            result.push(document.family[key])
                            
                    }
                })
                //console.log(document.family)
            }
        }
        

        console.log(result)
        //console.log("test " + JSON.parse(test))
        /**
         * 
         
        let docs = await client.db('tracker').collection('people').find(query)
        .toArray()
        .catch(err => console.error(`Failed to find documents: ${err}`));
        console.log(docs);*/
        return (context.res = {
            status: 200,
            body: result,
        });
      } catch (err) {
         context.log.error('ERROR', err);
        // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
        throw err;
      }  
    };
};

