"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Plus, Mail, Check, X, Trash2 } from "lucide-react";

export default function GroupsPage() {
  const {
    groups,
    groupMembers,
    fetchGroups,
    createGroup,
    inviteToGroup,
    respondToInvitation,
    deleteGroup,
  } = useAppStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [inviteData, setInviteData] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async () => {
    if (newGroup.name.trim()) {
      setLoading(true);
      try {
        await createGroup(newGroup.name, newGroup.description);
        setNewGroup({ name: "", description: "" });
        setShowCreateForm(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInvite = async (groupId: string) => {
    const email = inviteData[groupId];
    if (email && email.includes("@")) {
      setLoading(true);
      try {
        await inviteToGroup(groupId, email);
        setInviteData({ ...inviteData, [groupId]: "" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRespondInvite = async (
    groupId: string,
    memberId: string,
    approved: boolean,
  ) => {
    setLoading(true);
    try {
      await respondToInvitation(groupId, memberId, approved);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      setLoading(true);
      try {
        await deleteGroup(groupId);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-foreground">Groups</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage payment groups with friends
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2 bg-primary text-white font-medium btn-smooth hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>New Group</span>
        </Button>
      </div>

      {/* Create Group Form */}
      {showCreateForm && (
        <Card className="border border-border/40 bg-muted/30 p-6 smooth-transition">
          <h3 className="font-semibold text-foreground mb-5">Create Group</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Group Name
              </label>
              <Input
                placeholder="e.g., Friends Dinner"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                className="input-minimal text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Description
              </label>
              <Input
                placeholder="e.g., Monthly group lunch"
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
                className="input-minimal text-sm"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleCreateGroup}
                disabled={loading || !newGroup.name.trim()}
                className="bg-primary text-white font-medium btn-smooth hover:bg-primary/90"
              >
                Create
              </Button>
              <Button
                onClick={() => setShowCreateForm(false)}
                className="bg-muted text-foreground hover:bg-muted/80 font-medium smooth-transition"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Groups List */}
      {groups.length === 0 ? (
        <Card className="border border-border/40 p-12 text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="font-semibold text-foreground mb-1">No groups yet</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Create your first group to start splitting payments
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-primary text-white font-medium btn-smooth hover:bg-primary/90"
          >
            Create Group
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => {
            const members = groupMembers[group.id] || [];
            const approvedMembers = members.filter(
              (m) => m.status === "approved",
            ).length;
            const pendingMembers = members.filter(
              (m) => m.status === "pending",
            );

            return (
              <Card
                key={group.id}
                className="border border-border/40 p-6 smooth-transition hover:border-border/60"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 p-1.5 h-auto smooth-transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Members */}
                <div className="mb-4 pb-4 border-b border-border/30">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Members ({approvedMembers})
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {members
                      .filter((m) => m.status === "approved")
                      .map((member) => (
                        <div
                          key={member.id}
                          className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                        >
                          {member.user_id}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Invite Form */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Invite
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={inviteData[group.id] || ""}
                      onChange={(e) =>
                        setInviteData({
                          ...inviteData,
                          [group.id]: e.target.value,
                        })
                      }
                      className="input-minimal text-xs flex-1"
                    />
                    <Button
                      onClick={() => handleInvite(group.id)}
                      disabled={loading}
                      className="bg-primary text-white hover:bg-primary/90 font-medium btn-smooth h-auto px-3 py-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Pending Invitations */}
                {pendingMembers.length > 0 && (
                  <div className="pt-4 border-t border-border/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Pending ({pendingMembers.length})
                    </p>
                    <div className="space-y-2">
                      {pendingMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-muted-foreground">
                            {member.user_id}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              onClick={() =>
                                handleRespondInvite(group.id, member.id, true)
                              }
                              className="text-green-600 hover:bg-green-500/10 p-1.5 h-auto smooth-transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              onClick={() =>
                                handleRespondInvite(group.id, member.id, false)
                              }
                              className="text-destructive hover:bg-destructive/10 p-1.5 h-auto smooth-transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
