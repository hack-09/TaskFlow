const WorkspaceSidebar = ({ currentWorkspace, onSelectWorkspace }) => {
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}/workspaces`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkspaces(res.data);
    };
    fetchWorkspaces();
  }, []);

  return (
    <div className="workspace-sidebar">
      <h3>Workspaces</h3>
      <ul>
        <li
          className={!currentWorkspace ? "active" : ""}
          onClick={() => onSelectWorkspace(null)}
        >Personal</li>
        {workspaces.map(ws => (
          <li
            key={ws._id}
            className={currentWorkspace === ws._id ? "active" : ""}
            onClick={() => onSelectWorkspace(ws._id)}
          >
            {ws.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
