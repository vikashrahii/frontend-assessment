# Testing Guide for Frontend Technical Assessment

This guide will help you test all four parts of the assessment.

## Prerequisites

1. **Backend Dependencies**: Make sure you have installed required Python packages:
   ```bash
   cd backend
   pip install fastapi uvicorn python-multipart
   ```

2. **Frontend Dependencies**: Should already be installed, but if not:
   ```bash
   cd frontend
   npm install
   ```

3. **Start Both Servers**:
   - Backend: `cd backend && uvicorn main:app --reload`
   - Frontend: `cd frontend && npm start`

---

## Part 1: Node Abstraction

**Status**: Currently using individual node implementations (not abstracted)

**To Test** (if you want to verify node creation works):
1. Drag nodes from the toolbar onto the canvas
2. Try dragging: Input, LLM, Output, and Text nodes
3. **Expected**: Nodes should appear on the canvas where you drop them
4. **Expected**: Each node should have appropriate handles (connection points)

**Note**: The assessment asks for a node abstraction, but the current implementation uses individual components. You may want to implement the abstraction if this part is required.

---

## Part 2: Styling

**Status**: Currently minimal/default styling

**To Test**:
1. Look at the UI - it should have basic styling
2. Check if nodes, toolbar, and buttons are visible and functional
3. **Expected**: Clean, functional interface (even if minimal)

**Note**: The assessment asks for "appealing, unified design" - you may want to add more styling.

---

## Part 3: Text Node Logic ✅

### Test 3.1: Dynamic Resizing

1. **Drag a Text node** from the toolbar onto the canvas
2. **Click on the Text node** to select it
3. **Type text** in the textarea field
4. **Expected Behavior**:
   - The textarea should expand vertically as you type multiple lines
   - The node width should adjust based on text length (between 200-400px)
   - The node height should adjust based on content

**Test Cases**:
- Type a short text: "Hello" → Node should be minimal size
- Type a long text: "This is a very long text that should make the node wider" → Node should expand
- Type multiple lines (press Enter) → Node height should increase

### Test 3.2: Variable Parsing and Handles

1. **Drag a Text node** onto the canvas
2. **In the textarea**, type: `Hello {{name}}, welcome to {{place}}`
3. **Expected Behavior**:
   - Two handles should appear on the LEFT side of the Text node
   - One handle labeled "name"
   - One handle labeled "place"
   - Below the textarea, you should see: "Variables detected: name, place"

4. **Test with different variable names**:
   - `{{input}}` → Should create handle "input"
   - `{{user_name}}` → Should create handle "user_name"
   - `{{123}}` → Should NOT create a handle (invalid variable name)
   - `{{input}} and {{input}}` → Should create only ONE handle "input" (no duplicates)

5. **Test dynamic updates**:
   - Start with: `{{input}}`
   - Add: ` and {{output}}`
   - **Expected**: A second handle "output" should appear
   - Remove variables: Change to just "Hello"
   - **Expected**: All handles should disappear

**Visual Check**:
- Handles should appear on the LEFT side (target handles)
- Each handle should be positioned vertically based on the variable order
- The source handle (output) should remain on the RIGHT side

---

## Part 4: Backend Integration ✅

### Test 4.1: Empty Pipeline

1. **Don't add any nodes** (keep canvas empty)
2. **Click the "Submit" button**
3. **Expected Alert**:
   ```
   Pipeline Analysis Results:
   
   Number of Nodes: 0
   Number of Edges: 0
   Is DAG: Yes
   ```

### Test 4.2: Simple DAG (Valid Pipeline)

1. **Drag an Input node** onto the canvas
2. **Drag an LLM node** onto the canvas
3. **Drag an Output node** onto the canvas
4. **Connect them**:
   - Connect Input → LLM (drag from Input's right handle to LLM's left handle)
   - Connect LLM → Output (drag from LLM's right handle to Output's left handle)
5. **Click "Submit"**
6. **Expected Alert**:
   ```
   Pipeline Analysis Results:
   
   Number of Nodes: 3
   Number of Edges: 2
   Is DAG: Yes
   ```

### Test 4.3: Cycle Detection (Not a DAG)

1. **Create a cycle**:
   - Add 2 nodes (e.g., Input and Text)
   - Connect Input → Text
   - Connect Text → Input (this creates a cycle!)
2. **Click "Submit"**
3. **Expected Alert**:
   ```
   Pipeline Analysis Results:
   
   Number of Nodes: 2
   Number of Edges: 2
   Is DAG: No
   ```

### Test 4.4: Complex Pipeline

1. **Create a more complex pipeline**:
   - Input → Text → LLM → Output
   - Add multiple connections
2. **Click "Submit"**
3. **Expected**: Should show correct node/edge counts and DAG status

### Test 4.5: Backend Connection

**If you get an error**, check:

1. **Backend is running**: Check terminal for `Uvicorn running on http://127.0.0.1:8000`
2. **CORS is configured**: Backend should allow `http://localhost:3000`
3. **Check browser console** (F12) for errors:
   - Network errors → Backend not running or wrong URL
   - CORS errors → Backend CORS not configured
   - JSON errors → Backend response format issue

**Common Issues**:
- **"Failed to fetch"**: Backend not running or wrong port
- **CORS error**: Check backend `main.py` has CORS middleware
- **"Invalid JSON"**: Check backend is returning proper format

---

## Quick Test Checklist

- [ ] **Part 3.1**: Text node resizes when typing
- [ ] **Part 3.2**: Variables `{{name}}` create handles on left side
- [ ] **Part 3.2**: Multiple variables create multiple handles
- [ ] **Part 3.2**: Variables list shows below textarea
- [ ] **Part 4.1**: Submit button works with empty pipeline
- [ ] **Part 4.2**: Submit shows correct node/edge counts
- [ ] **Part 4.2**: DAG detection works (shows "Yes" for valid pipelines)
- [ ] **Part 4.3**: Cycle detection works (shows "No" for cycles)
- [ ] **Part 4**: Alert displays correctly formatted results

---

## Troubleshooting

### Backend Issues

1. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn python-multipart
   ```

2. **Check backend is running**:
   - Should see: `INFO:     Uvicorn running on http://127.0.0.1:8000`
   - Test manually: Open `http://localhost:8000/` in browser → Should see `{"Ping":"Pong"}`

3. **Check backend logs** when submitting:
   - Look for POST requests to `/pipelines/parse`
   - Check for any error messages

### Frontend Issues

1. **Check browser console** (F12 → Console tab):
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify store is working**:
   - Add nodes → They should appear
   - Connect nodes → Edges should appear
   - Check if nodes/edges are in the store

3. **Check submit button**:
   - Should be clickable
   - Should trigger `handleSubmit` function
   - Check Network tab for POST request to `http://localhost:8000/pipelines/parse`

---

## Expected Results Summary

| Test Case | Nodes | Edges | Is DAG | Reason |
|-----------|-------|-------|--------|--------|
| Empty | 0 | 0 | Yes | No cycles possible |
| Input→LLM→Output | 3 | 2 | Yes | Linear, no cycles |
| Input↔Text (cycle) | 2 | 2 | No | Has a cycle |
| Complex valid | N | M | Yes | Depends on structure |

---

## Next Steps

If everything works:
- ✅ Part 3 and Part 4 are complete
- ⚠️ Part 1 (Node Abstraction) - May need implementation
- ⚠️ Part 2 (Styling) - May need more styling

Good luck with your testing!
