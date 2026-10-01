import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import authMiddleware from "./authmiddleware.js";
import { Pool } from "pg";

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_ea9rwgxOvsX2@ep-small-hill-aqb1tnkj-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (result.rows.length > 0) {
    return res.status(403).json({
      message: "User already exist"
    });
  }

  await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
    [username, password]
  );

  res.json({
    message: "User created!"
  });
});

app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    [username, password]
  );

  if (result.rows.length === 0) {
    return res.status(403).json({
      message: "Incorrect username or password"
    });
  }

  const user = result.rows[0];

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    "secreatkey"
  );

  res.json({
    token
  });
});

app.post("/todos", authMiddleware, async (req, res) => {
  try {
    const todo = req.body.todo;
    const username = req.username;

    await pool.query(
      "INSERT INTO todo (username, todo) VALUES ($1, $2)",
      [username, todo]
    );

    res.json({ message: "Todo added" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Todo not added" });
  }
});

app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const username = req.username;

    const result = await pool.query(
      "SELECT * FROM todo WHERE username = $1",
      [username]
    );

    res.json({ todos: result.rows });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error loading todos" });
  }
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});