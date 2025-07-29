from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Task(BaseModel):
    title: str
    description: Optional[str]
    deadline: Optional[datetime]
    status: str = "To-do"
    importance: int = 1  # 1 (Low) to 5 (High)

class UpdateTask(BaseModel):
    title: Optional[str]
    description: Optional[str]
    deadline: Optional[datetime]
    status: Optional[str]
    importance: Optional[int]
