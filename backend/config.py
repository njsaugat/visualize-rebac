from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
load_dotenv()
class Settings(BaseSettings):
    PERMIT_API_KEY: str = os.getenv("PERMIT_API_KEY")
    PERMIT_PDP_URL: str = "https://cloudpdp.api.permit.io"
    
    class Config:
        env_file = ".env"

settings = Settings()