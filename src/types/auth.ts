/**
 * Authentication-related TypeScript types
 */

import type { UserRole } from './user';

export interface LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterDto {
    email: string;
    name: string;
    password: string;
    passwordConfirm: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        avatarUrl?: string;
    };
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
    passwordConfirm: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface Session {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    ipAddress?: string;
    userAgent?: string;
}

export interface OAuthProvider {
    id: string;
    userId: string;
    provider: 'google' | 'github' | 'gitlab';
    providerUserId: string;
    accessToken?: string;
    refreshToken?: string;
    tokenExpiresAt?: Date;
    profileData?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface OAuthCallbackDto {
    code: string;
    state?: string;
}

export interface Invitation {
    id: string;
    email: string;
    role: UserRole;
    invitedBy?: string;
    token: string;
    expiresAt: Date;
    acceptedAt?: Date;
    createdAt: Date;
}

export interface CreateInvitationDto {
    email: string;
    role: UserRole;
}

export interface AcceptInvitationDto {
    token: string;
    name: string;
    password: string;
    passwordConfirm: string;
}
