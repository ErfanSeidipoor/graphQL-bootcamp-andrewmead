import { GraphQLServer } from "graphql-yoga";

// type defenitions (schema) 
    // String, Boolean, Int, Float, ID

const typeDefs = `
    type Query {
        greeting(name:String, position: String): String!
        add(a: Float!, b: Float!): Float!
        addArray(numbers:[Float!]): Float!
        grades: [Int!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }

`

// Resolvers
const resolvers = {
    Query: {
        grades: ()=>{
            return [99,332,23,15]
        },
        greeting(parent, args, ctx, info){
            console.log("parent:",parent);
            console.log("args:",args);
            console.log("ctx:",ctx);
            console.log("info:",info);

            const {
                name,
                position
            } = args
            return `hello ${args.name}! You are my favorite ${position}`
        },
        add:(parent, args, ctx, info)=>{
            const { a, b } = args
            return a+b
        },
        addArray: (parent, args)=>{
            const {numbers} = args
            
            if(numbers.length===0) return 0
            
            console.log(numbers)
            const total = numbers.reduce( (total,number)=>total+number )

            return total


        },
        me: ()=>{
            return {
                id: "12123qweqwe",
                name: "Mike",
                email: "Mik@example.com",
                age: null
            }
        },
        post: ()=>{
            return ({
                id: '0234d',
                title: 'GraphQL 101',
                body: 'this is a test',
                published: false
            })
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(()=>{
    console.log('server is up > 4000')
})