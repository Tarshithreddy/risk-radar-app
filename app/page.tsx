"use client";

import { useState } from "react";

interface RiskPost {
  id: string;
  author: string;
  platform: string;
  content: string;
  urgencyScore: number;
  riskCategory: string;
  suggestedAction: string;
  status: "PENDING_REVIEW" | "APPROVED" | "ARCHIVED";
}

interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  author: string;
}

export default function Home() {
  const [posts, setPosts] = useState<RiskPost[]>([
    {
      id: "1",
      author: "@john_doe",
      platform: "Twitter",
      content: "CRITICAL: My account was hacked and unauthorized transactions were made! Help immediately!",
      urgencyScore: 95,
      riskCategory: "SECURITY_BREACH",
      suggestedAction: "Freeze account immediately and initiate security escalation workflow.",
      status: "PENDING_REVIEW",
    },
    {
      id: "2",
      author: "@tech_guru",
      platform: "LinkedIn",
      content: "The payment gateway has been throwing 500 server errors for the past 20 minutes.",
      urgencyScore: 82,
      riskCategory: "SERVICE_OUTAGE",
      suggestedAction: "Alert DevOps team and post status incident update on official channels.",
      status: "PENDING_REVIEW",
    },
    {
      id: "3",
      author: "User_4920",
      platform: "Customer Review",
      content: "Love the new UI update! The dark mode looks super crisp.",
      urgencyScore: 10,
      riskCategory: "GENERAL_FEEDBACK",
      suggestedAction: "Send automated thank you response.",
      status: "PENDING_REVIEW",
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<RiskPost | null>(null);
  const [editedAction, setEditedAction] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING_REVIEW" | "APPROVED" | "ARCHIVED">("ALL");

  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: "init-1",
      timestamp: "09:20 AM",
      action: "System initialized threat detection stream.",
      author: "System",
    },
  ]);

  const addLog = (action: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      action,
      author: "Agent (You)",
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleSelectPost = (post: RiskPost) => {
    setSelectedPost(post);
    setEditedAction(post.suggestedAction);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent,
          author: newAuthor || "@anonymous_user",
          platform: "Twitter",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => [data, ...prev]);
        addLog(`Analyzed post from ${data.author} (${data.riskCategory} - Urgency: ${data.urgencyScore}%)`);
        setNewContent("");
        setNewAuthor("");
      } else {
        alert(data.error || "Failed to analyze post");
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching backend analysis route.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, suggestedAction: editedAction, status: "APPROVED" }
          : post
      )
    );
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost((prev) =>
        prev ? { ...prev, suggestedAction: editedAction, status: "APPROVED" } : null
      );
    }
    const targetPost = posts.find((p) => p.id === id);
    if (targetPost) {
      addLog(`APPROVED customized action plan for ${targetPost.author}`);
    }
  };

  const handleArchive = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: "ARCHIVED" } : post))
    );
    if (selectedPost && selectedPost.id === id) {
      setSelectedPost((prev) => (prev ? { ...prev, status: "ARCHIVED" } : null));
    }
    const targetPost = posts.find((p) => p.id === id);
    if (targetPost) {
      addLog(`ARCHIVED post from ${targetPost.author}`);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "ALL") return true;
    return post.status === activeTab;
  });

  // Calculate top analytics metrics
  const pendingCount = posts.filter((p) => p.status === "PENDING_REVIEW").length;
  const criticalCount = posts.filter((p) => p.urgencyScore >= 80).length;
  const topCategory = posts.length > 0 ? posts[0].riskCategory : "NONE";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🚨 AI Customer Risk & Escalation Radar
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time threat monitoring & Human-in-the-Loop review dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Stream Active
            </span>
          </div>
        </header>

        {/* Top Analytics Metrics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Tracked</p>
            <p className="text-xl font-bold text-slate-100 mt-1">{posts.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase">Pending Review</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase">Critical Risks (&gt;80%)</p>
            <p className="text-xl font-bold text-red-400 mt-1">{criticalCount}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
            <p className="text-xs text-slate-400 font-semibold uppercase">Top Threat Type</p>
            <p className="text-sm font-bold text-blue-400 mt-2 truncate">{topCategory}</p>
          </div>
        </section>

        {/* Input Form Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold text-slate-300 mb-3">
            Simulate Social Media Input (Gemini AI Analysis)
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="@username"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Type any message (e.g. 'My payment was debited twice!')"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="md:col-span-3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-all disabled:opacity-50"
            >
              {loading ? "Analyzing with Gemini AI..." : "Analyze with Gemini AI"}
            </button>
          </form>
        </section>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {(["ALL", "PENDING_REVIEW", "APPROVED", "ARCHIVED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-slate-800 text-white border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Priority Risk Stream (Left 2 Columns) */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">
              Priority Risk Stream
            </h2>
            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-500 text-sm">
                  No posts found for filter: <span className="font-semibold">{activeTab}</span>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post)}
                    className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-all hover:border-slate-700 ${
                      selectedPost?.id === post.id
                        ? "border-blue-500 ring-1 ring-blue-500"
                        : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 text-sm">
                          {post.author}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          {post.platform}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full ${
                          post.urgencyScore > 80
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : post.urgencyScore > 50
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        Urgency: {post.urgencyScore}%
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 mb-3">{post.content}</p>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Category: <strong className="text-slate-400">{post.riskCategory}</strong></span>
                      <span
                        className={`font-semibold ${
                          post.status === "APPROVED"
                            ? "text-emerald-400"
                            : post.status === "ARCHIVED"
                            ? "text-slate-500"
                            : "text-amber-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Right Column: Verification Panel & Activity Log */}
          <div className="space-y-6">
            
            {/* Human Verification Panel */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg sticky top-6">
              <h2 className="text-base font-semibold text-slate-200 mb-3">
                Human Verification Panel
              </h2>

              {selectedPost ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Author & Platform
                    </label>
                    <p className="text-sm text-slate-200">{selectedPost.author} ({selectedPost.platform})</p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                      Message Content
                    </label>
                    <p className="text-sm bg-slate-950 p-2 rounded border border-slate-800 text-slate-300 mt-1">
                      "{selectedPost.content}"
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex justify-between">
                      <span>AI Suggested Resolution Plan</span>
                      <span className="text-[10px] text-blue-400 lowercase font-normal">(Editable)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={editedAction}
                      disabled={selectedPost.status !== "PENDING_REVIEW"}
                      onChange={(e) => setEditedAction(e.target.value)}
                      className="w-full bg-slate-950 p-2.5 rounded border border-slate-800 text-blue-300 text-xs mt-1 focus:outline-none focus:border-blue-500 disabled:opacity-70"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    {selectedPost.status === "PENDING_REVIEW" && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedPost.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg text-xs transition-all"
                        >
                          Approve Action
                        </button>
                        <button
                          onClick={() => handleArchive(selectedPost.id)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-3 py-2 rounded-lg text-xs transition-all"
                        >
                          Archive
                        </button>
                      </>
                    )}
                    {selectedPost.status !== "PENDING_REVIEW" && (
                      <span className="text-xs text-slate-400 italic">
                        Action already marked as {selectedPost.status}.
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-6 text-center">
                  Click any post from the priority stream to review details, edit resolution plans, and approve actions.
                </p>
              )}
            </section>

            {/* Audit Activity Log (History Watch) */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                📋 Agent Activity Audit Log
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                {logs.map((log) => (
                  <div key={log.id} className="border-b border-slate-800 pb-1.5">
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span>{log.author}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{log.action}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

        </div>

      </div>
    </main>
  );
}