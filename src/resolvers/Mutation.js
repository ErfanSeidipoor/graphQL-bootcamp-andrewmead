import { v4 as uuidv4 } from 'uuid';

const Mutation = {
    createUser: (parent, args,  {db:{users}}, info)=> {
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
    updateUser: (parent, args, {db:{users}},info)=>{
        const {id, data} = args

        const user = users.find(user=>user.id===id)
        if(!user) {
            throw new Error("User Not Found")
        }

        if (typeof data.email === "string") {
            const emailTaken = users.some(user=> user.email===data.email)

            if(emailTaken) {
                throw new Error('Email taken')
            }

            user.email = data.email
        }

        if(typeof data.name==="string") {
            user.name = data.name
        }

        if(typeof data.age!=="undefined") {
            user.age = data.age
        }

        return user


    },
    createPost: (parent, args, {db:{users,posts}, pubsub}, info)=> {
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

        pubsub.publish('post', {
            post: {
                mutation: "CRAETED",
                data: post
            }
        })
        return post

    },
    updatePost: (parent, args, {db: {posts}, pubsub})=> {
        const {id, data} = args

        const post = posts.find( post=> post.id===id)

        if(!post) {
            throw new Error("Post Not Found")
        }

        if (typeof data.title === 'string' ){
            post.title = data.title
        }

        if (typeof data.body === 'string' ){
            post.body = data.body
        }

        if (typeof data.published === 'boolean' ){
            post.published = data.published
        }

        pubsub.publish('post', {
            post: {
                mutation: "UPDATED",
                data: post
            }
        })

        return post

    },
    createComment: (parent, args, {db:{users, posts, comments}, pubsub}, info)=>{
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

        pubsub.publish(`comment ${postId}`, {
            comment:{
                mutation: "CRAETED",
                data: comment
            }
        })

        comments.push(comment)
        return comment
    },
    deleteUser: (parent, args, {db:{users, posts, comments}}, info)=>{
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
    deletePost: (parent, args, {db:{posts, comments}, pubsub}, info)=> {
        const { id } = args

        const postIndex = posts.findIndex(post=>post.id===id)
        if(postIndex===-1) {
            throw new Error('Post Not Found')
        }

        // const deletedPost = posts.splice(postIndex,1)
        const [deletedPost] = posts.splice(postIndex,1)
        comments = comments.filter(comment=> comment.postId !== id )

        pubsub.publish("post",{
            post: {
                mutation: "DELETED",
                data: deletedPost
            }
        })


        // return deletedPost[0]
        return deletedPost

    },
    deleteComment: (parent, args, {db:{ comments},pubsub}, info)=> {
        const {id}= args
        const commentIndex = comments.findIndex(comment=>comment.id===id)

        if (commentIndex===-1) {
            throw new Error("Comment not Found")
        }

        const deletedComment = comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${deletedComment[0].postId}`,{
            comment: {
                mutation: "DELETED",
                data: deletedComment[0],
            }
        })

        return deletedComment[0]
    },
    updateComment: (parent, args, {db:{comments}, pubsub},info)=> {
        const {id, data} = args
        const comment = comments.find(comment=>comment.id===id)
        
        if(!comment) {
            throw new Error("Comment Not Found")
        }

        if( typeof data.text === "string") {
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.postId}`, {
            comment : {
                mutation:'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }