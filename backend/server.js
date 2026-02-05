import dotenv from "dotenv";
import app from "./app.js";
import connetDB from "./config/db.js";

dotenv.config();

// database connection
connetDB();

//health test
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
