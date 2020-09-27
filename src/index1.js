import { GraphQLServer } from "graphql-yoga";

// type defenitions (schema) 
    // String, Boolean, Int, Float, ID

const typeDefs = `
    type Query {
        id: ID!
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float!
        inStock: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        id: ()=> '121d',
        title: ()=> "The War of Art",
        price: ()=> 12.90,
        releaseYear: ()=>null,
        rating: ()=>5,
        inStock: ()=>true
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(()=>{
    console.log('server is up')
})