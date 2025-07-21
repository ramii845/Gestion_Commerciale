from fastapi import APIRouter, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from config import MONGO_URI, MONGO_DB
from typing import List, Optional
from datetime import datetime, date
from models.leads import Leads
from bson.errors import InvalidId  
from datetime import datetime, time# Assure-toi d'avoir ce modèle dans models/leads.py

leads_router = APIRouter()
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]

def convert_mongo_doc(doc: dict):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    for key, value in doc.items():
        if isinstance(value, (datetime, date)):
            doc[key] = value.isoformat()
    return doc


@leads_router.post("/", response_model=dict)
async def create_lead(lead: Leads):
    try:
        user = await db.users.find_one({"_id": ObjectId(lead.user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="ID utilisateur invalide")

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    lead_dict = lead.model_dump()

    # Convertir les dates si elles sont en string (ex: venant du front)
    for key in ["date_creation", "date_traitement", "relance"]:
        if lead_dict.get(key) and isinstance(lead_dict[key], str):
            try:
                lead_dict[key] = datetime.fromisoformat(lead_dict[key])
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Date invalide pour {key}")

    # Insérer dans MongoDB
    result = await db.leads.insert_one(lead_dict)

    return {"id": str(result.inserted_id), "message": "Lead créé avec succès"}




@leads_router.get("/", response_model=List[Leads])
async def get_all_leads():
    leads = await db.leads.find().to_list(100)
    return [convert_mongo_doc(l) for l in leads]

@leads_router.get("/", response_model=List[Leads])
async def get_all_leads():
    leads = await db.leads.find().to_list(100)
    return [convert_mongo_doc(l) for l in leads]

@leads_router.get("/paginated", response_model=dict)
async def get_leads_paginated(
    page: int = Query(1, ge=1),
    limit: int = Query(8, ge=1),
    user_id: Optional[str] = None,
    nom_client: Optional[str] = None,
    telephone: Optional[str] = None,
    marque: Optional[str] = None,
    besoin: Optional[str] = None,
    affectation: Optional[str] = None,
    date_creation: Optional[str] = None,
):
    skip = (page - 1) * limit
    query_filter = {}

    if user_id:
        query_filter["user_id"] = user_id
    if nom_client:
        query_filter["nom_client"] = {"$regex": nom_client, "$options": "i"}
    if telephone:
        query_filter["telephone"] = {"$regex": telephone, "$options": "i"}
    if marque:
        query_filter["marque"] = {"$regex": marque, "$options": "i"}
    if besoin:
        query_filter["besoin"] = {"$regex": besoin, "$options": "i"}
    if affectation:
        query_filter["affectation"] = {"$regex": affectation, "$options": "i"}
    if date_creation:
        try:
            date_obj = datetime.strptime(date_creation, "%Y-%m-%d")
            start = datetime.combine(date_obj, time.min)
            end = datetime.combine(date_obj, time.max)
            query_filter["date_creation"] = {"$gte": start, "$lte": end}
        except ValueError:
            raise HTTPException(status_code=400, detail="Format de date invalide (YYYY-MM-DD)")

    total = await db.leads.count_documents(query_filter)
    leads = await (
        db.leads.find(query_filter)
        .sort("_id", -1)
        .skip(skip)
        .limit(limit)
        .to_list(length=limit)
    )

    for l in leads:
        l["id"] = str(l["_id"])
        del l["_id"]
        for key in ["date_creation", "date_traitement", "relance"]:
            if key in l and l[key]:
                if isinstance(l[key], (datetime, date)):
                    l[key] = l[key].isoformat()

    return {
        "status_code": 200,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
        "total_leads": total,
        "leads": leads,
    }

@leads_router.get("/{lead_id}", response_model=Leads)
async def get_lead_by_id(lead_id: str):
    lead = await db.leads.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead non trouvé")
    lead = convert_mongo_doc(lead)
    return Leads(**lead)

@leads_router.get("/user/{user_id}", response_model=List[Leads])
async def get_leads_by_user(user_id: str):
    leads = await db.leads.find({"user_id": user_id}).to_list(100)
    for l in leads:
        l["id"] = str(l["_id"])
        del l["_id"]
        for key in ["date_creation", "date_traitement","relance"]:
            if key in l and isinstance(l[key], (datetime, date)):
                l[key] = l[key].isoformat()
    return leads

@leads_router.put("/{lead_id}")
async def update_lead(lead_id: str, data: Leads):
    result = await db.leads.update_one(
        {"_id": ObjectId(lead_id)},
        {"$set": data.model_dump()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Aucune mise à jour ou lead non trouvé")
    return {"message": "Lead mis à jour avec succès"}

@leads_router.delete("/{lead_id}")
async def delete_lead(lead_id: str):
    result = await db.leads.delete_one({"_id": ObjectId(lead_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead non trouvé")
    return {"message": "Lead supprimé avec succès"}
