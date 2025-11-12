import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InviteMembersModal = () => {
  const {id} = useParams();
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_ARI_CALL_URL}/workspaces/${id}/invite`, { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
export default InviteMembersModal;
