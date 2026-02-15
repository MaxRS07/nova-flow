"""
User interaction routes (click, type, search)
"""
from fastapi import APIRouter, HTTPException
from models.schemas import (
    ClickRequest, TypeRequest, SearchRequest, ActResponse
)
from services.nova_service import NovaActService

router = APIRouter(prefix="/api/interact", tags=["interactions"])


@router.post("/click", response_model=ActResponse)
async def click_element(request: ClickRequest):
    """
    Click an element on the page
    
    Example:
        {
            "url": "https://example.com",
            "element_selector": "the 'Buy Now' button"
        }
    """
    try:
        result = NovaActService.click_element(
            url=str(request.url),
            element_description=request.element_selector,
            headless=request.headless,
        )
        return ActResponse(
            success=result["success"],
            response=result.get("message"),
            error=result.get("error"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/type", response_model=ActResponse)
async def type_text(request: TypeRequest):
    """
    Type text into a field
    
    Example:
        {
            "url": "https://example.com",
            "text": "hello@example.com",
            "field_selector": "email input field"
        }
    """
    try:
        result = NovaActService.type_text(
            url=str(request.url),
            text=request.text,
            field_description=request.field_selector,
            headless=request.headless,
        )
        return ActResponse(
            success=result["success"],
            response=result.get("message"),
            error=result.get("error"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search", response_model=ActResponse)
async def search_site(request: SearchRequest):
    """
    Search on a website
    
    Example:
        {
            "url": "https://example.com",
            "query": "python tutorials",
            "search_instructions": "use the search bar at the top"
        }
    """
    try:
        result = NovaActService.search(
            url=str(request.url),
            query=request.query,
            search_instructions=request.search_instructions,
            headless=request.headless,
        )
        return ActResponse(
            success=result["success"],
            response=result.get("message"),
            error=result.get("error"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
