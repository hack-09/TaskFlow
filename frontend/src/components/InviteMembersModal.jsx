const InviteMembersModal = ({ workspaceId, onClose }) => {
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_ARI_CALL_URL}/workspaces/${workspaceId}/invite`, { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <h4>Invite Member</h4>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
};
