# Task Manager Dashboard

A full-stack task management application with CRUD operations, audit logging, pagination, and search/filter capabilities. Built with React, Node.js + Express, and in-memory storage.

## Features

### Frontend Features
- ✨ **Modern Dark-Themed UI** - Minimalist design inspired by Linear and Notion
- 📋 **Task Management** - Complete CRUD operations with intuitive modals
- 🔍 **Search & Filter** - Real-time search by title or description
- 📄 **Pagination** - Clean pagination with 5 tasks per page
- 📊 **Task Table** - Displays ID, Title, Description, Created At, and Actions
- ✏️ **Edit & Delete** - Quick actions with confirmation dialogs
- 📝 **Form Validation** - Character limits and input sanitization
- 🎨 **Responsive Design** - Works seamlessly on all screen sizes
- 🔔 **Toast Notifications** - Instant feedback for all actions

### Audit Logging
- 📚 **Complete Audit Trail** - Tracks all Create, Update, and Delete operations
- 🎨 **Color-Coded Actions**:
  - 🟢 Create - Green badge
  - 🟡 Update - Yellow/Amber badge
  - 🔴 Delete - Red badge
- 📋 **Detailed Information** - Timestamp, action type, task ID, and updated content
- 📄 **Paginated Logs** - Easy navigation through historical changes

### Backend Features
- 🔐 **Basic Authentication** - Secure all API routes (username: `admin`, password: `password123`)
- 🛡️ **Input Validation** - Zod schema validation on all endpoints
- 🧹 **Input Sanitization** - Prevents HTML/script injection
- 📝 **Automatic Audit Logging** - Logs generated for all CRUD operations
- 🗄️ **In-Memory Storage** - Fast, efficient data management
- 🏗️ **Modular Architecture** - Clean separation of concerns

### Input Validation Rules
- **Title**: Required, maximum 100 characters, no HTML/script tags
- **Description**: Optional, maximum 500 characters, no HTML/script tags
- Character counters displayed in real-time during input

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **TanStack Query** - Data fetching and caching
- **Wouter** - Lightweight routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **In-Memory Storage** - Fast data persistence

## Project Structure

```
├── client/                  # Frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── task-modal.tsx
│   │   │   ├── delete-task-dialog.tsx
│   │   │   └── pagination.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── tasks.tsx
│   │   │   └── audit-logs.tsx
│   │   ├── lib/             # Utilities
│   │   │   └── queryClient.ts
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Global styles
│   └── index.html
│
├── server/                  # Backend application
│   ├── controllers/         # Request handlers
│   │   ├── taskController.ts
│   │   └── logController.ts
│   ├── middleware/          # Express middleware
│   │   └── auth.ts          # Basic Auth
│   ├── utils/               # Utility functions
│   │   └── sanitize.ts      # Input sanitization
│   ├── storage.ts           # In-memory storage
│   ├── routes.ts            # API routes
│   └── index.ts             # Server entry point
│
├── shared/                  # Shared types and schemas
│   └── schema.ts            # Zod schemas and TypeScript types
│
├── design_guidelines.md     # UI/UX design specifications
└── README.md
```

## API Endpoints

All API endpoints require Basic Authentication with credentials:
- **Username**: `admin`
- **Password**: `password123`

### Task Endpoints

#### Get All Tasks
```
GET /api/tasks
Response: Task[]
```

#### Get Single Task
```
GET /api/tasks/:id
Response: Task
```

#### Create Task
```
POST /api/tasks
Body: { title: string, description: string }
Response: Task
```

#### Update Task
```
PUT /api/tasks/:id
Body: { title: string, description: string }
Response: Task
```

#### Delete Task
```
DELETE /api/tasks/:id
Response: 204 No Content
```

### Audit Log Endpoints

#### Get All Audit Logs
```
GET /api/logs
Response: AuditLog[]
```

## Setup and Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation Steps

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd task-manager-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   This command starts both:
   - **Backend**: Express server on port 5000
   - **Frontend**: Vite dev server on port 5173

4. **Access the application**
   - Open your browser and navigate to: `http://localhost:5173`
   - The API is available at: `http://localhost:5000/api`

## Usage Guide

### Navigating the Application

1. **Sidebar Navigation**
   - Click "Tasks" to view and manage tasks
   - Click "Audit Logs" to view the activity history
   - Click the hamburger menu icon to collapse/expand the sidebar

