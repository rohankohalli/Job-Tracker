export async function register(req, res, next) {
    try {
        const { name, email, mobileNo, password } = req.body;
        const existing = await Users.findOne({ where: { email } })
        if (existing) return res.status(409).json({ message: "Email already in use" })

        const hashed = await bcrypt.hash(password, 10);
        await Users.create({
            name,
            email,
            dateOfBirth,
            mobileNo,
            password: hashed,
        })

        res.status(201).json({ message: "User registered successfully" })
    } catch (err) {
        next(err)
    }
}