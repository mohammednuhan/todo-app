// const express = require ("express")
const jwt = require ("jsonwebtoken")
const { authMiddleware } = require("./middleware.js")

const { Pool } = require ("pg");

const pool = new Pool ({
    connectionString : "postgresql://neondb_owner:npg_r4lHfFq8husR@ep-twilight-wave-aqtcfqum-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const app = express()

app.use(express.json())

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = await pool.query("SELECT * FROM users WHERE username = $1,$2" [username,password])

    if(result.rows.length > 0) {
        return res.status(403).json({
            message: "User already exist"
        })
    }

    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id", [username, password]);


    res.json({
        message: "User created!"
    })
})

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const result = await pool.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password])

    if(result.rows.length = 0) {
        res.status(403).json({
            message: "Incorrect username or password"
        })
        return
    }

    const token = jwt.sign({
        username
    }, "secreat")

    res.json({
        token
    })
})

app.post("/todo", authMiddleware,async (req, res) => {
    const username = req.username;
    const todo = req.body.todo;

    await pool.query ("INSERT INTO todo (username,todo) VALUES ($1,$2)",[username,todo])

   
    res.json({
        message: "todo added!"
    })
})

app.get("/todo", authMiddleware, async (req, res) => {
    const username = req.username;
    
    const result = await pool.query("SELECT * FROM todo WHERE username = $1", [username])

    res.json({
        todo: result.rows
    })
})

app.listen(3000);