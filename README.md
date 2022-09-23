The list of group members, including matriculation numbers, names and a description of the contributions of each member to the assignment.
The URL to your application, i.e. your application must be accessible online somewhere.
The name of your application.
Set-up instructions for local testing (good to have).

# Splitas

Try out our app here:
https://2022-a3-2022-a3-group-10.vercel.app/

## Our team

Groups members
- Mark Wong: A0219963R (Design, Frontend, Backend)
- Owen Yap: A0233504R (Frontend, Design)
- Ryan Peh: A0219687L (Deployment, Frontend)
- Sun Jia Cheng: A0214263N (PWA features, Backend)

## Instructions for Local testing

It is better to test a PWA on the production version than the development version as caching features are missing from the development version. The following environment variables are needed:

- DATABASE_URL
- PAYMELAH_CLIENT_ID
- PAYMELAH_CLIENT_SECRET
- NEXT_PUBLIC_SERVER
- WEB_PUSH_PRIVATE_KEY
- NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
- WEB_PUSH_EMAIL
- JWT_PUBLIC_KEY
- JWT_PRIVATE_KEY

Note that PAYMELAH_CLIENT_ID, PAYMELAH_CLIENT_SECRET are secrets to the Google Cloud Project PayMeLah, which is inaccessible to external testers. However, it is still possible to setup your own Cloud project and set it. Also note that Splitas was previously called PayMeLah, and we changed the name quite late when we found out a project of the same name exists.

There are generation commands you can find in package.json to generate some of the public/private key pairs needed.

- `npx prisma generate` to generate Typescript types and code
- `npx prisma migrate dev` to update the db
- `npm run build` to build the production version of the application into the .next folder
- `npm run start` to start
