import express, {Application, Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import {fileURLToPath} from "url"


const app:Application = express();

const PORT = process.env.PORT || 7000;

app.use(cors({origin: "*", credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.get("/", (req: Request, res: Response) => {
    res.render("welcome");
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));