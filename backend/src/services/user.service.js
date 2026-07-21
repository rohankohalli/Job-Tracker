export async function register(userData) {
    const { name, email, mobileNo, password } = userData
    const existing = await Users.findOne({ where: { email } })
    if (existing) return { error: "Email already in use" }

    const hashedPass = await bcrypt.hash(password, 10);

    const User = await Users.create({
        name,
        email,
        dateOfBirth,
        mobileNo,
        password: hashedPass,
    })

    return {
        id: user.id,
        message: "User registered successfully"
    }
}