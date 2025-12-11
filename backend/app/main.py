"""TaskFlow GraphQL API - Main application entry point."""
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route
from ariadne import make_executable_schema, graphql
from ariadne.asgi import GraphQL
from dotenv import load_dotenv
import os

from .database import Database
from .resolvers import query, mutation


load_dotenv()


def create_schema():
    """Create and return executable GraphQL schema."""
    with open(os.path.join(os.path.dirname(__file__), "schema.graphql")) as f:
        type_defs = f.read()

    return make_executable_schema(type_defs, query, mutation)


async def startup():
    """Initialize database connection on startup."""
    await Database.connect()


async def shutdown():
    """Close database connection on shutdown."""
    await Database.disconnect()


def create_app():
    """Create and configure Starlette application."""
    schema = create_schema()
    graphql_app = GraphQL(schema, debug=True)

    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:4200").split(",")

    middleware = [
        Middleware(
            CORSMiddleware,
            allow_origins=cors_origins,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ]

    app = Starlette(
        routes=[Route("/graphql", graphql_app)],
        middleware=middleware,
        on_startup=[startup],
        on_shutdown=[shutdown],
    )

    return app


app = create_app()
