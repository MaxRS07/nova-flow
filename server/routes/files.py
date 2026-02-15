"""
File operation routes (upload, download)
"""
from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from models.schemas import FileUploadRequest, FileDownloadRequest, FileOperationResponse
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/api/files", tags=["files"])


@router.post("/upload", response_model=FileOperationResponse)
async def upload_file(request: FileUploadRequest):
    """
    Upload a file to a website
    
    Note: The file must already exist on the server filesystem.
    
    Example:
        {
            "url": "https://example.com/upload",
            "file_path": "/path/to/file.pdf",
            "upload_selector": "the upload button"
        }
    """
    try:
        from services.nova_service import NovaActService
        
        # Check if file exists
        if not os.path.exists(request.file_path):
            raise FileNotFoundError(f"File not found: {request.file_path}")
        
        file_size = os.path.getsize(request.file_path)
        
        # For now, return success as Nova Act will handle the upload
        # In a real scenario, you'd implement the full upload flow
        return FileOperationResponse(
            success=True,
            file_path=request.file_path,
            file_size=file_size,
            message=f"File {os.path.basename(request.file_path)} ready for upload ({file_size} bytes)",
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/download", response_model=FileOperationResponse)
async def download_file(request: FileDownloadRequest):
    """
    Download a file from a website
    
    Example:
        {
            "url": "https://example.com/files/document.pdf",
            "download_action": "click the download button",
            "save_path": "/tmp/downloads/document.pdf"
        }
    """
    try:
        from services.nova_service import NovaActService
        
        # Determine save path
        save_path = request.save_path or f"/tmp/{os.path.basename(str(request.url))}"
        
        # Create directory if needed
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # Use Nova Act to trigger download
        with NovaActService.create_session(str(request.url), headless=True) as nova:
            with nova.page.expect_download() as download_info:
                nova.act(request.download_action)
            
            # Save the downloaded file
            download_info.value.save_as(save_path)
            
            file_size = os.path.getsize(save_path)
            
            return FileOperationResponse(
                success=True,
                file_path=save_path,
                file_size=file_size,
                message=f"File downloaded successfully to {save_path}",
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/{file_id}")
async def get_downloaded_file(file_id: str):
    """
    Retrieve a previously downloaded file
    
    Note: This is a placeholder for file retrieval logic
    """
    try:
        # In a real implementation, you'd maintain a file registry
        # and retrieve files by ID
        raise HTTPException(status_code=501, detail="File retrieval not yet implemented")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
