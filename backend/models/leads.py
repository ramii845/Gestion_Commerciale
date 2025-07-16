from pydantic import BaseModel
from typing import Optional
from datetime import date

class Leads(BaseModel):
    user_id: str
    nom_client: str = ""
    date_creation: Optional[date] = None
    date_traitement: Optional[date] = None
    besoin: str = ""
    affectation: str = ""
    relance: str = ""
