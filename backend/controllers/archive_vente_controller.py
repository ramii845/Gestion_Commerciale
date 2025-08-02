from fastapi import APIRouter, HTTPException,Query
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, MONGO_DB
from models.archivevente import ArchiveVente
from bson import ObjectId
from datetime import datetime
from typing import Optional

archive_router = APIRouter()
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]

def convert_mongo_doc(doc: dict):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@archive_router.post("/", response_model=dict)
async def create_archive_vente(archive: ArchiveVente):
    archive_dict = archive.model_dump()
    archive_dict["date_archivage"] = datetime.utcnow()
    result = await db.archive_ventes.insert_one(archive_dict)
    return {"id": str(result.inserted_id), "message": "Vente archivée avec succès"}

@archive_router.get("/", response_model=list)
async def get_all_archives():
    archives = await db.archive_ventes.find().to_list(100)
    return [convert_mongo_doc(a) for a in archives]

@archive_router.get("/paginated", response_model=dict)
async def get_archives_paginated(
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

    total = await db.archive_ventes.count_documents(query_filter)
    archives = await (
        db.archive_ventes
        .find(query_filter)
        .sort("_id", -1)
        .skip(skip)
        .limit(limit)
        .to_list(length=limit)
    )

    archives = [convert_mongo_doc(a) for a in archives]

    return {
        "status_code": 200,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
        "total_archives": total,
        "archives": archives
    }

@archive_router.delete("/{archive_id}")
async def delete_archive(archive_id: str):
    result = await db.archive_ventes.delete_one({"_id": ObjectId(archive_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Archive non trouvée")
    return {"message": "Archive supprimée définitivement"}