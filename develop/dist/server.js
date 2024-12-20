import express from 'express';
import db from './config/connection.js';
import router from './routes/index.js';
// const server = process.cwd();
await db();
const PORT = 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);
app.listen(PORT, () => {
    console.log(`API server is running on port ${PORT}`);
});
