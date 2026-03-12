'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { createClient } from '@/lib/supabase/client';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  tech_stack: string[];
  sort_order: number;
}

function SortableProjectRow({
  project,
  index,
  onEdit,
  onDelete,
}: {
  project: Project;
  index: number;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className='hover:bg-white/5 transition-colors bg-black'
    >
      <td className='px-6 py-4 text-gray-400 text-sm flex items-center gap-3'>
        <button
          {...attributes}
          {...listeners}
          className='text-gray-500 hover:text-white cursor-grab active:cursor-grabbing p-1 -ml-1'
          title='Drag to reorder'
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
        </button>
        {index + 1}
      </td>
      <td className='px-6 py-4'>
        <p className='text-white font-medium text-sm'>{project.title}</p>
        <p className='text-gray-500 text-xs mt-0.5 truncate max-w-xs'>
          {project.link_url}
        </p>
      </td>
      <td className='px-6 py-4 hidden lg:table-cell'>
        <div className='flex flex-wrap gap-1'>
          {project.tech_stack?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className='px-2 py-0.5 text-xs bg-white/5 text-gray-300 rounded-md'
            >
              {tech}
            </span>
          ))}
          {project.tech_stack?.length > 3 && (
            <span className='px-2 py-0.5 text-xs bg-white/5 text-gray-400 rounded-md'>
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className='px-6 py-4 text-gray-400 text-sm'>
        {project.sort_order}
      </td>
      <td className='px-6 py-4 text-right'>
        <div className='flex items-center justify-end gap-2'>
          <button
            onClick={() => onEdit(project)}
            className='p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors'
            title='Edit'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'/></svg>
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className='p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors'
            title='Delete'
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'/></svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    tech_stack: '',
    sort_order: 0,
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        // Ensure data is sorted by sort_order locally as well
        const sortedData = [...data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        setProjects(sortedData);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      
      const updatedProjects = newProjects.map((p: Project, index: number) => ({
        ...p,
        sort_order: index + 1,
      }));

      setProjects(updatedProjects);

      try {
        const res = await fetch('/api/projects/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            updatedProjects.map((p: Project) => ({ id: p.id, sort_order: p.sort_order }))
          ),
        });

        if (!res.ok) throw new Error('Failed to update order');
        toast.success('Order saved');
      } catch (error) {
        toast.error('Failed to save order');
        fetchProjects(); // Revert on failure
      }
    }
  };

  const resetForm = () => {
    const maxSortOrder = projects.length > 0 
      ? Math.max(...projects.map(p => p.sort_order || 0)) 
      : 0;

    setForm({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      tech_stack: '',
      sort_order: maxSortOrder + 1,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      link_url: project.link_url,
      tech_stack: project.tech_stack.join(', '),
      sort_order: project.sort_order,
    });
    setEditingProject(project);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.image_url) {
      toast.error('Image is required. Please upload an image.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        image_url: form.image_url,
        link_url: form.link_url,
        tech_stack: form.tech_stack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        sort_order: form.sort_order,
      };

      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProject ? 'Project updated successfully' : 'Project created successfully');
        resetForm();
        fetchProjects();
      } else {
        const error = await res.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Project deleted successfully');
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-white'>Projects</h1>
          <p className='text-gray-400 mt-1'>Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className='px-4 py-2.5 bg-white hover:bg-gray-200 text-black rounded text-sm font-medium transition-colors flex items-center gap-2'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 4v16m8-8H4'
            />
          </svg>
          Add Project
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-black border border-white/20 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-white/20'>
              <h2 className='text-xl font-bold text-white'>
                {editingProject ? 'Edit Project' : 'New Project'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Title *
                </label>
                <input
                  type='text'
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none'
                  placeholder='Project Title'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none resize-none'
                  placeholder='Project description...'
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Image (Upload) *
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className='w-full bg-transparent border border-white/20 rounded px-4 py-2 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all'
                  />
                  {uploadingImage && <p className='text-xs text-gray-400 mt-2'>Uploading...</p>}
                  {form.image_url && !uploadingImage && (
                    <div className='mt-3 relative w-full h-32 rounded border border-white/20 overflow-hidden bg-white/5'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Link URL *
                  </label>
                  <input
                    type='text'
                    required
                    value={form.link_url}
                    onChange={(e) =>
                      setForm({ ...form, link_url: e.target.value })
                    }
                    className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none'
                    placeholder='https://...'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Tech Stack (comma-separated)
                </label>
                <input
                  type='text'
                  value={form.tech_stack}
                  onChange={(e) =>
                    setForm({ ...form, tech_stack: e.target.value })
                  }
                  className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none'
                  placeholder='Next.js, React, TypeScript'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Sort Order
                </label>
                <input
                  type='number'
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none'
                />
              </div>
              <div className='flex gap-3 pt-4'>
                <button
                  type='submit'
                  disabled={saving}
                  className='flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors'
                >
                  {saving
                    ? 'Saving...'
                    : editingProject
                      ? 'Update Project'
                      : 'Create Project'}
                </button>
                <button
                  type='button'
                  onClick={resetForm}
                  className='px-4 py-2.5 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded text-sm font-medium transition-colors'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects Table */}
      <div className='rounded border border-white/20 bg-black overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto' />
            <p className='text-gray-400 mt-3 text-sm'>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className='p-12 text-center'>
            <p className='text-gray-400'>
              No projects yet. Click &quot;Add Project&quot; to get started.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-white/20'>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4'>
                    #
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4'>
                    Title
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4 hidden lg:table-cell'>
                    Tech Stack
                  </th>
                  <th className='text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4'>
                    Order
                  </th>
                  <th className='text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4'>
                    Actions
                  </th>
                </tr>
              </thead>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={projects.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className='divide-y divide-gray-800'>
                    {projects.map((project, index) => (
                      <SortableProjectRow
                        key={project.id}
                        project={project}
                        index={index}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </DndContext>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

