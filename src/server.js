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

function sayHello(call, callback) {
    callback(null, {message: `Hello ${call.request.name} from ${call.request.country || 'Brazil'}`});
}

function main() {
    const server = new grpc.Server();
    server.addService(greet_proto.Greeter.service, {sayHello: sayHello});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('Running on 0.0.0.0:50051')
        server.start();
    })
}


main()