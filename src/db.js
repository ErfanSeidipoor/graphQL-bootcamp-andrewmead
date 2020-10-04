const comments = [
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


const db = {
    users,
    posts,
    comments,
}

export { db as default }