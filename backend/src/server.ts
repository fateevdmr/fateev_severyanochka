import express, { Request, Response } from "express";
import cors from "cors";
import { products } from "./products";
import path from "path";

const PORT = 5004;
const API_PREFIX = "/api";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get(`${API_PREFIX}/products`, (_req: Request, res: Response) => {
  res.json(products);
});

app.get(`${API_PREFIX}/products/:id`, (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ 
      message: `Product with ID ${productId} not found` 
    });
  }

  res.json(product);
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
