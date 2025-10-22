import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Charge env
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// base route for test
app.get("/", (req, res) => {
    res.json({ message: "✅ Server is running successfully" });
});

// port in env or default
const PORT = process.env.PORT || 4000;

// up server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
