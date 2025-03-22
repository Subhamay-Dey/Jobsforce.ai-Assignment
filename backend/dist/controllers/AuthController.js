import { registerSchema } from "../validations/registerValidation.js";
class AuthController {
    static async login(req, res) {
        try {
            const body = req.body;
            const payload = registerSchema.parse(body);
            res.json({ message: "User registered successfully", data: payload });
        }
        catch (error) {
            res.status(400).json({ message: error });
        }
    }
}
export default AuthController;
