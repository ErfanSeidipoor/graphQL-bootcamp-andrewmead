import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from 'uuid';

let comments = [
    {
        id: '111',
        text: 'this is a comment 1',
        authorId: '3',
        postId: '10'
    },
    {
        id: '222',
        text: 'this is a comment 2',
        authorId: '1',
        postId: '10'
    },
    {
        id: '333',
        text: 'this is a comment 3',
        authorId: '2',
        postId: '12'
    },
    {
        id: '444',
        text: 'this is a comment 4',
        authorId: '2',
        postId: '12'
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

let posts = [
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id:ID!): User!
        createPost(data: CreatePostInput!):Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!,
        body: String!,
        published: Boolean!,
        authorId: ID!
    }
    
    input CreateCommentInput {
        text: String!
        authorId: ID!
        postId: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
    },
    Mutation: {
        createUser: (parent, args, ctx, info)=> {
            const {
                name, email, age
            } = args.data

            const emailTaken = users.some( user=> user.email===email )
            
            if(emailTaken) {
                throw new Error("Email Taken.")
            }

            const user = {
                 id : uuidv4(),
                 name,
                 email,
                 age,
            }

            users.push(user)
            return user

        },
        createPost: (parent, args, ctx, info)=> {
            const {
                title, body, authorId, published,
            } = args.data

            const userExists = users.some( user=> user.id===authorId )
            if(!userExists) {
                throw new Error("user not found")
            }

            const post = {
                id : uuidv4(), 
                authorId,
                title,
                body,
                published,
            }

            posts.push(post)
            return post

        },
        createComment: (parent, args, ctx, info)=>{
            const {
                text,
                authorId,
                postId,
            }= args.data

            const userExists = users.some( user=> user.id===authorId )
            if(!userExists) {
                throw new Error("User Not Found")
            }

            if(!posts.some(post=>post.id===postId))
                throw new Error('Post Not Found')

            const comment = {
                id: uuidv4(),
                text,
                authorId,
                postId
            } 

            comments.push(comment)
            return comment
        },
        deleteUser: (parent, args, ctx, info)=>{
            const {id} = args

            const userIndex = users.findIndex(user=>user.id===id)
            if(userIndex===-1) {
                throw new Error("User Not Found")
            }

            const deletedUser = users.splice(userIndex, 1)

            posts = posts.filter(post=>post.authorId!==deletedUser[0].id)
            

            comments = comments.filter (comment=> comment.authorId !== deletedUser[0].id)
            return deletedUser[0]
        },
        deletePost: (parent, args, ctx, info)=> {
            const { id } = args

            const postIndex = posts.findIndex(post=>post.id===id)
            if(postIndex===-1) {
                throw new Error('Post Not Found')
            }

            const deletedPost = posts.splice(postIndex,1)
            comments = comments.filter(comment=> comment.postId !== id )

            return deletedPost[0]

        },
        deleteComment: (parent, args, ctx, info)=> {
            const {id}= args
            const commentIndex = comments.findIndex(comment=>comment.id===id)

            if (commentIndex===-1) {
                throw new Error("Comment not Found")
            }

            const deletedComment = comments.splice(commentIndex, 1)

            return deletedComment[0]
        }
    },
    Post: {
        author: (parent, args, ctx, info)=>{
            return users.find(user=>user.id===parent.authorId)
        },
        comments: (parent, args, ctx, info) => {
            return comments.filter(comment=>comment.postId===parent.id)
        }
    },
    User: {
        posts: (parent, args, ctx, info)=> {
            return posts.filter(post=>post.authorId===parent.id)
        },
        comments: (parent, args, ctx, info) =>{
            return comments.filter(comment=> comment.authorId===parent.id)
        }
    },
    Comment: {
        author: (parent, args, ctx, info)=> {
            return users.find(user=>user.id===parent.authorId)
        },
        post : (parent, args, ctx, info)=>{
            return posts.find(post=>post.id===parent.postId)
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

server.start(()=>{
    console.log('server is up > 4000')
})