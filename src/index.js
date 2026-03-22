import express from "express"
import cors from "cors"
import mysql from 'mysql2/promise';

const app = express()

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "nodeappdemo_db",
  port: 3306
});

async function getProducts(offset = 0, limit = 10) {
    try {
  const [results, fields] = await connection.query(
    `SELECT * FROM products LIMIT ${offset}, ${limit}`
  );

//   console.log("RESULTS", results); // results contains rows returned by server
//   console.log("FIELDS", fields); // fields contains extra meta data about results, if available
return results
} catch (err) {
  console.log(err);
return []
}
    
}

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.get("/", (req, res)=>{
    res.json({
        message:"The app is running"
    })
})

app.get("/me", (req, res)=>{
    res.json({
        id:"acbaxj",
        name: "Bidisha Kashyap"
    })
})


app.get("/products", async(req,res) => {
   const query =  req.query
   const products = await getProducts(query.offset, query.limit)
    res.json(products)
})


app.listen(4000, () => {
    console.log("The app is running on port number 4000")
})