import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from '../middleware/token.js'
import User from '../models/User.model.js'

export async function register(userData) {
    const { name, email, mobileNo, password } = userData
    const existing = await User.findOne({ where: { email } })
    if (existing) return { error: "Email already in use" }

    const hashedPass = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        name,
        email,
        mobileNo,
        password: hashedPass,
    })

    const accessToken = generateAccessToken(newUser)
    const refreshToken = generateRefreshToken(newUser, true)

    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        accessToken,
        refreshToken,
        message: 'User registered successfully',
    }
}

export async function login(email, password) {
    const user = await User.findOne({ where: { email } })
    if (!user) return { error: "Invalid email or password" }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return { error: "Invalid email or password" }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user, true)

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
        message: "Login successful"
    }
}

export async function refreshTokenService(token) {
    if (!token) return { error: "No refresh token provided", status: 401 }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        const user = await User.findByPk(decoded.id)
        if (!user) return { error: "Invalid refresh token", status: 401 }

        const accessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user, true)

        return {
            accessToken,
            refreshToken: newRefreshToken
        }
    } catch (err) {
        return { error: "Invalid or expired refresh token", status: 403 }
    }
}