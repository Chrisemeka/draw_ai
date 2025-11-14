import express, { Express, Response, Request, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth";
import sceneRoute from "./routes/scenes";


dotenv.config();
const app: Express = express();

const port = process.env.PORT!;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use('/auth', authRoute);
app.use('/api/scenes', sceneRoute);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})