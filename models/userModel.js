import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        // id: {
        //     type: String
        // },
        email: { 
            type: String
        },
        password: {
            type: String
        },
        likedCourses: {
            type: [String],
            default: []
        },
        cart: {
            type: [String],
            default: []
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        name: {
            type: String
        },
        profile: {
            type: String
        },
        isAdmin: {
            type: Boolean
        }

    }
)
const Users = mongoose.model('Users', userSchema)
export default Users;