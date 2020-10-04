const Comment = {
    author: (parent, args, {db:{users}}, info)=> {
        return users.find(user=>user.id===parent.authorId)
    },
    post : (parent, args,  {db:{posts}}, info)=>{
        return posts.find(post=>post.id===parent.postId)
    }
}

export { Comment as default}