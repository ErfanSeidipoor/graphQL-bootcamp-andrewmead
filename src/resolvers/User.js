const User = {
    posts: (parent, args,  {db:{posts}}, info)=> {
        return posts.filter(post=>post.authorId===parent.id)
    },
    comments: (parent, args, {db:{comments}}, info) =>{
        return comments.filter(comment=> comment.authorId===parent.id)
    }
}

export {User as default}