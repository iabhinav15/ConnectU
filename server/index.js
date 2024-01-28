import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv"; 
import morgan from "morgan";
import path from "path";
//security packages
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./routes/index.js";


// const __dirname = path.resolve(path.dirname(''));

dotenv.config();
const app = express();

app.use(cors(
    {origin: process.env.APP_URL, credentials: true}
));
// app.use(express.static(path.join(__dirname, 'views/build')));

const PORT = process.env.PORT || 8800;
dbConnection();


app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));

app.use(morgan("dev"));
app.use(router);
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
