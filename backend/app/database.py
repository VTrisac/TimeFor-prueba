"""Database connection and operations for TaskFlow."""
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import Optional, List
import os
from datetime import datetime


class Database:
    client: Optional[AsyncIOMotorClient] = None

    @classmethod
    async def connect(cls):
        """Establish connection to MongoDB."""
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        cls.client = AsyncIOMotorClient(mongodb_url)

    @classmethod
    async def disconnect(cls):
        """Close MongoDB connection."""
        if cls.client:
            cls.client.close()

    @classmethod
    def get_collection(cls):
        """Get tasks collection."""
        db_name = os.getenv("MONGODB_DB", "taskflow")
        return cls.client[db_name]["tasks"]


class TaskRepository:
    """Repository pattern for task operations."""

    @staticmethod
    def _format_task(task: dict) -> dict:
        """Format task document for GraphQL response."""
        if task:
            task["id"] = str(task.pop("_id"))
        return task

    @staticmethod
    async def create(title: str, description: Optional[str], priority: str) -> dict:
        """Create a new task."""
        collection = Database.get_collection()
        now = datetime.utcnow().isoformat()

        task = {
            "title": title,
            "description": description,
            "status": "PENDING",
            "priority": priority,
            "createdAt": now,
            "updatedAt": now
        }

        result = await collection.insert_one(task)
        task["_id"] = result.inserted_id
        return TaskRepository._format_task(task)

    @staticmethod
    async def find_all(status: Optional[str] = None) -> List[dict]:
        """Retrieve all tasks, optionally filtered by status."""
        collection = Database.get_collection()
        query = {"status": status} if status else {}

        cursor = collection.find(query).sort("createdAt", -1)
        tasks = await cursor.to_list(length=None)
        return [TaskRepository._format_task(task) for task in tasks]

    @staticmethod
    async def find_by_id(task_id: str) -> Optional[dict]:
        """Find task by ID."""
        collection = Database.get_collection()

        try:
            task = await collection.find_one({"_id": ObjectId(task_id)})
            return TaskRepository._format_task(task) if task else None
        except Exception:
            return None

    @staticmethod
    async def update(task_id: str, updates: dict) -> Optional[dict]:
        """Update task by ID."""
        collection = Database.get_collection()

        try:
            updates["updatedAt"] = datetime.utcnow().isoformat()

            result = await collection.find_one_and_update(
                {"_id": ObjectId(task_id)},
                {"$set": updates},
                return_document=True
            )
            return TaskRepository._format_task(result) if result else None
        except Exception:
            return None

    @staticmethod
    async def delete(task_id: str) -> bool:
        """Delete task by ID."""
        collection = Database.get_collection()

        try:
            result = await collection.delete_one({"_id": ObjectId(task_id)})
            return result.deleted_count > 0
        except Exception:
            return False
