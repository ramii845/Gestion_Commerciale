from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from controllers.user_controller import user_router
from controllers.promesse_controller import promesse_router
from controllers.leads_controller import leads_router

import numpy as np

import cv2

app = FastAPI()

# 🔵 CORS pour autoriser React Vite (localhost:5173)
origins = [
    "http://localhost:5173",  # URL de ton app React Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔵 Inclusion uniquement du router utilisateur
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(promesse_router, prefix="/promesses", tags=["promesses"])
app.include_router(leads_router, prefix="/leads", tags=["leads"])





# 🔵 Route d'accueil
@app.get("/")
async def root():
    return {"message": "Backend FastAPI connecté à MongoDB avec succès 🚀"}
