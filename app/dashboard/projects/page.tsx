"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Activity,
  ShieldAlert,
  Trash2,
  Edit2,
  FileCode,
  RotateCcw,
  AlertTriangle,
  X,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  language: string;
  repositoryUrl: string;
  healthScore: number;
  securityScore: number;
  fileCount: number;
  issuesCount: number;
  vulnerabilitiesCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLanguage, setFormLanguage] = useState("TypeScript");
  const [formRepoUrl, setFormRepoUrl] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to load projects");
      setProjects(data.projects);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Create Project
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Project name is required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim(),
          language: formLanguage,
          repositoryUrl: formRepoUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create project");

      setIsCreateOpen(false);
      resetForm();
      fetchProjects();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error creating project");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Edit/Rename Project
  const openEditModal = (project: ProjectItem) => {
    setActiveProject(project);
    setFormName(project.name);
    setFormDescription(project.description);
    setFormLanguage(project.language);
    setFormRepoUrl(project.repositoryUrl);
    setFormError(null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !formName.trim()) {
      setFormError("Project name is required.");
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError(null);
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim(),
          language: formLanguage,
          repositoryUrl: formRepoUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update project");

      setIsEditOpen(false);
      setActiveProject(null);
      resetForm();
      fetchProjects();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error updating project");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Project
  const openDeleteModal = (project: ProjectItem) => {
    setActiveProject(project);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!activeProject) return;

    try {
      setFormSubmitting(true);
      const res = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete project");

      setIsDeleteOpen(false);
      setActiveProject(null);
      fetchProjects();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete project");
    } finally {
      setFormSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormLanguage("TypeScript");
    setFormRepoUrl("");
    setFormError(null);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang =
      filterLanguage === "all" || p.language.toLowerCase() === filterLanguage.toLowerCase();
    return matchesSearch && matchesLang;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Project Management</h1>
            <Badge variant="info" size="sm">
              {filteredProjects.length} Repositories
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persisted in SQLite database via Prisma ORM. Create, rename, delete, and inspect codebases.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={fetchProjects}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
          >
            Create Project
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Database Error: {error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchProjects}>
            Retry
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border border-white/10 bg-[#0a0f1e]">
        <div className="flex items-center gap-2 w-full sm:w-80 px-3 py-1.5 rounded-lg border border-white/10 bg-[#070b14] text-xs text-slate-300 focus-within:border-cyan-500/50">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-xs text-slate-200 placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Language:
          </span>
          <select
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#070b14] text-xs text-slate-300 outline-none focus:border-cyan-500/50 font-mono"
          >
            <option value="all">All Languages</option>
            <option value="typescript">TypeScript</option>
            <option value="go">Go</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-56 rounded-xl border border-white/10 bg-[#0c1220] animate-pulse"
            />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-white/10">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? "No projects matched your search query. Try clearing filters."
              : "No projects in the database. Click 'Create Project' above to add your first codebase."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between p-5 border-white/10 bg-[#0c1220] hover:border-cyan-500/30 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="text-sm font-bold text-white hover:text-cyan-400 transition-colors"
                      >
                        {project.name}
                      </Link>
                      <p className="text-[10px] font-mono text-slate-500">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Badge variant="neutral" size="sm">
                    {project.language}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                  {project.description || "No description provided."}
                </p>

                {/* Health & Security Gauges */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded-lg bg-[#070b14] border border-white/5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-cyan-400" /> Health
                      </span>
                      <span className="font-mono font-bold text-cyan-400">
                        {project.healthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${project.healthScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#070b14] border border-white/5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-400" /> Security
                      </span>
                      <span className="font-mono font-bold text-rose-400">
                        {project.securityScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-rose-400 h-full rounded-full"
                        style={{ width: `${project.securityScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                  <FileCode className="w-3.5 h-3.5" />
                  {project.fileCount} files • {project.issuesCount} issues
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                    title="Edit / Rename Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(project)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button size="sm" variant="outline" className="text-xs py-1 px-2.5 ml-1">
                      Inspect
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1321] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                Create New Project
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Project Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. auth-gateway-service"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  placeholder="Briefly describe the microservice or library..."
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="Java">Java</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={formRepoUrl}
                    onChange={(e) => setFormRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Creating..." : "Save Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / RENAME MODAL */}
      {isEditOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1321] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-400" />
                Rename & Edit Project
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Project Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Language</label>
                  <select
                    value={formLanguage}
                    onChange={(e) => setFormLanguage(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                    <option value="Java">Java</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Repository URL</label>
                  <input
                    type="url"
                    value={formRepoUrl}
                    onChange={(e) => setFormRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-white/10 text-slate-200 outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-[#120e18] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Project</h3>
                <p className="text-[11px] text-slate-400">This action is irreversible.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white font-mono">{activeProject.name}</strong>? All associated
              files, issues, and security analyses will be cascaded and permanently removed.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteOpen(false)}
                disabled={formSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={formSubmitting}
              >
                {formSubmitting ? "Deleting..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
