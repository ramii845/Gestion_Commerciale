from fastapi import APIRouter, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from config import MONGO_URI, MONGO_DB
from typing import List, Optional
from datetime import datetime, date, time
from models.vente import Vente

vente_router = APIRouter()
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]

def convert_mongo_doc(doc: dict):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    for key, value in doc.items():
        if isinstance(value, (datetime, date)):
            doc[key] = value.isoformat()
    return doc

@vente_router.post("/", response_model=dict)
async def create_vente(vente: Vente):
    try:
        user = await db.users.find_one({"_id": ObjectId(vente.user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID utilisateur invalide")

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    vente_dict = vente.model_dump()

    # Ajouter dates par défaut si non fournies
    now = datetime.now()
    vente_dict["date_creation"] = datetime.combine(vente.date_creation or now.date(), time.min)
    vente_dict["date_modification"] = datetime.combine(vente.date_modification or now.date(), time.min)

    result = await db.ventes.insert_one(vente_dict)
    return {"id": str(result.inserted_id), "message": "Vente créée avec succès"}

@vente_router.get("/", response_model=List[Vente])
async def get_all_ventes():
    ventes = await db.ventes.find().to_list(100)
    return [convert_mongo_doc(v) for v in ventes]

@vente_router.get("/paginated", response_model=dict)
async def get_ventes_paginated(
    page: int = Query(1, ge=1),
    limit: int = Query(14, ge=1),
    nom_client: Optional[str] = None,
    matricule: Optional[str] = None,
    matriculation: Optional[str] = None,
    statut: Optional[str] = None,

    
):
    skip = (page - 1) * limit
    query_filter = {}

    if nom_client:
        query_filter["nom_client"] = {"$regex": nom_client, "$options": "i"}
    if matricule:
        query_filter["matricule"] = {"$regex": matricule, "$options": "i"}
    if matriculation:
        query_filter["matriculation"] = {"$regex": matriculation, "$options": "i"}
    if statut:
        query_filter["statut"] = {"$regex": statut, "$options": "i"}

    total = await db.ventes.count_documents(query_filter)
    ventes = await (
        db.ventes
        .find(query_filter)
        .sort("_id", -1)
        .skip(skip)
        .limit(limit)
        .to_list(length=limit)
    )

    for v in ventes:
        v["id"] = str(v["_id"])
        del v["_id"]
        for key in ["date_creation", "date_modification"]:
            if key in v and v[key]:
                if isinstance(v[key], (datetime, date)):
                    v[key] = v[key].isoformat()

    return {
        "status_code": 200,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
        "total_ventes": total,
        "ventes": ventes
    }

@vente_router.get("/{vente_id}", response_model=Vente)
async def get_vente_by_id(vente_id: str):
    vente = await db.ventes.find_one({"_id": ObjectId(vente_id)})
    if not vente:
        raise HTTPException(status_code=404, detail="Vente non trouvée")
    vente = convert_mongo_doc(vente)
    return Vente(**vente)

@vente_router.get("/user/{user_id}", response_model=List[Vente])
async def get_ventes_by_user(user_id: str):
    ventes = await db.ventes.find({"user_id": user_id}).to_list(100)
    for v in ventes:
        v["id"] = str(v["_id"])
        del v["_id"]
        for key in ["date_creation", "date_modification"]:
            if key in v and isinstance(v[key], (datetime, date)):
                v[key] = v[key].isoformat()
    return ventes

@vente_router.put("/{vente_id}")
async def update_vente(vente_id: str, data: Vente):
    result = await db.ventes.update_one(
        {"_id": ObjectId(vente_id)},
        {"$set": data.model_dump()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Aucune mise à jour ou vente non trouvée")
    return {"message": "Vente mise à jour avec succès"}

@vente_router.delete("/{vente_id}")
async def delete_vente(vente_id: str):
    result = await db.ventes.delete_one({"_id": ObjectId(vente_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vente non trouvée")
    return {"message": "Vente supprimée avec succès"}
