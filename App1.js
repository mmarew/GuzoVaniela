import Express from "express";
let app = Express();
app.listen(1010, (err) => {
  if (err) console.log(err);
  else console.log("connected well");
});
app.get("/", (req, res) => {
  res.end("<h1>connected at 1010</h1>");
});
