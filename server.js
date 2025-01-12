const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// WebSocket setup
const WebSocket = require('ws');

// Create a database connection
mongoose
  .connect("mongodb+srv://kithmini:Kithmini123456@cluster0.zb03n.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true }); // The WebSocket server runs on the same HTTP server

// Handle WebSocket connection
wss.on('connection', (ws) => {
  console.log('A new WebSocket client connected');

  // Send a message to the client
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

  // Handle messages from the client
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(JSON.stringify({ message: `Server received: ${message}` }));
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('A WebSocket client disconnected');
  });
});

// Handle HTTP request and WebSocket upgrade
app.server = app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});

// Upgrade HTTP server to handle WebSocket connections
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// CORS and Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust to the front-end app URL
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);
