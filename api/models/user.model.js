import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,

    },
    avatar: {
        type: String,
        default: "https://www.bing.com/th?id=OIP.UahRrl99Crt1ybciDDN-pAHaHx&w=150&h=157&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2://www.bing.com/images/search?q=profile+icon+for+website&id=94002B2B27577511EBF1BA5D788B9114358003A6&FORM=IQFRBA",
    }
}, {timestamps: true});

const User = mongoose.model('User',userSchema);
export default User;