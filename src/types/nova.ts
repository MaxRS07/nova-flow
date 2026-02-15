/**
 * Nova Flow API Types
 * Types for browser automation, interactions, and file operations
 */

/**
 * Common request/response types
 */
export interface ActResponse {
    success: boolean;
    session_id?: string;
    num_steps_executed: number;
    response?: string;
    error?: string;
    metadata?: Record<string, unknown>;
}

export interface ExtractedDataResponse {
    success: boolean;
    data?: Record<string, unknown>;
    parsed_response?: unknown;
    matches_schema?: boolean;
    error?: string;
}

export interface FileOperationResponse {
    success: boolean;
    file_path?: string;
    file_size?: number;
    message: string;
    error?: string;
}

/**
 * Browser automation types
 */
export interface BrowserActRequest {
    action?: 'act' | 'extract' | 'screenshot';
    url: string;
    prompt: string;
    max_steps?: number;
    timeout?: number;
    headless?: boolean;
}

export interface BrowserExtractRequest {
    action?: 'extract';
    url: string;
    prompt: string;
    schema?: Record<string, unknown>;
    max_steps?: number;
    timeout?: number;
    headless?: boolean;
}

export interface BrowserScreenshotRequest {
    action?: 'screenshot';
    url: string;
    prompt: string;
    headless?: boolean;
}

export type BrowserRequest = BrowserActRequest | BrowserExtractRequest | BrowserScreenshotRequest;

/**
 * User interaction types
 */
export interface ClickRequest {
    action?: 'click';
    url: string;
    element_selector: string;
    headless?: boolean;
}

export interface TypeRequest {
    action?: 'type';
    url: string;
    text: string;
    field_selector?: string;
    headless?: boolean;
}

export interface SearchRequest {
    action?: 'search';
    url: string;
    query: string;
    search_instructions?: string;
    headless?: boolean;
}

export type InteractionRequest = ClickRequest | TypeRequest | SearchRequest;

/**
 * File operation types
 */
export interface FileUploadRequest {
    action?: 'upload';
    url: string;
    file_path: string;
    upload_selector?: string;
    headless?: boolean;
}

export interface FileDownloadRequest {
    action?: 'download';
    url: string;
    download_action: string;
    save_path?: string;
    headless?: boolean;
}

export type FileRequest = FileUploadRequest | FileDownloadRequest;

/**
 * Convenience request types without action field
 */
export interface ActOptions {
    url: string;
    prompt: string;
    max_steps?: number;
    timeout?: number;
    headless?: boolean;
}

export interface ExtractOptions {
    url: string;
    prompt: string;
    schema?: Record<string, unknown>;
    max_steps?: number;
    timeout?: number;
    headless?: boolean;
}

export interface ScreenshotOptions {
    url: string;
    prompt: string;
    headless?: boolean;
}

export interface ClickOptions {
    url: string;
    element_selector: string;
    headless?: boolean;
}

export interface TypeOptions {
    url: string;
    text: string;
    field_selector?: string;
    headless?: boolean;
}

export interface SearchOptions {
    url: string;
    query: string;
    search_instructions?: string;
    headless?: boolean;
}

export interface UploadOptions {
    url: string;
    file_path: string;
    upload_selector?: string;
    headless?: boolean;
}

export interface DownloadOptions {
    url: string;
    download_action: string;
    save_path?: string;
    headless?: boolean;
}
