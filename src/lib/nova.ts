import type {
    ActResponse,
    ExtractedDataResponse,
    FileOperationResponse,
    ActOptions,
    ExtractOptions,
    ScreenshotOptions,
    ClickOptions,
    TypeOptions,
    SearchOptions,
    UploadOptions,
    DownloadOptions,
} from '@/types/nova';

/**
 * Helper functions for calling Nova Flow API endpoints
 * All functions handle errors and throw on failure
 */

/**
 * Execute a browser action using natural language instruction
 */
export async function performBrowserAction(options: ActOptions): Promise<ActResponse> {
    const response = await fetch('/api/browser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'act',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Browser action failed');
    }

    return data;
}

/**
 * Extract structured data from a web page
 */
export async function extractPageData(options: ExtractOptions): Promise<ExtractedDataResponse> {
    const response = await fetch('/api/browser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'extract',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Data extraction failed');
    }

    return data;
}

/**
 * Take a screenshot of a page after performing an action
 */
export async function takeScreenshot(options: ScreenshotOptions): Promise<ActResponse> {
    const response = await fetch('/api/browser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'screenshot',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Screenshot failed');
    }

    return data;
}

/**
 * Click an element on the page
 */
export async function clickElement(options: ClickOptions): Promise<ActResponse> {
    const response = await fetch('/api/interact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'click',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Click action failed');
    }

    return data;
}

/**
 * Type text into a field on the page
 */
export async function typeText(options: TypeOptions): Promise<ActResponse> {
    const response = await fetch('/api/interact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'type',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Type action failed');
    }

    return data;
}

/**
 * Search on a website
 */
export async function searchSite(options: SearchOptions): Promise<ActResponse> {
    const response = await fetch('/api/interact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'search',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Search action failed');
    }

    return data;
}

/**
 * Upload a file to a website
 */
export async function uploadFile(options: UploadOptions): Promise<FileOperationResponse> {
    const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'upload',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'File upload failed');
    }

    return data;
}

/**
 * Download a file from a website
 */
export async function downloadFile(options: DownloadOptions): Promise<FileOperationResponse> {
    const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'download',
            ...options,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'File download failed');
    }

    return data;
}

/**
 * Retrieve a previously downloaded file by ID
 */
export async function getDownloadedFile(fileId: string): Promise<Blob> {
    const response = await fetch(`/api/files/${fileId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'File retrieval failed');
    }

    return response.blob();
}
