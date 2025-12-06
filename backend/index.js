const express = require("express");
const  jwt = require(" jsonwebtoken");
const cors = require("cors");
const rootRouter  = require("./routes/index");
const { authMiddleware } = require("./middleware");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1" , rootRouter )

app.get("/", (req, res) => {
  res.send("Hello from Node + Express!");
});

app.listen(3000);
