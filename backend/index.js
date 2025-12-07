const express = require("express");
const cors = require("cors");
const rootRouter  = require("./routes/index");
const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router(); 

app.use("/api/v1" , rootRouter )

app.get("/", (req, res) => {
  res.send("Welcome to the paytm like wallet app!!");
});

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const field = Object.keys(err.errors)[0];

        return res.status(400).json({
            message: `Validation Error for ${field}: ${errors[0]}`
        });
    }

    console.error(err.stack); 
    res.status(500).json({
        message: "An unexpected error occurred.",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

