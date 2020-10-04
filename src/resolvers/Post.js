const Post = {
    author: (parent, args,  {db:{users}}, info)=>{
        return users.find(user=>user.id===parent.authorId)
    },
    comments: (parent, args, {db:{comments}}, info) => {
        return comments.filter(comment=>comment.postId===parent.id)
    }
}

export { Post as default }