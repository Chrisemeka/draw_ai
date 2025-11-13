import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { getGoogleAuthURL, getGoogleUserInfo } from '../utils/googleAuth';

 dotenv.config();

 const generateAccessToken = (user: any) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            name: user.name
        }, 
        process.env.JWT_SECRET!, 
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};

const storeRefreshToken = async (userId: string, refreshToken: string) => {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash: hashedToken,
            expiresAt
        }
    });
};

const cleanExpiredTokens = async (userId: string) => {
    await prisma.refreshToken.deleteMany({
        where: {
            userId,
            OR: [
                { expiresAt: { lt: new Date() } },
                { revoked: true }
            ]
        }
    });
};

export class AuthController {
    static googleAuth = async (req: Request, res: Response) => {
        try {
            const authUrl = getGoogleAuthURL();
            console.log('Google auth URL generated successfully')
            return res.redirect(authUrl);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error. Cannot generate Google auth URL' });
        }
    }

    static googleCallback = async (req: Request, res: Response) => {
        try {
            const { code } = req.query;
            
            if (!code) {
                return res.status(400).json({ message: 'Authorization code is required' });
            }

            const googleUserInfo = await getGoogleUserInfo(code as string);
            
            if (!googleUserInfo.email) {
                return res.status(400).json({ message: 'Failed to get user email from Google' });
            }

            let user = await prisma.user.findUnique({ 
                where: { email: googleUserInfo.email } 
            });

            if (user) {
                if (!user.googleId) {
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: { 
                            googleId: googleUserInfo.id!,
                            emailVerified: googleUserInfo.verified_email || true,
                            profileImage: googleUserInfo.picture || user.profileImage
                        }
                    });
                }
            } else {
                user = await prisma.user.create({
                    data: {
                        name: googleUserInfo.name || 'Google User',
                        email: googleUserInfo.email,
                        googleId: googleUserInfo.id!,
                        emailVerified: googleUserInfo.verified_email || true,
                        profileImage: googleUserInfo.picture,
                    }
                });
            }

            await cleanExpiredTokens(user.id);

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken();
            
            await storeRefreshToken(user.id, refreshToken);

            const userData = encodeURIComponent(JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.name,
                profilePictureUrl: user.profileImage
            }));
            console.log('CLIENT_URL:', process.env.CLIENT_URL);
            const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}&refresh=${refreshToken}&user=${userData}`;
            console.log('Redirecting to:', redirectUrl); 
            return res.redirect(redirectUrl);

        } catch (error) {
            console.error(error);
            return res.redirect(`${process.env.CLIENT_URL}/auth/error`);
        }
    }

    static refreshToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            const storedTokens = await prisma.refreshToken.findMany({
                where: {
                    expiresAt: { gt: new Date() },
                    revoked: false
                },
                include: {
                    user: true
                }
            });

            let validToken = null;
            let matchedUser = null;

            for (const token of storedTokens) {
                const isValid = await bcrypt.compare(refreshToken, token.tokenHash);
                if (isValid) {
                    validToken = token;
                    matchedUser = token.user;
                    break;
                }
            }

            if (!validToken || !matchedUser) {
                return res.status(401).json({ message: 'Invalid or expired refresh token' });
            }

            await prisma.refreshToken.update({
                where: { id: validToken.id },
                data: { lastUsed: new Date() }
            });

            const newAccessToken = generateAccessToken(matchedUser);

            return res.status(200).json({
                status: 'success',
                message: 'Token refreshed successfully',
                accessToken: newAccessToken
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static logout = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            
            if (refreshToken) {
                const storedTokens = await prisma.refreshToken.findMany({
                    where: { revoked: false }
                });

                for (const token of storedTokens) {
                    const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
                    if (isMatch) {
                        await prisma.refreshToken.update({
                            where: { id: token.id },
                            data: { revoked: true }
                        });
                        break;
                    }
                }
            }

            return res.status(200).json({ status: 'success', message: 'Logged out successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}