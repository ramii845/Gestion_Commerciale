from fastapi import APIRouter, HTTPException, Form, UploadFile, File, Query
from models.user import User
from pydantic import BaseModel
from config import SECRET_KEY, MONGO_URI, MONGO_DB, CLOUDINARY_UPLOAD_PRESET
from passlib.context import CryptContext
from motor.motor_asyncio import AsyncIOMotorClient
import jwt
import datetime
from fastapi.responses import JSONResponse
from bson import ObjectId
from typing import List, Optional
import httpx
import re

user_router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]

def get_objectid(id: str):
    try:
        return ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

class UserLogin(BaseModel):
    cin: str
    motdepasse: str

class ResetPasswordRequest(BaseModel):
    cin: str
    nouveau_motdepasse: str

async def upload_to_cloudinary(file: UploadFile) -> str:
    url = 'https://api.cloudinary.com/v1_1/ditzf19gl/image/upload'
    data = { "upload_preset": CLOUDINARY_UPLOAD_PRESET }
    files = {"file": (file.filename, await file.read(), file.content_type)}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=data, files=files)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Erreur upload Cloudinary")
        result = response.json()
        return result.get("secure_url", "")

@user_router.post("/register/")
async def register(user: User):
    existing_user = await db.users.find_one({"cin": user.cin})
    if existing_user:
        raise HTTPException(status_code=400, detail="CIN déjà utilisé")

    hashed_password = pwd_context.hash(user.motdepasse)
    user_data = user.dict()
    user_data["motdepasse"] = hashed_password

    result = await db.users.insert_one(user_data)
    return {"id": str(result.inserted_id), "message": "Utilisateur créé avec succès"}

@user_router.post("/login/")
async def signin(user_data: UserLogin):
    existing_user = await db.users.find_one({
        "cin": {"$regex": f"^{re.escape(user_data.cin)}$", "$options": "i"}
    })
    if not existing_user or not pwd_context.verify(user_data.motdepasse, existing_user["motdepasse"]):
        raise HTTPException(status_code=400, detail="CIN ou mot de passe incorrect")

    token = jwt.encode(
        {
            "user_id": str(existing_user["_id"]),
            "role": existing_user.get("role", "user"),
            "nom": existing_user["nom"],
            "cin": existing_user["cin"],
            "photo": existing_user.get("photo", ""),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=4)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return {
        "token": token,
        "role": existing_user.get("role", "user"),
        "message": "Connexion réussie"
    }

@user_router.get("/", response_model=List[User])
async def get_users():
    users = await db.users.find().to_list(100)
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    return JSONResponse(status_code=200, content={"status_code": 200, "users": users})

@user_router.put("/{user_id}", response_model=dict)
async def update_user(user_id: str, user: User):
    user_data = user.dict()

    # On supprime motdepasse pour ne pas le modifier
    if "motdepasse" in user_data:
        user_data.pop("motdepasse")

    result = await db.users.update_one(
        {"_id": get_objectid(user_id)},
        {"$set": user_data}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated successfully"}

@user_router.delete("/{user_id}", response_model=dict)
async def delete_user(user_id: str):
    result = await db.users.delete_one({"_id": get_objectid(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@user_router.get("/paginated", response_model=dict)
async def get_users_paginated(
    page: int = Query(1, ge=1),
    limit: int = Query(7, ge=1),
    nom: Optional[str] = Query(None)
):
    skip = (page - 1) * limit
    query_filter = {}

    if nom:
        query_filter["nom"] = {"$regex": nom, "$options": "i"}

    total = await db.users.count_documents(query_filter)

    users = await (
        db.users
        .find(query_filter)
        .sort("_id", -1)
        .skip(skip)
        .limit(limit)
        .to_list(length=limit)
    )

    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]

    return {
        "status_code": 200,
        "page": page,
        "total_pages": (total + limit - 1) // limit,
        "total_users": total,
        "users": users
    }

@user_router.post("/reset-password/")
async def reset_password(data: ResetPasswordRequest):
    user = await db.users.find_one({
        "cin": {"$regex": f"^{re.escape(data.cin)}$", "$options": "i"}
    })
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    hashed_password = pwd_context.hash(data.nouveau_motdepasse)

    await db.users.update_one(
        {"cin": data.cin},
        {"$set": {"motdepasse": hashed_password}}
    )

    return {"message": "Mot de passe mis à jour avec succès"}

@user_router.get("/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    user = await db.users.find_one({"_id": get_objectid(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    user["id"] = str(user["_id"])
    del user["_id"]
    return user
