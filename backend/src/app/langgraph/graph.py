"""
Builds and compiles the main LangGraph StateGraph.
"""
import hashlib
from langgraph.graph import StateGraph, START, END

from .state import PipelineState
from .nodes.cache_nodes import check_cache_node, save_cache_node
from .nodes.llm_nodes import generate_plan_node, generate_script_node, generate_learning_path_node
from .nodes.veo_nodes import generate_veo_node

def route_cache(state: PipelineState) -> str:
    """
    Conditional edge router based on cache_hit.
    """
    if state.get("cache_hit", False):
        return END
    return "generate_plan"

def build_graph():
    """
    Constructs the linear pipeline graph.
    """
    builder = StateGraph(PipelineState)
    
    # Add Nodes
    builder.add_node("check_cache", check_cache_node)
    builder.add_node("generate_plan", generate_plan_node)
    builder.add_node("generate_learning_path", generate_learning_path_node)
    builder.add_node("generate_script", generate_script_node)
    builder.add_node("generate_veo", generate_veo_node)
    builder.add_node("save_cache", save_cache_node)
    
    # Add Edges
    builder.add_edge(START, "check_cache")
    
    # Conditional edge from check_cache
    builder.add_conditional_edges(
        "check_cache",
        route_cache,
        {
            END: END,
            "generate_plan": "generate_plan"
        }
    )
    
    # Linear flow: plan -> learning path -> script -> veo -> save
    builder.add_edge("generate_plan", "generate_learning_path")
    builder.add_edge("generate_learning_path", "generate_script")
    builder.add_edge("generate_script", "generate_veo")
    builder.add_edge("generate_veo", "save_cache")
    builder.add_edge("save_cache", END)
    
    return builder.compile()

# The compiled graph app that can be invoked by the API route
app = build_graph()

def invoke_pipeline(inputs: dict) -> dict:
    """
    Helper function to hash inputs and invoke the pipeline.
    """
    # Deterministic hash of inputs
    concat_str = f"{inputs.get('topic')}_{inputs.get('skill_level')}_{inputs.get('goal')}_{inputs.get('instructor_tone')}_{inputs.get('time_commitment')}".lower()
    input_hash = hashlib.md5(concat_str.encode()).hexdigest()
    
    # Initialize state
    initial_state = {**inputs, "input_hash": input_hash, "cache_hit": False}
    
    # Run graph
    return app.invoke(initial_state)
