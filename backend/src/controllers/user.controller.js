import * as userService from '../services/user.service.js'

const setRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export async function register(req, res, next) {
    try {
        const result = await userService.register(req.body)

        if (result.error) {
            return res.status(400).json({ error: result.error })
        }

        setRefreshTokenCookie(res, result.refreshToken)
        delete result.refreshToken

        return res.status(201).json(result)
    } catch (err) {
        next(err)
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const result = await userService.login(email, password)

        if (result.error) {
            return res.status(401).json({ error: result.error })
        }

        setRefreshTokenCookie(res, result.refreshToken)
        delete result.refreshToken

        return res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

export async function refreshToken(req, res, next) {
    try {
        const token = req.cookies.refreshToken
        const result = await userService.refreshTokenService(token)

        if (result.error) {
            return res.status(result.status || 401).json({ error: result.error })
        }

        setRefreshTokenCookie(res, result.refreshToken)
        delete result.refreshToken

        return res.status(200).json(result)
    } catch (err) {
        next(err)
    }
}

export async function logout(req, res, next) {
    try {
        res.clearCookie('refreshToken')
        return res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
        next(err)
    }
}