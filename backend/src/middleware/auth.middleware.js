import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = verified
        next()
    } catch (err) {
        // Return 401 for both invalid and expired tokens so the client interceptor can refresh
        return res.status(401).json({ error: 'Invalid or expired token.' })
    }
}
