import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Role, RoleType } from "../entities/Role";
import { RegisterDTO, LoginDTO } from "../lib/validators";
import { validate } from "class-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);
    private roleRepository = AppDataSource.getRepository(Role);

    public register = async (req: Request, res: Response) => {
        try {
            const registerDto = new RegisterDTO();
            Object.assign(registerDto, req.body);

            const errors = await validate(registerDto);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const existingUser = await this.userRepository.findOne({
                where: { email: registerDto.email }
            });

            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const role = await this.roleRepository.findOne({
                where: { name: registerDto.role || RoleType.USER }
            });

            if (!role) {
                return res.status(400).json({ message: "Invalid role" });
            }

            const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const user = this.userRepository.create({
                username: registerDto.username,
                email: registerDto.email,
                password: hashedPassword,
                role
            });

            await this.userRepository.save(user);
            return res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    };

    public login = async (req: Request, res: Response) => {
        try {
            const loginDto = new LoginDTO();
            Object.assign(loginDto, req.body);

            const errors = await validate(loginDto);
            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const user = await this.userRepository.findOne({
                where: { email: loginDto.email },
                relations: ["role"]
            });

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials 1" });
            }

            const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials 2" });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role.name
                }
            });
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
        }
    };
}
