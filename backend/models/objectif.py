from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Objectif(BaseModel):
    user_id: str
    peugeot: int
    citroen: int
    opel: int
    realise_peugeot: Optional[int] = 0
    realise_citroen: Optional[int] = 0
    realise_opel: Optional[int] = 0
    date_creation: datetime = Field(default_factory=datetime.utcnow)
    periode: Optional[str] ="t0"
