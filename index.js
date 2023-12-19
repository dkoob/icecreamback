const pg = require('pg')
const client = new pg.Client('postgres://localhost/icecreamdb')
const express = require('express')
const app = express()
const cors =require('cors')

app.use(cors())
app.get('/', (req, res, next) => {
    res.send("Hello world")
})

//GET all food
app.get('/api/icecream', async (req,res,next) => {
    try {
        const SQL = `
        SELECT * FROM icecream;
        `
        console.log("in db")
    
        const response = await client.query(SQL)
        //res.status(202)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

//GET one food
app.get('/api/icecream/:id' , async (req,res,next) => {
    try {
        console.log(req.params.id)

        const SQL = `
        SELECT * from icecream WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        
        if(!response.rows.length){
            next({
                name: "id error",
                message: `icecream with id ${req.params.id} not found`
            })
        }else{

            res.send(response.rows[0])
        }

    } catch (error) {
        next(error)
    }

})

//DELETE a food
app.delete('/api/icecream/:id', async (req,res, next) => {
    try {
        const SQL = `
        DELETE FROM icecream WHERE id=$1
        `
        const response = await client.query(SQL, [req.params.id])
        console.log(response)
        res.sendStatus(204)
        
    } catch (error) {
        next(error)
    }
})

//Error handler
app.use((error,req,res,next) => {
    res.status(500)
    res.send(error)
})

app.use('*', (req,res,next) => {
    res.send("No such route exists")
})


const start = async () => {
    await client.connect()
    console.log("connected to db!")

    const SQL = `
    DROP TABLE IF EXISTS icecream;
    CREATE TABLE icecream(
        id SERIAL PRIMARY KEY,
        name VARCHAR(25)
    );

    INSERT INTO icecream(name) VALUES ('vanilla');
    INSERT INTO icecream(name) VALUES ('chocolate');
    INSERT INTO icecream(name) VALUES ('mint');
    INSERT INTO icecream(name) VALUES ('cookie dough');
    INSERT INTO icecream(name) VALUES ('coffee');
    `
    await client.query(SQL)
    console.log("table created and seeded")

    const port = 3000
    

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })


}

start()