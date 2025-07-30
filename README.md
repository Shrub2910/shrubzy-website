# Shrubzy website

## Project overview
Shrubzy is a Vue/Nuxt powered social media platform that allows users to like, comment, follow other users

## What has been completed so far
- Users <br>
- Posts <br>
- Individual pages for posts <br>
- Allowed the editing and deletion of posts <br>
- Like button<br>
- Decent UI/UX but can be improved<br>
- Replies to posts

## What's to come
- User customisation (Ability to change username, upload avatar (possibly using supabase buckets), biography)<br>
- A way to filter or order posts
- Following users (Only see posts by users you follow)
- Admin page
- Either a direct message feature or the ability to tag other people in posts <b>(or both)</b>

## Deployment
- Deployment: Currently deployed using vercel and database managed by Supabase

## Tech Stack
### Front end
- Nuxt 3 / Vue 3.5.17
- Tailwind 6.14.0
- Pinia 0.11.2
- Using an npm package to allow for contenteditable tags to support v-model: https://www.npmjs.com/package/vue-contenteditable 4.1.0
### Database
- Postgres Database
### Back end
- Using Nuxt to manage routing for both front end and back end
- Drizzle ORM
### Authentication
- Nuxt auth utils to manage authentication using sealed cookies


## Screenshot
<img width="1877" height="961" alt="image" src="https://github.com/user-attachments/assets/9c71d0eb-048e-4353-a1d2-8beb99e9b91a" />
