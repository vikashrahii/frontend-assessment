// submit.js

import { useStore } from './store';

export const SubmitButton = () => {
    const { nodes, edges } = useStore((state) => ({
        nodes: state.nodes,
        edges: state.edges
    }));

    const handleSubmit = async () => {
        try {
            // Prepare pipeline data
            const pipelineData = {
                nodes: nodes,
                edges: edges
            };

            // Send to backend
            const formData = new FormData();
            formData.append('pipeline', JSON.stringify(pipelineData));

            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // Display alert with results
            alert(
                `Pipeline Analysis Results:\n\n` +
                `Number of Nodes: ${result.num_nodes}\n` +
                `Number of Edges: ${result.num_edges}\n` +
                `Is DAG: ${result.is_dag ? 'Yes' : 'No'}`
            );
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert('Error submitting pipeline. Please check the console for details.');
        }
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
            <button 
                type="button" 
                onClick={handleSubmit}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                }}
            >
                Submit
            </button>
        </div>
    );
}
