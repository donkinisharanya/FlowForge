import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { loginUser, registerUser } from "./auth.service";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";

export async function register(req: Request, res: Response) {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid request data",
      errors: validation.error.flatten(),
    });
    return;
  }

  try {
    const user = await registerUser(validation.data);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User with this email already exists"
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function login(req: Request, res: Response) {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: "Invalid request data",
      errors: validation.error.flatten(),
    });
    return;
  }

  try {
    const loginResult = await loginUser(validation.data);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...loginResult,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function me(req: AuthenticatedRequest, res: Response) {
  res.status(200).json({
    success: true,
    user: {
      id: req.userId,
      email: req.userEmail,
    },
  });
}
