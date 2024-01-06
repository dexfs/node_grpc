const parseArgs = require('minimist');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = `${__dirname}/./proto/greet.proto`

const packageDefinitions = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const greet_proto = grpc.loadPackageDefinition(packageDefinitions).greeter;


function main() {
    const argv = parseArgs(process.argv.slice(2), {
        string: 'target',
    });

    let target;
    if (argv.target) {
        target = argv.target;
    } else {
        target = '0.0.0.0:50051';
    }

    const client = new greet_proto.Greeter(target, grpc.credentials.createInsecure());
    let user;
    if (argv._.length > 0) {
        user = argv._[0];
    } else {
        user = 'world';
    }
    const request = {name: user};
    client.sayHello(request, function(err, response) {
        if (err) {
            return console.error(err)
        }
        console.log(`Greeting: ${response.message}`);
    });
}

main();