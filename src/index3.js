import { GraphQLServer } from "graphql-yoga";

const comments = [
    {
        id: '111',
        text: 'this is a comment 1',
        authorId: '3',
    },
    {
        id: '222',
        text: 'this is a comment 2',
        authorId: '1',
    },
    {
        id: '333',
        text: 'this is a comment 3',
        authorId: '2',
    },
    {
        id: '444',
        text: 'this is a comment 4',
        authorId: '2',
    },

]
const users = [
    {
        id:'1',
        name: 'Andrew',
        email: 'andrew@example.com',
        age: 23
    },
    {
        id:'2',
        name: 'Sarah',
        email: 'sarah@example.com'
    },
    {
        id: '3',
        name: 'Mike',
        email: 'mike@example.com'
    }
]

const posts = [
    {
        id:'10',
        title: 'GraphQL 101',
        body: 'THis is how to use GraphQL',
        published: true,
        authorId: '1',
    },
    {
        id:'11',
        title: 'GraphQL 201',
        body: 'THis is Advances GraphQL post...',
        published: true,
        authorId: '1',
    },
    {
        id:'12',
        title: 'Programing Music',
        body: 'sad',
        published: false,
        authorId: '2',
    },
]

const typeDefs = `
    type Query {
        users(query: String):[User!]!
        posts(query: String):[Post!]!
        me: User!
        post: Post!
        comments(query:String): [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
    }
`

// Resolvers
const resolvers = {
    Query: {
        comments:(parent, args, ctx, info)=>{
            const { query } = args
            if(!query)
                return comments
            return comments.filter( comment=>comment.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()) )   

        },
        users: (parent, args, ctx, info)=> {
            const { query } = args
            if(!query)
                return users

             return users.filter( user=>user.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) )   
        },
        posts: (parent,args,ctx, info)=>{
            const {query} = args
            if(!query)
                return posts
            return posts.filter( post=>
                post.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
                post.body.toLocaleLowerCase().includes(query.toLocaleLowerCase()) 
            )   
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
    },
    Post: {
        author: (parent, args, ctx, info)=>{
            return users.find(user=>user.id===parent.authorId)
        }
    },
    User: {
        posts: (parent, args, ctx, info)=> {
            return posts.filter(post=>post.authorId===parent.id)
        }
    },
    Comment: {
        author: (parent, args, ctx, info)=> {
            return users.find(user=>user.id===parent.authorId)
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(()=>{
    console.log('server is up > 4000')
})