from fastapi import APIRouter, HTTPException
from models.objectif import Objectif
from config import MONGO_URI, MONGO_DB
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List
from fastapi.responses import JSONResponse

objectif_router = APIRouter()
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]

def get_objectid(id: str):
    try:
        return ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

# Ajouter un objectif
@objectif_router.post("/", response_model=dict)
async def create_objectif(objectif: Objectif):
    # Vérifier si l'utilisateur existe
    user = await db.users.find_one({"_id": get_objectid(objectif.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    objectif_data = objectif.dict()
    result = await db.objectifs.insert_one(objectif_data)
    return {"id": str(result.inserted_id), "message": "Objectif créé avec succès"}

# Récupérer tous les objectifs
@objectif_router.get("/", response_model=dict)
async def get_objectifs():
    objectifs = await db.objectifs.find().to_list(1000)
    for obj in objectifs:
        obj["id"] = str(obj["_id"])
        del obj["_id"]
    return JSONResponse(status_code=200, content={"status_code": 200, "objectifs": objectifs})

# Récupérer les objectifs d'un utilisateur
@objectif_router.get("/user/{user_id}", response_model=dict)
async def get_objectif_by_user(user_id: str):
    objectifs = await db.objectifs.find({"user_id": user_id}).to_list(1000)
    if not objectifs:
        raise HTTPException(status_code=404, detail="Aucun objectif trouvé pour cet utilisateur")
    for obj in objectifs:
        obj["id"] = str(obj["_id"])
        del obj["_id"]
    return {"status_code": 200, "objectifs": objectifs}

# Modifier un objectif
@objectif_router.put("/{objectif_id}", response_model=dict)
async def update_objectif(objectif_id: str, objectif: Objectif):
    objectif_data = objectif.dict()
    result = await db.objectifs.update_one(
        {"_id": get_objectid(objectif_id)},
        {"$set": objectif_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Objectif non trouvé")
    return {"message": "Objectif mis à jour avec succès"}

# Supprimer un objectif
@objectif_router.delete("/{objectif_id}", response_model=dict)
async def delete_objectif(objectif_id: str):
    result = await db.objectifs.delete_one({"_id": get_objectid(objectif_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Objectif non trouvé")
    return {"message": "Objectif supprimé avec succès"}
