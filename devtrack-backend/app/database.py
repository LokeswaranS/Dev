from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = "mongodb+srv://user1:user1@cluster0.xmp4xsc.mongodb.net/admin?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(MONGODB_URI)
db = client["devtrackdb"]

