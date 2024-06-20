const data = {
    "project": {
      "milestones": [
        {
          "title": "Tools API and SDK Integration",
          "issues": [
            {
              "title": "Implement Tools API Endpoints",
              "description": "Set up API endpoints for CRUD operations and tool searching, interacting with Supabase DB and Storage.",
              "tasks": [
                "- [ ] Implement GET /api/tools endpoint to fetch tools.",
                "- [ ] Implement POST /api/tools endpoint to create new tools.",
                "- [ ] Implement GET /api/tools/{id} endpoint to retrieve a specific tool by ID.",
                "- [ ] Implement PUT /api/tools/{id} endpoint to update an existing tool.",
                "- [ ] Implement DELETE /api/tools/{id} endpoint to delete a tool by ID.",
                "- [ ] Implement POST /api/tools/search endpoint for searching tools based on criteria."
              ]
            },
            {
              "title": "Supabase DB Interaction",
              "description": "Configure interactions with Supabase DB for tools and tool_versions entities.",
              "tasks": [
                "- [ ] Define schema for tools and tool_versions entities in Supabase DB.",
                "- [ ] Set up CRUD operations (Create, Read, Update, Delete) for tools in Supabase DB.",
                "- [ ] Ensure proper handling of tool_versions for versioning and historical data."
              ]
            },
            {
              "title": "Supabase Storage Integration",
              "description": "Manage storage of tool code files using Supabase Storage.",
              "tasks": [
                "- [ ] Implement functions to upload and retrieve tool code files.",
                "- [ ] Integrate tool code file storage with CRUD operations in Supabase DB."
              ]
            },
            {
              "title": "SDK Components Development",
              "description": "Build SDK components for seamless integration with Tools API and client applications.",
              "tasks": [
                "- [ ] Implement list functionality in SDK to fetch tools (ListTool with GetToolsAPI).",
                "- [ ] Develop create functionality to add new tools (CreateTool with PostToolsAPI).",
                "- [ ] Implement get functionality to retrieve specific tools (GetTool with GetToolByIdAPI).",
                "- [ ] Build update functionality to modify existing tools (UpdateTool with UpdateToolAPI).",
                "- [ ] Develop delete functionality to remove tools (DeleteTool with DeleteToolAPI).",
                "- [ ] Implement search functionality to query tools (SearchTool with SearchToolsAPI).",
                "- [ ] Handle authentication in SDK operations (Authenticate)."
              ]
            },
            {
              "title": "Tool Client Integration",
              "description": "Integrate Tool Client for dynamic tool execution and management.",
              "tasks": [
                "- [ ] Implement dynamic import module (DynamicImportModule) for tool code execution.",
                "- [ ] Develop tool executor (Tool Executor) to execute tools after dynamic import.",
                "- [ ] Ensure integration with GetToolByIdAPI to fetch tool details.",
                "- [ ] Manage tool code file storage using Supabase Storage."
              ]
            }
          ]
        }
      ]
    }
  };
  
  exports.data = { data }