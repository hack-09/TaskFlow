const WorkspacePage = ({ workspaceId }) => {
  return (
    <div className="workspace-page flex">
      <div className="w-3/4">
        <TaskList workspaceId={workspaceId} />
      </div>
      <div className="w-1/4 p-4 bg-gray-200">
        <MembersList workspaceId={workspaceId} />
        <ActivityLog workspaceId={workspaceId} />
      </div>
    </div>
  );
};
