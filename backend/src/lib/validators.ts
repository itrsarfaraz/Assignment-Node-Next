import { IsEmail, IsString, MinLength, IsNumber, IsPositive, IsEnum } from "class-validator";
import { RoleType } from "../entities/Role";

export class RegisterDTO {
    @IsString()
    @MinLength(3)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(RoleType)
    role: RoleType;
}

export class LoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class CreateProductDTO {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    stock: number;
}

export class CreateOrderDTO {
    @IsNumber()
    @IsPositive()
    productId: number;

    @IsNumber()
    @IsPositive()
    quantity: number;
}
