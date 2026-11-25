import mongoose from "mongoose";
import { DB_URI } from "../config/config.service.js";

const connectionDB = async () => {
    await mongoose.connect(DB_URI).then(() => {
        console.log("DB conncted successfully");
    }).catch((err:any)=>{
        console.log("failed to connet DB");
    })
};
export default connectionDB