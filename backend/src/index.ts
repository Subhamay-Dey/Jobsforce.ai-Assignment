import express, {Application, Request, Response} from "express";
import cors from "cors";
import "dotenv/config";

const app:Application = express();

const PORT = process.env.PORT || 7000;

app.use(cors({origin: "*", credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running...🙌")
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));