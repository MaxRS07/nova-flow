"""
Browser automation routes
"""
from fastapi import APIRouter, HTTPException
from models.schemas import ActRequest, ActResponse, ActGetRequest, ExtractedDataResponse
from services.nova_service import NovaActService

router = APIRouter(prefix="/api/browser", tags=["browser"])


@router.post("/act", response_model=ActResponse)
async def perform_action(request: ActRequest):
    """
    Execute a browser action with natural language instruction
    
    Example:
        {
            "url": "https://example.com",
            "prompt": "Click the login button and sign in with email test@example.com",
            "max_steps": 30,
            "headless": true
        }
    """
    try:
        result = NovaActService.act(
            url=str(request.url),
            prompt=request.prompt,
            headless=request.headless,
            max_steps=request.max_steps,
            timeout=request.timeout,
        )
        return ActResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract", response_model=ExtractedDataResponse)
async def extract_data(request: ActGetRequest):
    """
    Extract structured data from a web page
    
    Example:
        {
            "url": "https://example.com/products",
            "prompt": "Extract all product names and prices from this page",
            "schema": {
                "type": "object",
                "properties": {
                    "products": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "price": {"type": "string"}
                            }
                        }
                    }
                }
            }
        }
    """
    try:
        result = NovaActService.act_get(
            url=str(request.url),
            prompt=request.prompt,
            schema=request.schema,
            headless=request.headless,
            max_steps=request.max_steps,
            timeout=request.timeout,
        )
        return ExtractedDataResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/screenshot", response_model=ActResponse)
async def get_screenshot(request: ActRequest):
    """
    Take a screenshot of the current page
    
    Example:
        {
            "url": "https://example.com",
            "prompt": "Navigate to the dashboard"
        }
    """
    try:
        # First navigate and perform action
        NovaActService.act(
            url=str(request.url),
            prompt=request.prompt,
            headless=request.headless,
        )
        
        # Then take screenshot
        screenshot_result = NovaActService.take_screenshot(
            url=str(request.url),
            headless=request.headless,
        )
        
        return ActResponse(
            success=screenshot_result["success"],
            response=screenshot_result.get("file_path"),
            error=screenshot_result.get("error"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/page-content", response_model=ActResponse)
async def get_page_content(request: ActRequest):
    """
    Get the HTML content of the page
    
    Example:
        {
            "url": "https://example.com",
            "prompt": "Navigate to the products page"
        }
    """
    try:
        # First navigate
        NovaActService.act(
            url=str(request.url),
            prompt=request.prompt,
            headless=request.headless,
        )
        
        # Get page content
        content_result = NovaActService.get_page_content(
            url=str(request.url),
            headless=request.headless,
        )
        
        return ActResponse(
            success=content_result["success"],
            response=content_result.get("content", "")[:1000],  # Return first 1000 chars
            error=content_result.get("error"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
