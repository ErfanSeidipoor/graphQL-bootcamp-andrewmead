const Query = {
    comments:(parent, args,  {db:{comments}}, info)=>{
        const { query } = args
        if(!query)
            return comments
        return comments.filter( comment=>comment.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()) )   

    },
    users: (parent, args, {db:{users}}, info)=> {
        const { query } = args

        if(!query)
            return users

         return users.filter( user=>user.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) )   
    },
    posts: (parent,args, {db:{posts}}, info)=>{
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
}

export { Query as default }