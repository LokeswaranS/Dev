from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as task_router

app = FastAPI()

# ✅ Add CORS settings here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes
app.include_router(task_router)

@app.get("/")
async def root():
    return {"message": "DevTrack Backend Running"}
