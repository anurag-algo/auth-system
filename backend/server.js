import dontenv from "dotenv";
import express from "express";
dontenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("API is running....");
});
app.listen(
  process.env.PORT || 5000,
  console.log("Server is running on port 5000"),
);
