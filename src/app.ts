import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import clientRoutes from "./routes/client.routes.js";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base route for health check
app.get("/", (req, res) => {
    res.json({ 
        message: "✅ Sportline API is running successfully",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth (POST /register, /login, /refresh)",
            products: "/api/products (GET, POST, PUT /:id, DELETE /:id)",
            clients: "/api/clients (GET, POST, PUT /:id, DELETE /:id)"
        }
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/clients", clientRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: "Endpoint not found",
        message: "Please check the API documentation for available endpoints"
    });
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
    });
});

// Database connection and server startup
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log("📊 Database connection established successfully.");
        
        // Sync database (use { force: true } only in development to reset tables)
        await sequelize.sync({ alter: true });
        console.log("🔄 Database synchronized.");
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation available at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Unable to start server:", error);
        process.exit(1);
    }
};

startServer();
