## About

NestJS API with protected routes, user authentification and car reports entities.

### Technical Stack

- **NestJS:** A progressive Node.js framework for building efficient, scalable, and maintainable server-side applications with TypeScript support.

- **TypeScript:** A strongly-typed programming language that builds on JavaScript, adding static typing and enhanced development tools.

- **SQLite3:** A lightweight, serverless, self-contained SQL database engine commonly used for embedded applications, prototyping, and local storage.

- **Docker (+Docker Compose):** A platform for containerizing applications, enabling consistent environments, with Docker Compose simplifying multi-container setups.

- **Jest:** A JavaScript testing framework focused on simplicity, with powerful features for unit, integration, and snapshot testing.

## Run app

Install packages:

```bash
npm install
```

Create and fill up `.env` file with the variables provided in `.env.example`:

```bash
DB_NAME=db.sqlite
```

Generate migrations:

```bash
npm run migration:generate
```

Now, run the application:

```bash
npm run start:dev
```

## API Endpoints

| Route                | Method | Description                             | Authentication    |
| -------------------- | ------ | --------------------------------------- | ----------------- |
| /auth/me             | GET    | Gets user profile info                  | Yes               |
| /auth/signin         | POST   | Gets user info, writes userId in cookie | No                |
| /auth/signup         | POST   | Creates a new user                      | No                |
| /auth/signout        | POST   | Writes userId in cookie                 | No                |
| /users               | GET    | Gets all users                          | No                |
| /users/:id           | GET    | Gets user by the `id`                   | No                |
| /users/by            | GET    | Gets user by the user table fields      | No                |
| /users/:id           | PATCH  | Updates user                            | No                |
| /users/:id           | DELETE | Deletes user                            | No                |
| /reports             | POST   | Creates report                          | No                |
| /reports/estimate    | DELETE | Gets all reports estimate by filters    | Yes               |
| /reports/approve/:id | DELETE | Changes reports' `approved` field       | Yes (admins only) |
