import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import { sendEmail } from "./mails/mail.js";
const app = express();
const PORT = process.env.PORT || 7000;
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
app.get("/", async (req, res) => {
    const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, { name: "Subhamay Dey" });
    await sendEmail("ncdey1966@gmail.com", "Testing", html);
    res.json({ message: "Email sent successfully" });
});
// // Queues
import "./bull/jobs/index.js";
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
