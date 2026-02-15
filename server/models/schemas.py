"""
Pydantic schemas for request/response models
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Any, Dict, List
from enum import Enum


class ActRequest(BaseModel):
    """Request to perform a browser action"""
    url: HttpUrl
    prompt: str = Field(..., description="Natural language instruction for the agent")
    max_steps: Optional[int] = Field(30, description="Max browser actions before timeout")
    timeout: Optional[int] = Field(None, description="Timeout in seconds")
    headless: Optional[bool] = Field(True, description="Run browser in headless mode")


class ActGetRequest(BaseModel):
    """Request to extract data from a page"""
    url: HttpUrl
    prompt: str = Field(..., description="What information to extract")
    schema: Optional[Dict[str, Any]] = Field(None, description="JSON schema for response")
    max_steps: Optional[int] = Field(30, description="Max browser actions")
    timeout: Optional[int] = Field(None, description="Timeout in seconds")
    headless: Optional[bool] = Field(True, description="Run browser in headless mode")


class ClickRequest(BaseModel):
    """Request to click an element"""
    url: HttpUrl
    element_selector: str = Field(..., description="CSS selector or description of element to click")
    headless: Optional[bool] = Field(True)


class TypeRequest(BaseModel):
    """Request to type text into a field"""
    url: HttpUrl
    text: str = Field(..., description="Text to type")
    field_selector: Optional[str] = Field(None, description="CSS selector of the field")
    headless: Optional[bool] = Field(True)


class SearchRequest(BaseModel):
    """Request to search on a website"""
    url: HttpUrl
    query: str = Field(..., description="Search query")
    search_instructions: Optional[str] = Field(None, description="Additional instructions for search")
    headless: Optional[bool] = Field(True)


class FileUploadRequest(BaseModel):
    """Request to upload a file"""
    url: HttpUrl
    file_path: str = Field(..., description="Path to file to upload")
    upload_selector: Optional[str] = Field(None, description="CSS selector of upload button")
    headless: Optional[bool] = Field(True)


class FileDownloadRequest(BaseModel):
    """Request to download a file"""
    url: HttpUrl
    download_action: str = Field(..., description="Action to trigger download")
    save_path: Optional[str] = Field(None, description="Where to save the file")
    headless: Optional[bool] = Field(True)


class ExtractPageDataRequest(BaseModel):
    """Request to extract structured data from a page"""
    url: HttpUrl
    extraction_prompt: str = Field(..., description="What data to extract")
    schema: Dict[str, Any] = Field(..., description="Pydantic-compatible JSON schema")
    headless: Optional[bool] = Field(True)


class ParallelTaskRequest(BaseModel):
    """Request to run multiple tasks in parallel"""
    tasks: List[ActRequest] = Field(..., description="List of tasks to run in parallel")
    max_concurrent: Optional[int] = Field(3, description="Max concurrent browser sessions")


class MultiStepWorkflowRequest(BaseModel):
    """Request to run a multi-step workflow"""
    steps: List[Dict[str, Any]] = Field(..., description="List of workflow steps")
    headless: Optional[bool] = Field(True)


class ActResponse(BaseModel):
    """Response from an act() call"""
    success: bool
    session_id: Optional[str] = None
    num_steps_executed: int = 0
    response: Optional[str] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class ExtractedDataResponse(BaseModel):
    """Response with extracted data"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    parsed_response: Optional[Any] = None
    matches_schema: Optional[bool] = None
    error: Optional[str] = None


class FileOperationResponse(BaseModel):
    """Response from file operations"""
    success: bool
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    message: str
    error: Optional[str] = None


class StatusResponse(BaseModel):
    """Status of a browser session"""
    session_active: bool
    current_url: Optional[str] = None
    timestamp: Optional[str] = None
