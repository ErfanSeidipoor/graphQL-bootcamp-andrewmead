import { GraphQLServer, PubSub} from "graphql-yoga";
import db from "./db";

import Query from "./resolvers/Query";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
import Post from "./resolvers/Post";
import User from "./resolvers/User";

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Post,
        User,
        Comment,
        Subscription,
    },
    context: (req)=>{

        console.log(req.request.headers.authorization)

        return {
            db,
            pubsub,            
        }
    }
})

server.start(()=>{
    console.log('server is up > 4000')
})