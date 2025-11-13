import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { inviteMember, removeMember } from "../../service/api";
import { getWorkspaceDetails } from "../../service/workspaceService";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Trash2, 
  Crown, 
  User, 
  Loader2,
  Search,
  AlertTriangle,
  RefreshCw,
  Filter,
  MoreVertical
} from "lucide-react";
import { toast } from "react-hot-toast";

const WorkspaceMembers = () => {
  const { id } = useParams();
  const workspaceId = id;
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeMember, setActiveMember] = useState(null);

  // Fetch workspace details
  const fetchWorkspace = async () => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      const data = await getWorkspaceDetails(id);
      setWorkspace(data);
    } catch (err) {
      console.error("Failed to fetch workspace:", err);
      toast.error("Could not load workspace details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
    // eslint-disable-next-line
  }, [workspaceId]);

  // Invite new member by email
  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      setInviteLoading(true);
      const res = await inviteMember(workspaceId, inviteEmail);
      toast.success(res.data.message || "Invitation sent successfully!");
      setInviteEmail("");
      await fetchWorkspace();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
        "Failed to invite user. Please check the email address."
      );
    } finally {
      setInviteLoading(false);
    }
  };

  // Remove a member (admin only)
  const handleRemove = async (memberId) => {
    try {
      await removeMember(workspaceId, memberId);
      toast.success("Member removed successfully.");
      setDeleteConfirm(null);
      setActiveMember(null);
      await fetchWorkspace();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to remove member."
      );
    }
  };

  // Filter members based on search and role
  const filteredMembers = workspace?.members?.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) || [];

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Crown className="w-3 h-3 mr-1.5" />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <User className="w-3 h-3 mr-1.5" />
        Member
      </span>
    );
  };

  const getInitials = (name, email) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const getRandomColor = (str) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-teal-500 to-green-500'
    ];
    const index = str?.length % colors.length || 0;
    return colors[index];
  };

  // Confirmation Dialog Component
  const ConfirmationDialog = ({ isOpen, onClose, onConfirm, member }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform animate-scale-in">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Remove Member
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to remove {member?.name || member?.email} from the workspace?
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(member._id)}
                className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!workspaceId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
            No Workspace Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed">
            Please create or join a workspace to manage members and collaborate with your team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Team Members
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Manage collaborators in <span className="font-semibold text-gray-700 dark:text-gray-300">{workspace?.name || "your workspace"}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <button
              onClick={fetchWorkspace}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm flex-1 lg:flex-none justify-center"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {/* Invite Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invite Team Members
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send invitations to collaborate on this workspace
              </p>
            </div>
          </div>

          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Enter email address to invite..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={inviteLoading}
              className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm min-w-[140px] font-medium"
            >
              {inviteLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span className="text-sm">{inviteLoading ? "Sending..." : "Send Invite"}</span>
            </button>
          </form>
        </div>

        {/* Members List Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Team Members
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {workspace?.members?.length || 0} member{workspace?.members?.length !== 1 ? 's' : ''} in workspace
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-full sm:w-64 text-sm"
                  />
                </div>
                
                <div className="sm:hidden">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl w-full justify-center"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                  </button>
                </div>

                <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row gap-3`}>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admins</option>
                    <option value="member">Members</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Members Content */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading team members...</p>
              </div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                {searchTerm || roleFilter !== 'all' ? "No members found" : "No members yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                {searchTerm || roleFilter !== 'all' 
                  ? "Try adjusting your search or filters to find what you're looking for." 
                  : "Start by inviting team members to collaborate on your workspace."
                }
              </p>
              {(searchTerm || roleFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                    setShowFilters(false);
                  }}
                  className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMembers.map((member) => (
                <div
                  key={member._id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 group relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className={`w-12 h-12 bg-gradient-to-r ${getRandomColor(member.email)} rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                        {getInitials(member.name, member.email)}
                      </div>

                      {/* Member Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-1.5">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                            {member.name || "Unnamed User"}
                          </h3>
                          {getRoleBadge(member.role)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {workspace.role === "admin" && member.role !== "admin" && (
                        <>
                          {/* Desktop action */}
                          <button
                            onClick={() => setDeleteConfirm(member)}
                            className="hidden sm:flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                          
                          {/* Mobile action menu */}
                          <div className="sm:hidden relative">
                            <button
                              onClick={() => setActiveMember(activeMember === member._id ? null : member._id)}
                              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {activeMember === member._id && (
                              <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 py-2 min-w-[160px] animate-scale-in">
                                <button
                                  onClick={() => {
                                    setDeleteConfirm(member);
                                    setActiveMember(null);
                                  }}
                                  className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left text-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Remove Member</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {filteredMembers.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700/30">
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="mb-2 sm:mb-0">Showing {filteredMembers.length} of {workspace?.members?.length || 0} members</span>
                <span className="text-xs sm:text-sm">Only workspace admins can manage members</span>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleRemove}
          member={deleteConfirm}
        />

        {/* Backdrop for mobile menu */}
        {activeMember && (
          <div 
            className="fixed inset-0 z-40 sm:hidden"
            onClick={() => setActiveMember(null)}
          />
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WorkspaceMembers;