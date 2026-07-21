import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
    )
}

export const generateRefreshToken = (user, remember) => {
    return jwt.sign(
        { id: user.id, remember },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: remember ? (process.env.REFRESH_TOKEN_EXPIRES_IN_MORE || "30d")
                : (process.env.REFRESH_TOKEN_EXPIRES_IN || "7d")
        }
    )
}
