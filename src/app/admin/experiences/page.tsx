'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { createClient } from '@/lib/supabase/client';

interface Experience {
  id: string;
  company_logo: string;
  position: string;
  company: string;
  duration: string;
  description: string;
  sort_order: number;
}

function SortableExperienceCard({
  exp,
  onEdit,
  onDelete,
}: {
  exp: Experience;
  onEdit: (e: Experience) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: exp.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='rounded border border-white/20 bg-black p-6 hover:border-white/20 transition-colors flex items-start gap-4'
    >
      <button
        {...attributes}
        {...listeners}
        className='mt-1 p-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing -ml-2'
        title='Drag to reorder'
      >
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z' />
        </svg>
      </button>
      <div className='flex items-start justify-between flex-1 min-w-0'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-white font-semibold'>{exp.position}</h3>
            <span className='text-gray-500'>at</span>
            <span className='text-gray-300'>{exp.company}</span>
          </div>
          <p className='text-gray-400 text-sm mb-2'>{exp.duration}</p>
          <p className='text-gray-500 text-sm line-clamp-2'>
            {exp.description}
          </p>
        </div>
        <div className='flex items-center gap-2 ml-4'>
          <button
            onClick={() => onEdit(exp)}
            className='p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors'
            title='Edit'
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
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(exp.id)}
            className='p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors'
            title='Delete'
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
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Date states
  const [durationStart, setDurationStart] = useState('');
  const [durationEnd, setDurationEnd] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  // Form state
  const [form, setForm] = useState({
    company_logo: '',
    position: '',
    company: '',
    description: '',
    sort_order: 0,
  });

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experiences');
      const data = await res.json();
      if (Array.isArray(data)) {
        const sortedData = [...data].sort(
          (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
        );
        setExperiences(sortedData);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((e) => e.id === active.id);
      const newIndex = experiences.findIndex((e) => e.id === over.id);

      const newExperiences = arrayMove(experiences, oldIndex, newIndex);

      const updatedExperiences = newExperiences.map(
        (e: Experience, index: number) => ({
          ...e,
          sort_order: index + 1,
        }),
      );

      setExperiences(updatedExperiences);

      try {
        const res = await fetch('/api/experiences/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            updatedExperiences.map((e: Experience) => ({
              id: e.id,
              sort_order: e.sort_order,
            })),
          ),
        });

        if (!res.ok) throw new Error('Failed to update order');
        toast.success('Order saved');
      } catch (error) {
        toast.error('Failed to save order');
        fetchExperiences(); // Revert on failure
      }
    }
  };

  const resetForm = () => {
    const maxSortOrder =
      experiences.length > 0
        ? Math.max(...experiences.map((e) => e.sort_order || 0))
        : 0;

    setForm({
      company_logo: '',
      position: '',
      company: '',
      description: '',
      sort_order: maxSortOrder + 1,
    });
    setDurationStart('');
    setDurationEnd('');
    setIsCurrent(false);
    setEditingExperience(null);
    setShowForm(false);
  };

  const handleEdit = (experience: Experience) => {
    setForm({
      company_logo: experience.company_logo,
      position: experience.position,
      company: experience.company,
      description: experience.description,
      sort_order: experience.sort_order,
    });

    const formatToMonthInput = (str: string) => {
      if (!str || str === 'Present') return '';
      const date = new Date(str + ' 1');
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    };

    const parts = (experience.duration || '').split(' - ');
    if (parts.length > 0) {
      setDurationStart(formatToMonthInput(parts[0]));
      if (parts[1]) {
        if (parts[1] === 'Present') {
          setIsCurrent(true);
          setDurationEnd('');
        } else {
          setIsCurrent(false);
          setDurationEnd(formatToMonthInput(parts[1]));
        }
      } else {
        setIsCurrent(false);
        setDurationEnd('');
      }
    }

    setEditingExperience(experience);
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
      const filePath = `experiences/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, company_logo: data.publicUrl }));
      toast.success('Company logo uploaded successfully');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Error uploading image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.company_logo) {
      toast.error('Company logo is required. Please upload an image.');
      return;
    }

    setSaving(true);

    try {
      const url = editingExperience
        ? `/api/experiences/${editingExperience.id}`
        : '/api/experiences';
      const method = editingExperience ? 'PUT' : 'POST';

      const formatMonthYear = (val: string) => {
        if (!val) return '';
        const [year, month] = val.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
      };

      const startObj = formatMonthYear(durationStart);
      const endObj = isCurrent ? 'Present' : formatMonthYear(durationEnd);
      const finalDuration =
        startObj && endObj
          ? `${startObj} - ${endObj}`
          : startObj || 'Unknown Duration';

      const payload = { ...form, duration: finalDuration };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          editingExperience
            ? 'Experience updated successfully'
            : 'Experience created successfully',
        );
        resetForm();
        fetchExperiences();
      } else {
        const error = await res.json();
        toast.error(`Error: ${error.error}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save experience:', error);
      toast.error('Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Experience deleted successfully');
        fetchExperiences();
      } else {
        toast.error('Failed to delete experience');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-white'>Experiences</h1>
          <p className='text-gray-400 mt-1'>Manage your work experiences</p>
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
          Add Experience
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
          <div className='bg-black border border-white/20 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-white/20'>
              <h2 className='text-xl font-bold text-white'>
                {editingExperience ? 'Edit Experience' : 'New Experience'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Position *
                  </label>
                  <input
                    type='text'
                    required
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none'
                    placeholder='Software Engineer'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Company *
                  </label>
                  <input
                    type='text'
                    required
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none'
                    placeholder='Company Name'
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Company Logo (Upload) *
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className='w-full bg-transparent border border-white/20 rounded px-4 py-2 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all'
                  />
                  {uploadingImage && (
                    <p className='text-xs text-gray-400 mt-2'>Uploading...</p>
                  )}
                  {form.company_logo && !uploadingImage && (
                    <div className='mt-3 relative w-full h-32 rounded border border-white/20 overflow-hidden bg-white/5'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.company_logo}
                        alt='Preview'
                        className='w-full h-full object-contain'
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-1'>
                    Start Date *
                  </label>
                  <input
                    type='month'
                    required
                    value={durationStart}
                    onChange={(e) => setDurationStart(e.target.value)}
                    className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none'
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
              <div>
                <label className='flex text-sm font-medium text-gray-300 mb-1 justify-between'>
                  <span>End Date *</span>
                  <label className='flex items-center gap-2 cursor-pointer text-xs'>
                    <input
                      type='checkbox'
                      checked={isCurrent}
                      onChange={(e) => setIsCurrent(e.target.checked)}
                      className='rounded border-white/20 bg-transparent text-purple-600 focus:ring-purple-600 focus:ring-offset-black'
                    />
                    Current Job
                  </label>
                </label>
                <input
                  type='month'
                  required={!isCurrent}
                  disabled={isCurrent}
                  value={durationEnd}
                  onChange={(e) => setDurationEnd(e.target.value)}
                  className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none disabled:opacity-50'
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-1'>
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className='w-full bg-transparent border border-white/20 rounded px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-white focus:border-white outline-none resize-none'
                  placeholder='Describe your role and responsibilities...'
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
                  className='flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors'
                >
                  {saving
                    ? 'Saving...'
                    : editingExperience
                      ? 'Update Experience'
                      : 'Create Experience'}
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

      {/* Experiences List */}
      <div className='space-y-4'>
        {loading ? (
          <div className='rounded border border-white/20 bg-black p-8 text-center'>
            <div className='w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin mx-auto' />
            <p className='text-gray-400 mt-3 text-sm'>Loading experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className='rounded border border-white/20 bg-black p-12 text-center'>
            <p className='text-gray-400'>
              No experiences yet. Click &quot;Add Experience&quot; to get
              started.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={experiences.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {experiences.map((exp) => (
                <SortableExperienceCard
                  key={exp.id}
                  exp={exp}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