2. **Managing Tasks**

   **Create a Task:**
   - Click the "Create Task" button
   - Enter a title (required, max 100 characters)
   - Enter a description (optional, max 500 characters)
   - Click "Save Task"

   **Edit a Task:**
   - Click the pencil icon next to the task you want to edit
   - Update the title and/or description
   - Click "Update Task"

   **Delete a Task:**
   - Click the trash icon next to the task you want to delete
   - Confirm the deletion in the dialog

3. **Search and Filter**
   - Use the search bar to filter tasks by title or description
   - Results update in real-time as you type
   - Pagination resets to page 1 when searching

4. **Pagination**
   - Navigate through pages using the Previous/Next buttons
   - Click page numbers to jump directly to a specific page
   - View the current range of items displayed (e.g., "Showing 1 to 5 of 42 items")

5. **Viewing Audit Logs**
   - Navigate to "Audit Logs" from the sidebar
   - View timestamped records of all task operations
   - See color-coded action badges (Create/Update/Delete)
   - Review what content was changed in each operation

## Authentication

The application uses HTTP Basic Authentication to protect all API endpoints.

**Default Credentials:**
- **Username**: `admin`
- **Password**: `password123`

The frontend automatically includes these credentials in all API requests. If you're testing the API directly (e.g., with Postman or curl), you'll need to include the Basic Auth header.

### Example API Request (curl)
```bash
curl -X GET http://localhost:5000/api/tasks \
  -u admin:password123
```

## Data Model

### Task
```typescript
{
  id: number;
  title: string;        // Max 100 characters
  description: string;  // Max 500 characters
  createdAt: string;    // ISO 8601 timestamp
}
```

### Audit Log
```typescript
{
  id: number;
  timestamp: string;        // ISO 8601 timestamp
  action: "Create" | "Update" | "Delete";
  taskId: number;
  updatedContent: string | null;  // Details of what changed
  notes: string | null;
}
```

## Workflow

1. **User creates a task**
   - Frontend validates input (character limits, no HTML/scripts)
   - Backend receives request with Basic Auth
   - Backend validates and sanitizes input
   - Task is created in storage
   - Audit log is automatically created
   - Frontend updates the task list and shows success message

2. **User edits a task**
   - Similar validation flow as creation
   - Backend compares old and new values
   - Audit log records what changed
   - Frontend updates UI and shows confirmation

3. **User deletes a task**
   - Confirmation dialog prevents accidental deletion
   - Task is removed from storage
   - Audit log records the deletion with task ID
   - Frontend updates UI

4. **User views audit logs**
   - All historical operations are displayed
   - Color coding helps identify operation types
   - Details show exactly what was modified

## Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build the application for production
- `npm run start` - Start the production server

### Development Tips

1. **Frontend runs on port 5173** - Vite development server
2. **Backend runs on port 5000** - Express server
3. **Hot reload is enabled** - Changes automatically reflect in the browser
4. **Data is in-memory** - Restarting the server clears all data
5. **CORS is configured** - Frontend can communicate with backend seamlessly

## Security Features

- ✅ Basic Authentication on all API endpoints
- ✅ Input validation using Zod schemas
- ✅ HTML/script tag sanitization
- ✅ Prevention of XSS attacks
- ✅ Secure credential handling

## Future Enhancements

Potential improvements for future versions:

- 🗄️ **Persistent Database** - Migrate from in-memory to PostgreSQL
- 👥 **User Management** - Multi-user support with JWT authentication
- 🏷️ **Task Categories** - Organize tasks by projects or tags
- 📅 **Due Dates** - Add deadline tracking
- 🔔 **Notifications** - Email or push notifications
- 📊 **Analytics Dashboard** - Task completion metrics
- 🎨 **Themes** - Light mode and custom color schemes
- 📤 **Export** - Download tasks and logs as CSV/JSON
- 🔄 **Task Assignment** - Assign tasks to team members
- ✅ **Task Status** - Track progress (To Do, In Progress, Done)

## Troubleshooting

### Application won't start
- Ensure Node.js 20.x or higher is installed
- Run `npm install` to install dependencies
- Check if ports 5000 and 5173 are available

### API returns 401 Unauthorized
- Verify Basic Auth credentials are correct
- Check browser console for authentication errors

### Changes not appearing
- Clear browser cache and reload
- Restart the development server
- Check browser console for errors

### Pagination issues
- Search query resets pagination to page 1
- Total pages update based on filtered results

## License

This project is provided as-is for educational and development purposes.

## Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

---

**Version**: 1.0  
**Last Updated**: 2025
