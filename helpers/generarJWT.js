import jwt from 'jsonwebtoken'

const generarJWT = (id) => {
    // sign crear el token y verify lo lee
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    })
}



export default generarJWT;

