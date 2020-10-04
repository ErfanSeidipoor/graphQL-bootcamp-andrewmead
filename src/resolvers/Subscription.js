const Subscription = {
    count: {
        subscribe(parent, args, ctx, info) {
            const { pubsub } = ctx
            let count = 0

            setInterval(()=>{
                count++
                pubsub.publish('chanelName',{count})
            },2000)

            return pubsub.asyncIterator('chanelName')
        }
    },
    comment: {
        subscribe:(parent, {postId}, {db:{posts}, pubsub} , info)=>{
            const post = posts.find(post=>post.id===postId)

            if(!post) {
                throw new Error("Post Not Found")
            }

            return pubsub.asyncIterator(`comment ${postId}`)
        }
    },
    post: {
        subscribe: (parent, args, {pubsub}, info)=>{
            return pubsub.asyncIterator("post")
        }
    }
}

export { Subscription as default }