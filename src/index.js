import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT || 3000}`);
        app.on("error",(error)=>{
            console.log("Error: ", error);
            throw error;
        })
    })
    
})
.catch((error)=>{
    console.log("Mongodb connection failed !!!", error);
})





















