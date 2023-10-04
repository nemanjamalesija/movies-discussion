SOCIALIS - social network  
FEATURES:

AUTHENTICATION:

- For authentication I used Jason Web Tokens.
- JWT is saved in local storage and sent on request where nescessary.

USERS:

- Sign up
- Log in
- Log Out
- Search users
- Look up users' individual profiles

FRIENDSHIPS:

- Send friend requests
- Accept friend requests
- Delete friends from friends list

POSTS:

- Posts feed (home page)
- Post
- Like post
- Unlike post
- Delete post

COMMENTS:

- Comment
- Edit comment
- Delete comment

TODO:

- Complete image upload for users
- Allow users to edit their profiles
- Allow users to send messages

TECHNOLOGIES USED:  
Vue 3, Pina, Typescript, Zod, Tailwind css, Express, Mongo DB.

- After cloning the repository, Run "npm install" to install packages both in the server and client folders.

ENVIRONMENT VARIABLES:
DATABASE_PASSWORD= Mongo DB database password  
DATABASE= Mongo DB connection string  
PORT= Port (e.g. 3001)

START SCRIPTS:

- server: npm start
- client: npm run dev
