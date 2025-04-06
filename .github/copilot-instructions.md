When adding comments, start with a lowercase letter and don't use a period. Make it casual.

The tech stack is Nuxt, TypeScript, Tailwind, Prisma+PostgreSQL, and TRPC. It's hosted in a container on Dreamhost.

The data/ folder contains a bunch of tasks that run outside of the website to populate the database. The database only contains information from these tasks.

The front-end accesses this data from the APIs in server/api and server/trpc.

Prefer conciseness throughout, including shorter variable names.
