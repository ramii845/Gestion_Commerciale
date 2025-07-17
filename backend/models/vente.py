from pydantic import BaseModel
from typing import Optional
from datetime import date


class Vente(BaseModel):
    user_id: str
    marque: str = ""
    modele: str = ""
    matricule: str = ""
    nom_client:str=""  
    tel_client:str=""  
    date_creation:Optional[date] = None
    date_modification:Optional[date] = None
    commentaire:str=""
    statut:str=""