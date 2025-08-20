from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ArchiveVente(BaseModel):
    user_id: str
    marque: str = ""
    modele: str = ""
    matricule: str = ""
    matriculation: str = ""
    nom_client: str = ""
    tel_client: str = ""
    date_creation: Optional[datetime] = None
    date_modification: Optional[datetime] = None
    commentaire: str = ""
    accesoire:str=""
    statut: str = ""
    date_archivage: Optional[datetime] = None
