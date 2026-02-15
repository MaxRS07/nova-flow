"""
Nova Act service wrapper for browser automation
"""
import os
from contextlib import contextmanager
from typing import Optional, Dict, Any, List
from nova_act import NovaAct
from nova_act.types.act_result import ActGetResult, ActResult


class NovaActService:
    """Service wrapper for Nova Act operations"""
    
    @staticmethod
    @contextmanager
    def create_session(
        starting_page: str,
        headless: bool = True,
        timeout: Optional[int] = None,
        max_steps: Optional[int] = None,
    ):
        """
        Create a Nova Act browser session
        
        Args:
            starting_page: URL to navigate to
            headless: Run in headless mode
            timeout: Session timeout in seconds
            max_steps: Max steps per act() call
        """
        try:
            nova = NovaAct(
                starting_page=starting_page,
                headless=headless,
            )
            nova.start()
            yield nova
        except Exception as e:
            raise Exception(f"Failed to start Nova Act session: {str(e)}")
        finally:
            try:
                nova.stop()
            except:
                pass
    
    @staticmethod
    def act(
        url: str,
        prompt: str,
        headless: bool = True,
        max_steps: int = 30,
        timeout: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Execute a browser action with natural language
        
        Args:
            url: URL to navigate to
            prompt: Natural language instruction
            headless: Run in headless mode
            max_steps: Max browser actions
            timeout: Timeout in seconds
            
        Returns:
            Result dictionary with success status and metadata
        """
        try:
            with NovaActService.create_session(url, headless) as nova:
                result: ActResult = nova.act(prompt, max_steps=max_steps)
                
                return {
                    "success": True,
                    "session_id": result.metadata.session_id if result.metadata else None,
                    "num_steps_executed": result.metadata.num_steps_executed if result.metadata else 0,
                    "response": None,
                    "error": None,
                    "metadata": {
                        "prompt": prompt,
                        "url": url,
                    }
                }
        except Exception as e:
            return {
                "success": False,
                "response": None,
                "error": str(e),
                "num_steps_executed": 0,
            }
    
    @staticmethod
    def act_get(
        url: str,
        prompt: str,
        schema: Optional[Dict[str, Any]] = None,
        headless: bool = True,
        max_steps: int = 30,
        timeout: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Extract information from a page using natural language
        
        Args:
            url: URL to navigate to
            prompt: What to extract
            schema: JSON schema for response (Pydantic compatible)
            headless: Run in headless mode
            max_steps: Max browser actions
            timeout: Timeout in seconds
            
        Returns:
            Result with extracted data
        """
        try:
            with NovaActService.create_session(url, headless) as nova:
                if schema:
                    result: ActGetResult = nova.act_get(prompt, schema=schema, max_steps=max_steps)
                else:
                    result: ActGetResult = nova.act_get(prompt, max_steps=max_steps)
                
                return {
                    "success": True,
                    "data": result.parsed_response if result.matches_schema else result.response,
                    "parsed_response": result.parsed_response,
                    "matches_schema": result.matches_schema,
                    "response": result.response,
                    "error": None,
                    "session_id": result.metadata.session_id if result.metadata else None,
                }
        except Exception as e:
            return {
                "success": False,
                "data": None,
                "parsed_response": None,
                "matches_schema": False,
                "response": None,
                "error": str(e),
            }
    
    @staticmethod
    def click_element(
        url: str,
        element_description: str,
        headless: bool = True,
    ) -> Dict[str, Any]:
        """
        Click an element on the page
        
        Args:
            url: URL to navigate to
            element_description: Description of element to click
            headless: Run in headless mode
            
        Returns:
            Result of click action
        """
        try:
            with NovaActService.create_session(url, headless) as nova:
                nova.act(f"click on {element_description}")
                return {
                    "success": True,
                    "message": f"Successfully clicked element: {element_description}",
                    "error": None,
                }
        except Exception as e:
            return {
                "success": False,
                "message": None,
                "error": str(e),
            }
    
    @staticmethod
    def type_text(
        url: str,
        text: str,
        field_description: Optional[str] = None,
        headless: bool = True,
    ) -> Dict[str, Any]:
        """
        Type text into a field
        
        Args:
            url: URL to navigate to
            text: Text to type
            field_description: Description of field to type into
            headless: Run in headless mode
            
        Returns:
            Result of type action
        """
        try:
            with NovaActService.create_session(url, headless) as nova:
                if field_description:
                    nova.act(f"click on {field_description}")
                nova.page.keyboard.type(text)
                return {
                    "success": True,
                    "message": f"Successfully typed {len(text)} characters",
                    "error": None,
                }
        except Exception as e:
            return {
                "success": False,
                "message": None,
                "error": str(e),
            }
    
    @staticmethod
    def search(
        url: str,
        query: str,
        search_instructions: Optional[str] = None,
        headless: bool = True,
    ) -> Dict[str, Any]:
        """
        Perform a search on a website
        
        Args:
            url: URL to navigate to
            query: Search query
            search_instructions: Additional instructions
            headless: Run in headless mode
            
        Returns:
            Result of search action
        """
        try:
            with NovaActService.create_session(url, headless) as nova:
                instruction = f"search for {query}"
                if search_instructions:
                    instruction += f". {search_instructions}"
                else:
                    instruction += ". Press enter to initiate the search."
                
                nova.act(instruction)
                return {
                    "success": True,
                    "message": f"Successfully searched for: {query}",
                    "error": None,
                }
        except Exception as e:
            return {
                "success": False,
                "message": None,
                "error": str(e),
            }
    
    @staticmethod
    def get_page_content(url: str, headless: bool = True) -> Dict[str, Any]:
        """
        Get current page HTML content
        
        Args:
            url: URL to navigate to
            headless: Run in headless mode
            
        Returns:
            Page content
        """
        try:
            with NovaActService.create_session(url, headless) as nova:
                content = nova.page.content()
                return {
                    "success": True,
                    "content": content,
                    "error": None,
                }
        except Exception as e:
            return {
                "success": False,
                "content": None,
                "error": str(e),
            }
    
    @staticmethod
    def take_screenshot(url: str, headless: bool = True, save_path: Optional[str] = None) -> Dict[str, Any]:
        """
        Take a screenshot of the page
        
        Args:
            url: URL to navigate to
            headless: Run in headless mode
            save_path: Optional path to save screenshot
            
        Returns:
            Screenshot data or file path
        """
        try:
            with NovaActService.create_session(url, headless) as nova:
                screenshot_bytes = nova.page.screenshot()
                
                if save_path:
                    os.makedirs(os.path.dirname(save_path), exist_ok=True)
                    with open(save_path, "wb") as f:
                        f.write(screenshot_bytes)
                    return {
                        "success": True,
                        "file_path": save_path,
                        "file_size": len(screenshot_bytes),
                        "error": None,
                    }
                else:
                    return {
                        "success": True,
                        "file_size": len(screenshot_bytes),
                        "base64": screenshot_bytes.hex()[:50] + "...",  # Preview
                        "error": None,
                    }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
            }
