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

async function getProducts(offset = 0, limit = 10, search = "") {
    try {
      const searchText = `%${search}%`;
  const [results] = await connection.query(
    "SELECT * FROM products WHERE ptitle LIKE ? LIMIT ?, ?",
    [searchText, offset, limit]
  );

//   console.log("RESULTS", results); // results contains rows returned by server
//   console.log("FIELDS", fields); // fields contains extra meta data about results, if available
return results
} catch (err) {
  console.log(err);
return []
}
    
}

async function getProductsCount(search = "") {
  try {
    const searchText = `%${search}%`

    const [results] = await connection.query (
      "SELECT COUNT(*) AS total FROM products WHERE ptitle LIKE ?",
      [searchText]
    );

    return results[0].total;
  } catch (err) {
    console.log(err);
    return 0;
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
    });
});

app.get("/products", async(req,res) => {
    
   const offset = Number(req.query.offset) || 0;
   const limit = Number(req.query.limit) || 10;
   const search = req.query.search || "";
   
   const products = await getProducts(offset, limit, search);
   const total = await getProductsCount(search);

    res.json({
      products,
      total,
      offset,
      limit
})
})


app.listen(4000, () => {
    console.log("The app is running on port number 4000")
})