from fastapi import FastAPI
from app.routes import router as task_router

app = FastAPI()

# Include API routes
app.include_router(task_router)

@app.get("/")
async def root():
    return {"message": "DevTrack Backend Running"}
