"""GraphQL resolvers for TaskFlow API."""
from ariadne import QueryType, MutationType
from .database import TaskRepository


query = QueryType()
mutation = MutationType()


@query.field("tasks")
async def resolve_tasks(_, info, status=None):
    """Resolve tasks query with optional status filter."""
    return await TaskRepository.find_all(status)


@query.field("task")
async def resolve_task(_, info, id):
    """Resolve single task by ID."""
    return await TaskRepository.find_by_id(id)


@mutation.field("createTask")
async def resolve_create_task(_, info, input):
    """Create a new task."""
    return await TaskRepository.create(
        title=input["title"],
        description=input.get("description"),
        priority=input["priority"]
    )


@mutation.field("updateTask")
async def resolve_update_task(_, info, id, input):
    """Update existing task."""
    updates = {k: v for k, v in input.items() if v is not None}
    result = await TaskRepository.update(id, updates)

    if not result:
        raise Exception(f"Task with id {id} not found")

    return result


@mutation.field("deleteTask")
async def resolve_delete_task(_, info, id):
    """Delete task by ID."""
    success = await TaskRepository.delete(id)

    if not success:
        raise Exception(f"Task with id {id} not found")

    return success
