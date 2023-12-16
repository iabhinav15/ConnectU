import { Verification } from '../models/emailVerification.js';

export const deleteVerification = async (req, res) => {
    try {
        const deleteCount = await Verification.deleteMany({ expiresAt: { $lt: Date.now() } });

        res.status(200).json({
            message: 'Deleted all expired verification docs from DB',
            deleteCount
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}