from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
from permit import Permit
from fastapi.middleware.cors import CORSMiddleware
import os
load_dotenv()

class Node(BaseModel):
    id: str
    group: str

class Link(BaseModel):
    source: str
    target: str

class GraphResponse(BaseModel):
    nodes: List[Node]
    links: List[Link]

app = FastAPI()
permit = Permit(
    token=os.getenv("PERMIT_API_KEY"),
    url="https://cloudpdp.api.permit.io",
    pdp="https://cloudpdp.api.permit.io"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/permission-graph", response_model=GraphResponse)
async def get_permission_graph():
    try:
        resources = await permit.api.resources.list()        
        nodes = []
        links = []
        
        # root node
        nodes.append(Node(
            id="github",
            group="store"
        ))
        
        for resource in resources:
            resource_key = resource.key
            nodes.append(Node(
                id=resource_key.lower(),
                group="type"
            ))            
            links.append(Link(
                source="github",
                target=resource_key.lower()
            ))
            
            if resource.roles:
                for role_key, _ in resource.roles.items():
                    nodes.append(Node(
                        id=f"{role_key}_{resource_key}".lower(),
                        group="relations"
                    ))                    
                    links.append(Link(
                        source=resource_key,
                        target=f"{role_key}_{resource_key}".lower()
                    ))
            
            if resource.relations:
                for relation_key, relation_data in resource.relations.items():
                    nodes.append(Node(
                        id=f"{relation_key}_{resource_key}".lower(),
                        group="relations"
                    ))
                    
                    links.append(Link(
                        source=resource_key.lower(),
                        target=f"{relation_key}_{resource_key}".lower()
                    ))
                    
                    target_resource = relation_data.resource
                    if target_resource:
                        links.append(Link(
                            source=f"{relation_key}_{resource_key}".lower(),
                            target=target_resource.lower()
                        ))
        
        unique_nodes = list({node.id: node for node in nodes}.values())
        unique_links = list({(link.source, link.target): link for link in links}.values())
        
        return GraphResponse(
            nodes=unique_nodes,
            links=unique_links
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching permission graph: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)