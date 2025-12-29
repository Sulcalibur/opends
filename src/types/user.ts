/**
 * User-related TypeScript types
 * Corresponds to the `users` table in the database
 */

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer'
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    failedLoginAttempts: number;
    lockedUntil?: Date;
}

export interface CreateUserDto {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
}

export interface UpdateUserDto {
    name?: string;
    avatarUrl?: string;
    role?: UserRole;
    isActive?: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    createdAt: Date;
    lastLoginAt?: Date;
}

export interface UpdateProfileDto {
    name?: string;
    avatarUrl?: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export type UserWithoutPassword = Omit<User, 'failedLoginAttempts' | 'lockedUntil'>;
