/**
 * Design Token TypeScript types
 * For managing design tokens (colors, typography, spacing, etc.)
 */

export type TokenCategory =
    | 'color'
    | 'typography'
    | 'spacing'
    | 'border'
    | 'shadow'
    | 'animation'
    | 'breakpoint'
    | 'other';

export interface DesignToken {
    id: string;
    name: string;
    category: TokenCategory;
    value: TokenValue;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

export type TokenValue =
    | ColorTokenValue
    | TypographyTokenValue
    | SpacingTokenValue
    | BorderTokenValue
    | ShadowTokenValue
    | AnimationTokenValue
    | string
    | number;

export interface ColorTokenValue {
    hex?: string;
    rgb?: { r: number; g: number; b: number };
    hsl?: { h: number; s: number; l: number };
    alpha?: number;
}

export interface TypographyTokenValue {
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: string | number;
    lineHeight?: string | number;
    letterSpacing?: string | number;
}

export interface SpacingTokenValue {
    value: string | number;
    unit?: 'px' | 'rem' | 'em' | '%';
}

export interface BorderTokenValue {
    width?: string | number;
    style?: 'solid' | 'dashed' | 'dotted' | 'none';
    color?: string;
    radius?: string | number;
}

export interface ShadowTokenValue {
    x: number;
    y: number;
    blur: number;
    spread?: number;
    color: string;
}

export interface AnimationTokenValue {
    duration: string | number;
    timingFunction?: string;
    delay?: string | number;
}

export interface CreateTokenDto {
    name: string;
    category: TokenCategory;
    value: TokenValue;
    description?: string;
}

export interface UpdateTokenDto {
    name?: string;
    value?: TokenValue;
    description?: string;
}

export interface TokenExportFormat {
    format: 'css' | 'scss' | 'json' | 'js' | 'ts';
    tokens: DesignToken[];
}
