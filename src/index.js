import { GraphQLServer } from "graphql-yoga";

// type defenitions (schema) 
    // String, Boolean, Int, Float, ID

const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`

// Resolvers
const resolvers = {
    Query: {
        id: ()=>"abc123ss",
        name: ()=>"erfan",
        age: ()=>27,
        employed: ()=>true,
        gpa: ()=>null
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(()=>{
    console.log('server is up')
})