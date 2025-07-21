from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Leads(BaseModel):
    user_id: str
    nom_client: str = ""
    telephone:str=""
    marque:str=""
    date_creation: Optional[datetime ] = None
    date_traitement: Optional[datetime ] = None
    besoin: str = ""
    affectation: str = ""
    relance: Optional[datetime] = None
