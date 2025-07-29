from fastapi import APIRouter, HTTPException, status
from app.schemas import Task, UpdateTask, TaskResponse
from bson import ObjectId
from app.database import db
from typing import List, Dict

router = APIRouter()
collection = db["tasks"]

def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description", ""),
        "deadline": task.get("deadline"),
        "status": task["status"],
        "importance": task["importance"]
    }

@router.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task: Task):
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")

    task_dict = task.dict()
    result = await collection.insert_one(task_dict)
    created_task = await collection.find_one({"_id": result.inserted_id})
    return task_helper(created_task)

@router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks():
    tasks = []
    async for task in collection.find():
        tasks.append(task_helper(task))
    return tasks

@router.put("/tasks/{id}", response_model=TaskResponse)
async def update_task(id: str, task: UpdateTask):
    updated_task = await collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {k: v for k, v in task.dict().items() if v is not None}}
    )
    if updated_task.modified_count == 1:
        new_task = await collection.find_one({"_id": ObjectId(id)})
        return task_helper(new_task)
    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/tasks/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(id: str):
    deleted_task = await collection.delete_one({"_id": ObjectId(id)})
    if deleted_task.deleted_count == 1:
        return
    raise HTTPException(status_code=404, detail="Task not found")

@router.patch("/tasks/{task_id}", response_model=TaskResponse)
async def update_task_partial(task_id: str, update_data: Dict):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID format")
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")

    result = await collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    updated_task = await collection.find_one({"_id": ObjectId(task_id)})
    return task_helper(updated_task)

@router.get("/test-mongo")
async def test_mongo_connection():
    try:
        await db.command("ping")
        return {"status": "connected to MongoDB"}
    except Exception as e:
        return {"status": "connection failed", "error": str(e)}
