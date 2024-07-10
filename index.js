import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

const db=new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Permalist',
  password: 'Varshap*12345',
  port: 5432,
})

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Vaaste" },
  { id: 2, title: "Chaleya" },
];

app.get("/", async (req, res) => {
  try{
    const result=await db.query("SELECT * FROM items ORDER BY id ASC");
    items=result.rows;

    res.render("index.ejs",{listTitle:"My Favourites",listItems:items})
  }catch(err){
    console.error(err);
  }
  
});

app.post("/add",async (req, res) => {
  // items.push({ title: item });
  const item=req.body.newItem;
  try{
    await db.query("INSERT INTO items(title) VALUES($1)",[item]);
    res.redirect("/");
  }catch(err){
    console.error(err);
  }

});

app.post("/edit",async (req, res) => {
  const item =req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  try{
    await db.query("UPDATE items SET title=($1) WHERE id=($2)",[item, id]);
    res.redirect("/");

  }catch(err){
    console.error(err);
  }
});

app.post("/delete",async (req, res) => {
  const delItemId=req.body.deleteItemId;
  try{
  await db.query("DELETE FROM items WHERE id=($1)",[delItemId]);
  res.redirect("/");
  }catch(err){
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
