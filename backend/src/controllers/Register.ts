import {Request, Response} from "express";
import { registerSchema } from "../validations/registerValidation.js";

class RegisterController {

    static async register(req: Request, res: Response){
        try {
            const body = req.body;
            const payload = registerSchema.parse(body);
            res.json({message: "User registered successfully", data: payload});
        } catch (error) {
            res.status(400).json({message: error});
        }
    }
}

export default RegisterController