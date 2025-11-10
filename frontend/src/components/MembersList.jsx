const MembersList = ({ workspaceId }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_ARI_CALL_URL}/workspaces/${workspaceId}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(res.data);
    };
    fetchMembers();
  }, [workspaceId]);

  return (
    <div>
      <h4>Team Members</h4>
      <ul>
        {members.map(m => <li key={m._id}>{m.name}</li>)}
      </ul>
    </div>
  );
};
