from pydantic import BaseModel
from typing import Optional
class User(BaseModel):
    nom: str
    cin: str
    motdepasse: str
    photo: Optional[str] =""
    role: str = ""
 
