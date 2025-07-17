from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Vente(BaseModel):
    user_id: str
    marque: str = ""
    modele: str = ""
    matricule: str = ""
    nom_client:str=""  
    tel_client:str=""  
    date_creation: Optional[datetime]
    date_modification: Optional[datetime]

    commentaire:str=""
    statut:str=""