from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import json
from collections import defaultdict, deque

app = FastAPI()

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

def is_dag(nodes, edges):
    """
    Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses topological sort (Kahn's algorithm).
    """
    # Build adjacency list and in-degree count
    node_ids = {node['id'] for node in nodes}
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    # Initialize in-degree for all nodes
    for node_id in node_ids:
        in_degree[node_id] = 0
    
    # Build graph from edges
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        
        if source in node_ids and target in node_ids:
            graph[source].append(target)
            in_degree[target] += 1
    
    # Find all nodes with no incoming edges
    queue = deque([node_id for node_id in node_ids if in_degree[node_id] == 0])
    processed = 0
    
    # Process nodes
    while queue:
        node = queue.popleft()
        processed += 1
        
        # Remove this node and update in-degrees
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, it's a DAG (no cycles)
    # If there are cycles, some nodes will have in-degree > 0
    return processed == len(node_ids)

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        # Parse the JSON string
        pipeline_data = json.loads(pipeline)
        nodes = pipeline_data.get('nodes', [])
        edges = pipeline_data.get('edges', [])
        
        # Calculate number of nodes and edges
        num_nodes = len(nodes)
        num_edges = len(edges)
        
        # Check if it's a DAG
        is_dag_result = is_dag(nodes, edges)
        
        return {
            'num_nodes': num_nodes,
            'num_edges': num_edges,
            'is_dag': is_dag_result
        }
    except json.JSONDecodeError:
        return {'error': 'Invalid JSON format'}
    except Exception as e:
        return {'error': str(e)}
