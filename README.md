<div align="center">
<img src="frontend/src/assets/logo.png" width="200px" />
</div>

# <div align="center">ITrialto</div>

This is a web platform developed as part of a university course on IT projects. The system is designed to facilitate interaction between university partners and students for the purpose of implementing commercial projects. At the moment, this project is complete, even though it is not perfect and has some bugs in the UI.

The project includes:

- Team creation and management (add/remove members, join a team, edit team data);

- User profiles, including personal technology stacks;

- Registration and login with JWT protection;

- Role system: student, partner, or teacher;

- Project creation;

- Moderation of applications for creating projects or teams;

- Interaction between projects and teams (teams submit applications to participate, and the project author selects one team from those proposed);

- Real-time notifications via WebSocket;

- Private and group chats via WebSocket.

Since there is no point in describing the entire essence of the project (obviously, it would take an entire essay), I decided to at least insert a visualization of the database schema. All entities and the relationships between them are described here:

<div align="center">
<img src="frontend/public/Untitled (1).png" />
</div>

## Technologies

- [![Static Badge](https://img.shields.io/badge/TypeScript-red?style=for-the-badge&logo=typescript&logoColor=3178C6&color=%23000000)](https://www.typescriptlang.org/)
  
- [![Static Badge](https://img.shields.io/badge/Vue%20JS-red?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D&color=%2349524c)](https://vuejs.org/)
  
- [![Static Badge](https://img.shields.io/badge/quasar-red?style=for-the-badge&logo=quasar&logoColor=%23050A14&color=white)](https://quasar.dev/)
  
- [![Static Badge](https://img.shields.io/badge/nest%20js-red?style=for-the-badge&logo=nestjs&logoColor=%23E0234E&color=black)](https://nestjs.com/)
  
- [![Static Badge](https://img.shields.io/badge/typeorm-red?style=for-the-badge&logo=typeorm&logoColor=%23FE0803&color=%23f5edf0)](https://typeorm.io/)
  
- [![Static Badge](https://img.shields.io/badge/postgresql-red?style=for-the-badge&logo=postgresql&logoColor=%234169E1&color=%23f2f0ff)](https://www.postgresql.org/)

---

# 🚀 Installing and running the ITrialto project

## 1️⃣ Installing dependencies

1. Install **Node.js LTS**
   [📥 Download Node.js](https://nodejs.org/en/download)
2. Restart your PC and check the installation:

   ```bash
   node --version
   ```
3. Clone the repository:

```bash
   git clone https://github.com/Hitoshi144/ITrialto.git
   ```
4. Go to the project folder:

```bash
   cd ITrialto
   ```


## 2️⃣ Backend configuration

1. Go to the **backend** directory:

```bash
   cd backend
   ```
2. Install dependencies:

```bash
   npm install
   ```

⚠ If you encounter an access error, run the terminal **as an administrator** and execute:

```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```


## 3️⃣ Installing and configuring PostgreSQL via Docker

1. Install **Docker**:
   [📥 Download Docker](https://www.docker.com/)
2. Run the PostgreSQL container:

```bash
   docker run -d --name vm_postgres \
     -e POSTGRES_DB=vm_db \
     -e POSTGRES_USER=vm_user \
     -e POSTGRES_PASSWORD=vm_password \
     -p 5432:5432 \
     postgres
   ```

> You can enter your own parameters for creating a container, but keep in mind that they will need to be entered into the environment file.


## 4️⃣ Environment configuration

Create a file **`ITrialto/backend/.env`** with the following content:

```env
JWT_SECRET=jfdqnklqegjwklgjkfdhsalkjfhqkjehfqbbfqwjhkvbcasjkhdvbasjk

DB_HOST=‘localhost’
DB_PORT=5432
DB_USERNAME=‘vm_user’
DB_PASSWORD=‘vm_password’
DB_NAME=‘vm_db’
```

> `JWT_SECRET` can be any set of characters.

---

## 5️⃣ Starting the backend

In the **backend** directory, run:

```bash
npm run start:dev
```

If there are no errors, everything went well ✅


## 6️⃣ Configuring the frontend

1. In the **`frontend/src/api/axios.api.ts`** file, replace:

```ts
baseURL: 'http://localhost:3001'
```

2. In the **`frontend/src/api/socket.api.ts`** file, replace:

```ts
this.socket = io('http://localhost:3001/ws')
```


## 7️⃣ Launching the frontend

1. Open a second terminal.
2. Go to the **frontend** directory:

```bash
   cd ITrialto/frontend
   ```
3. Install dependencies:

```bash
   npm install
   ```
4. launch frontend:

```bash
npm run dev
```

---

## 🎉 Done!

Now you can open the project in your browser and start exploring it 🚀


At this point, the project is complete, but it has potential for further refinement and development.
