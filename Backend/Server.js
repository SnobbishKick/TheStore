const express = require('express');
const cors = require('cors');
const connectDB = require("./Config/db");

const productrouter = require("./Router/productRoutes");
const userrouter = require("./Router/userRoutes");
const adminrouter = require("../Backend/Router/adminRoutes");



const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true,
    methods:"GET,POST,PATCH,PUT,DELETE"
}));

const port = 5550

connectDB();

// const corseOptions = {
//     origin: '*',
//     methods : 'GET,HEAD,PUT,PATCH,POST,DELETE'
// };
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
// app.use(cors(corseOptions))

app.use("/api/products",productrouter)
app.use('/api/users',userrouter)
app.use('/api/admin',adminrouter)

app.listen(port,()=>{
    console.log('Server connect at '+port);
})