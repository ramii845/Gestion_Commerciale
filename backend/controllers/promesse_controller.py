from fastapi import APIRouter, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from config import MONGO_URI, MONGO_DB
from typing import List, Optional
from fastapi.responses import JSONResponse
from datetime import datetime
from models.promesse import Promesse

promesse_router = APIRouter()
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]

def convert_mongo_doc(doc: dict):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
    return doc

@promesse_router.post("/", response_model=dict)
async def create_promesse(p: Promesse):
    user = await db.users.find_one({"_id": ObjectId(p.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    result = await db.promesses.insert_one(p.model_dump())
    return {"id": str(result.inserted_id), "message": "Promesse créée avec succès"}

@promesse_router.get("/", response_model=List[Promesse])
async def get_all_promesses():
    promesses = await db.promesses.find().to_list(100)
    return [convert_mongo_doc(p) for p in promesses]

@promesse_router.get("/paginated", response_model=dict)
async def get_promesses_paginated(
    page: int = Query(1, ge=1),
    limit: int = Query(7, ge=1),
    marque: Optional[str] = None,
    modele: Optional[str] = None,
    matricule: Optional[str] = None,
    societe: Optional[str] = None,
    service_concerne:Optional[str] = None,
    mois: Optional[int] = Query(None, ge=1, le=12) 
):
    skip = (page - 1) * limit
    query_filter = {}

    if marque:
        query_filter["marque"] = {"$regex": marque, "$options": "i"}
    if modele:
        query_filter["modele"] = {"$regex": modele, "$options": "i"}
    if matricule:
        query_filter["matricule"] = {"$regex": matricule, "$options": "i"}
    if societe:
        query_filter["societe"] = {"$regex": societe, "$options": "i"}
    if service_concerne:
         query_filter["service_concerne"] = {"$regex": service_concerne, "$options": "i"}
    if mois:
        query_filter["$expr"] = {"$eq": [{"$month": "$date_creation"}, mois]}


    total = await db.promesses.count_documents(query_filter)
    promesses = await (
        db.promesses
        .find(query_filter)
        .sort("_id", -1)
        .skip(skip)
        .limit(limit)
        .to_list(length=limit)
    )

    for p in promesses:
        p["id"] = str(p["_id"])
        del p["_id"]

    return {
        "status_code": 200,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
        "total_promesses": total,
        "promesses": promesses
    }
@promesse_router.get("/getHistogrammePromesses")
async def getHistogrammePromesses():
    pipeline = [
        {
            "$match": {
                "user_id": {"$type": "string", "$regex": "^[a-fA-F0-9]{24}$"}
            }
        },
        {
            "$addFields": {
                "user_id_object": {"$toObjectId": "$user_id"}
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id_object",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        {
            "$group": {
                "_id": {
                    "nom": "$user.nom",
                    "month": {"$month": "$_id"},
                    "year": {"$year": "$_id"}
                },
                "total": {"$sum": 1}
            }
        },
        {
            "$group": {
                "_id": "$_id.nom",
                "data": {
                    "$push": {
                        "month": "$_id.month",
                        "year": "$_id.year",
                        "total": "$total"
                    }
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "nom": "$_id",
                "data": 1
            }
        }
    ]

    try:
        results = await db.promesses.aggregate(pipeline).to_list(length=None)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")


@promesse_router.get("/{promesse_id}", response_model=Promesse)
async def get_promesse_by_id(promesse_id: str):
    promesse = await db.promesses.find_one({"_id": ObjectId(promesse_id)})
    if not promesse:
        raise HTTPException(status_code=404, detail="Promesse non trouvée")
    promesse = convert_mongo_doc(promesse)
    return Promesse(**promesse)

@promesse_router.get("/user/{user_id}", response_model=List[Promesse])
async def get_promesses_by_user(user_id: str):
    promesses = await db.promesses.find({"user_id": user_id}).to_list(100)
    for p in promesses:
        p["id"] = str(p["_id"])
        del p["_id"]
        for key, value in p.items():
            if isinstance(value, datetime):
                p[key] = value.isoformat()
    return promesses

@promesse_router.put("/{promesse_id}")
async def update_promesse(promesse_id: str, data: Promesse):
    result = await db.promesses.update_one(
        {"_id": ObjectId(promesse_id)},
        {"$set": data.model_dump()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Aucune mise à jour ou promesse non trouvée")
    return {"message": "Promesse mise à jour avec succès"}

@promesse_router.delete("/{promesse_id}")
async def delete_promesse(promesse_id: str):
    result = await db.promesses.delete_one({"_id": ObjectId(promesse_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Promesse non trouvée")
    return {"message": "Promesse supprimée avec succès"}



