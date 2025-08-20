from pydantic import BaseModel,Field
from typing import Optional
from datetime import datetime

class Promesse(BaseModel):
    user_id: str
    marque: str = ""
    modele: str = ""
    matricule: str = ""
    promesse: str = ""
    societe: str = ""
    date_creation: datetime = Field(default_factory=datetime.utcnow)  
    service_concerne: str = ""
    frais: float =0 