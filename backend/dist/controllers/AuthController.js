import prisma from "../config/prisma.config.js";
import jwt from "jsonwebtoken";
export default class AuthController {
    static async login(req, res) {
        try {
            const body = req.body;
            let findUser = await prisma.user.findUnique({
                where: {
                    email: body.email,
                }
            });
            if (!findUser) {
                findUser = await prisma.user.create({
                    data: {
                        name: body.name,
                        email: body.email,
                        provider: body.provider,
                        oauth_id: body.oauth_id
                    }
                });
            }
            let JWTPayload = {
                name: body.name,
                email: body.email,
                id: findUser.id
            };
            const token = jwt.sign(JWTPayload, process.env.JWT_SECRET, {
                expiresIn: "365d"
            });
            return res.json({
                message: 'Logged in successfully',
                user: {
                    ...findUser,
                    token: `Bearer ${token}`
                }
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Something went wrong, please try again!" });
        }
    }
}
