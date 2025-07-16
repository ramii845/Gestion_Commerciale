from pydantic import BaseModel
from typing import Optional

class Promesse(BaseModel):
    user_id: str
    marque: str = ""
    modele: str = ""
    matricule: str = ""
    promesse: str = ""
    societe: str = ""
    service_concerne: str = ""
    frais: float  