import * as userService from '../services/user.service.js'

export async function register(req, res, next) {
    try {
        const result = await userService.register(req.body)

        return res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}