import { Router } from 'express'
import * as userController from '../controllers/user.controller.js'
import { registerRules, loginRules } from '../validators/users.validator.js'

const router = Router()

router.post('/register', registerRules, userController.register)

router.post('/login', loginRules, userController.login)

router.post('/refresh', userController.refreshToken)

router.post('/logout', userController.logout)

export default router
