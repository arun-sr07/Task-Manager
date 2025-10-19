import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/pagination";
import type { AuditLog } from "@shared/schema";

const ITEMS_PER_PAGE = 5;

const actionColors = {
  Create: "bg-success/15 text-success border-success/30",
  Update: "bg-warning/15 text-warning border-warning/30",
  Delete: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function AuditLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch audit logs
  const { data: logs = [], isLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/logs"],
  });

  // Paginate logs
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLogs = logs.slice(startIndex, endIndex);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all task modifications and changes
          </p>
        </div>

        {/* Audit Log Table */}
        <div className="bg-card border border-card-border rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[200px_140px_120px_1fr_100px] gap-4 px-4 py-3 bg-card border-b border-card-border">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Timestamp
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Action
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Task ID
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Updated Content
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Notes
            </div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="px-4 py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-sm text-muted-foreground mt-4">Loading audit logs...</p>
            </div>
          ) : paginatedLogs.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No audit logs yet. Actions will be tracked here.
              </p>
            </div>
          ) : (
            <div>
              {paginatedLogs.map((log, index) => (
                <div
                  key={log.id}
                  className={`grid grid-cols-[200px_140px_120px_1fr_100px] gap-4 px-4 py-3.5 hover-elevate transition-colors duration-150 ${
                    index !== paginatedLogs.length - 1 ? "border-b border-border" : ""
                  }`}
                  data-testid={`row-log-${log.id}`}
                >
                  <div className="text-sm text-muted-foreground" data-testid={`text-log-timestamp-${log.id}`}>
                    {formatTimestamp(log.timestamp)}
                  </div>
                  <div data-testid={`badge-action-${log.id}`}>
                    <Badge
                      variant="outline"
                      className={`${actionColors[log.action]} text-xs px-2.5 py-1 font-medium`}
                    >
                      {log.action} Task
                    </Badge>
                  </div>
                  <div className="font-mono text-sm text-muted-foreground" data-testid={`text-log-taskid-${log.id}`}>
                    #{log.taskId}
                  </div>
                  <div className="text-sm text-foreground truncate" data-testid={`text-log-content-${log.id}`}>
                    {log.updatedContent || "–"}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`text-log-notes-${log.id}`}>
                    {log.notes || "–"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && logs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={logs.length}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={startIndex}
            endIndex={Math.min(endIndex, logs.length)}
          />
        )}
      </div>
    </div>
  );
}
