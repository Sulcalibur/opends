/**
 * Component-related TypeScript types
 * For design system component management
 */

export type ComponentStatus = 'draft' | 'review' | 'approved' | 'deprecated';

export interface Component {
    id: string;
    name: string;
    displayName?: string;
    description?: string;
    category?: string;
    status: ComponentStatus;
    spec: ComponentSpec;
    previewUrl?: string;
    createdBy?: string;
    updatedBy?: string;
    approvedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    approvedAt?: Date;
    deletedAt?: Date;
}

export interface ComponentSpec {
    type: string;
    props?: ComponentProp[];
    variants?: ComponentVariant[];
    styles?: Record<string, any>;
    examples?: ComponentExample[];
    framework?: 'vue' | 'react' | 'svelte' | 'angular' | 'web-component';
}

export interface ComponentProp {
    name: string;
    type: string;
    description?: string;
    required?: boolean;
    default?: any;
    options?: string[];
}

export interface ComponentVariant {
    name: string;
    props: Record<string, any>;
    description?: string;
}

export interface ComponentExample {
    name: string;
    code: string;
    language: string;
    description?: string;
}

export interface CreateComponentDto {
    name: string;
    displayName?: string;
    description?: string;
    category?: string;
    spec: ComponentSpec;
}

export interface UpdateComponentDto {
    displayName?: string;
    description?: string;
    category?: string;
    spec?: ComponentSpec;
    status?: ComponentStatus;
}

export interface ComponentVersion {
    id: string;
    componentId: string;
    version: string;
    spec: ComponentSpec;
    changelog?: string;
    createdBy?: string;
    createdAt: Date;
}

export interface ComponentSearchFilters {
    category?: string;
    status?: ComponentStatus;
    query?: string;
}
