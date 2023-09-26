import { Verification } from '../models/emailVerification.js'
import {User} from '../models/userModel.js';
import { compareString } from '../utils/index.js';

export const verifyEmail = async (req, res) => {
    const {userId, token} = req.params;
    try {
        const result = await Verification.findOne({userId});
        if (result) {
            const {token: hashedToken, expiresAt} = result;
            if(expiresAt < Date.now()) {
                Verification.findOneAndDelete({userId})
                .then(() => {
                    User.findOneAndDelete({_id: userId})
                    .then(() => {
                        const message = "Verification Token has expired.";
                        res.redirect(`/users/verified?status=error&message=${message}`);
                    })
                    .catch((err) => {
                        res.redirect(`/users/verified?status=error&message=`);
                    })
                })
                .catch((error)=>{
                    console.log(error);
                    res.redirect(`/users/verified?message=`);
                })
            } 
            else{ 
                compareString(token, hashedToken)
                .then((isMatch)=>{
                    if(isMatch){
                        User.findOneAndUpdate({_id: userId}, {verified: true})
                        .then(() => {
                            Verification.findOneAndDelete({userId})
                            .then(() => {
                                const message = "Your account has been verified successfully.";
                                res.redirect(`/users/verified?status=success&message=${message}`); 
                            })
                        }) 
                        .catch((error) => {
                            console.log(error);
                            const message = "Verification failed or link expired. Please try again.";
                            res.redirect(`/users/verified?.status=error&message=${message}`)
                        })
                    }else{
                        //invalid token 
                        const message = "Verification failed or link expired. Please try again.";
                        res.redirect(`/users/verified?status=error&message=${message}`)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    res.redirect(`/users/verified?message=`)
                })
            }
        }else{
            const message = "Verification failed or link expired. Please try again.";
            res.redirect(`/users/verified?status=error&message=${message}`)
        }
    }catch (error) {
        console.log(error.message);
        res.redirect(`/users/verified?message=`)
    }
}