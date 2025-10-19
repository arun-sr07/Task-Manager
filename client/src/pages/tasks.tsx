import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, Calendar, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TaskModal } from "@/components/task-modal";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { Pagination } from "@/components/pagination";
import type { Task } from "@shared/schema";

const ITEMS_PER_PAGE = 5;

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  });

  // Paginate filtered tasks
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your tasks with ease
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            data-testid="button-create-task"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        {/* Task Table */}
        <div className="bg-card border border-card-border rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_2fr_160px_120px] gap-4 px-4 py-3 bg-card border-b border-card-border">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ID
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Title
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Description
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Created At
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Actions
            </div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="px-4 py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-sm text-muted-foreground mt-4">Loading tasks...</p>
            </div>
          ) : paginatedTasks.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No tasks found matching your search" : "No tasks yet. Create your first task!"}
              </p>
            </div>
          ) : (
            <div>
              {paginatedTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`grid grid-cols-[80px_1fr_2fr_160px_120px] gap-4 px-4 py-3.5 hover-elevate transition-colors duration-150 ${
                    index !== paginatedTasks.length - 1 ? "border-b border-border" : ""
                  }`}
                  data-testid={`row-task-${task.id}`}
                >
                  <div className="font-mono text-sm text-muted-foreground" data-testid={`text-task-id-${task.id}`}>
                    #{task.id}
                  </div>
                  <div className="text-sm text-foreground font-medium truncate" data-testid={`text-task-title-${task.id}`}>
                    {task.title}
                  </div>
                  <div className="text-sm text-muted-foreground truncate" data-testid={`text-task-description-${task.id}`}>
                    {task.description}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid={`text-task-date-${task.id}`}>
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(task.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditClick(task)}
                      data-testid={`button-edit-${task.id}`}
                      className="h-8 px-2"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(task)}
                      data-testid={`button-delete-${task.id}`}
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredTasks.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTasks.length}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={startIndex}
            endIndex={Math.min(endIndex, filteredTasks.length)}
          />
        )}
      </div>

      {/* Modals */}
      <TaskModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
      />

      {editingTask && (
        <TaskModal
          open={true}
          onClose={() => setEditingTask(null)}
          mode="edit"
          task={editingTask}
        />
      )}

      {deletingTask && (
        <DeleteTaskDialog
          open={true}
          onClose={() => setDeletingTask(null)}
          task={deletingTask}
        />
      )}
    </div>
  );
}
