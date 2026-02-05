import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Save, GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';
import { getFormSchema, updateFormSchema } from '../services/api';

// Sortable Field Item Component
function SortableField({ field, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: field.name });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '10px',
    };

    return (
        <div ref={setNodeRef} style={style} className="field-card">
            <div className="field-drag-handle" {...attributes} {...listeners}>
                <GripVertical size={20} color="#94a3b8" />
            </div>
            <div className="field-info">
                <div className="field-header">
                    <span className="field-label">{field.label}</span>
                    {field.required && <span className="badge badge-error">Required</span>}
                    {field.conditional && <span className="badge badge-blue">Conditional</span>}
                </div>
                <div className="field-meta">
                    Type: <span className="font-mono">{field.type}</span> | Key: <span className="font-mono">{field.name}</span>
                </div>
            </div>
            <div className="field-actions">
                <button onClick={() => onEdit(field)} className="btn-icon">
                    <Edit2 size={18} />
                </button>
                <button onClick={() => onDelete(field.name)} className="btn-icon delete">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default function FormBuilder() {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingField, setEditingField] = useState(null); // Field being edited or 'new'
    const [tempField, setTempField] = useState({
        name: '', label: '', type: 'text', required: false, options: [], conditional: null
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadSchema();
    }, []);

    const loadSchema = async () => {
        try {
            // Note: Currently backend returns default schema via bypass, or DB schema.
            // Ideally backend serves the active schema.
            const schema = await getFormSchema();
            // Ensure elements is array
            const formElements = schema.elements || schema; // Fallback if direct array
            setElements(Array.isArray(formElements) ? formElements : []);
        } catch (error) {
            console.error('Error loading schema:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setElements((items) => {
                const oldIndex = items.findIndex((i) => i.name === active.id);
                const newIndex = items.findIndex((i) => i.name === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateFormSchema(elements);
            alert('Schema saved successfully!');
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save schema.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (name) => {
        if (confirm('Delete this field?')) {
            setElements(elements.filter(e => e.name !== name));
        }
    };

    const openEditor = (field = null) => {
        if (field) {
            setTempField({ ...field });
        } else {
            setTempField({
                name: `field_${Date.now()}`,
                label: 'New Field',
                type: 'text',
                required: false,
                options: []
            });
        }
        setEditingField(field ? 'edit' : 'new');
    };

    const saveField = () => {
        // Validation
        if (!tempField.name || !tempField.label) return alert("Name and Label required");

        if (editingField === 'new') {
            setElements([...elements, tempField]);
        } else {
            setElements(elements.map(e => e.name === tempField.name ? tempField : e));
        }
        setEditingField(null);
    };

    const handleOptionChange = (text) => {
        setTempField({ ...tempField, options: text.split(',').map(s => s.trim()) });
    };

    if (loading) return <div>Loading Builder...</div>;

    return (
        <div className="form-builder-layout">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Form Builder</h1>
                    <p className="page-subtitle">Design your registration form</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={() => openEditor(null)}>
                        <Plus size={18} />
                        Add Field
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Schema'}
                    </button>
                </div>
            </div>

            <div className="builder-container">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={elements.map(e => e.name)}
                        strategy={verticalListSortingStrategy}
                    >
                        {elements.map((field) => (
                            <SortableField
                                key={field.name}
                                field={field}
                                onEdit={openEditor}
                                onDelete={handleDelete}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Field Editor Modal/Panel */}
            {editingField && (
                <div className="editor-overlay">
                    <div className="editor-panel card">
                        <div className="editor-header">
                            <h3>{editingField === 'new' ? 'Add New Field' : 'Edit Field'}</h3>
                            <button className="btn-icon" onClick={() => setEditingField(null)}><X size={20} /></button>
                        </div>

                        <div className="form-group">
                            <label>Label</label>
                            <input
                                className="input"
                                value={tempField.label}
                                onChange={e => setTempField({ ...tempField, label: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Internal Name (Unique key)</label>
                            <input
                                className="input"
                                value={tempField.name}
                                onChange={e => setTempField({ ...tempField, name: e.target.value })}
                                disabled={editingField === 'edit'}
                            />
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select
                                className="input"
                                value={tempField.type}
                                onChange={e => setTempField({ ...tempField, type: e.target.value })}
                            >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                                <option value="textarea">Text Area</option>
                                <option value="select">Dropdown (Select)</option>
                                <option value="boolean">Switch (Yes/No)</option>
                            </select>
                        </div>

                        {tempField.type === 'select' && (
                            <div className="form-group">
                                <label>Options (comma separated)</label>
                                <input
                                    className="input"
                                    value={tempField.options?.join(', ') || ''}
                                    onChange={e => handleOptionChange(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                checked={tempField.required}
                                onChange={e => setTempField({ ...tempField, required: e.target.checked })}
                            />
                            <label>Required Field</label>
                        </div>

                        <div className="editor-footer">
                            <button className="btn btn-primary" onClick={saveField}>
                                <Check size={18} /> Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .builder-container {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .field-card {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 8px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: var(--shadow-sm);
                }
                .field-drag-handle {
                    cursor: grab;
                    padding: 4px;
                }
                .field-info {
                    flex: 1;
                }
                .field-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 4px;
                }
                .field-label {
                    font-weight: 600;
                    font-size: 1rem;
                }
                .field-actions {
                    display: flex;
                    gap: 8px;
                }
                .btn-icon {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text-muted);
                    padding: 6px;
                    border-radius: 4px;
                }
                .btn-icon:hover {
                    background: var(--bg-page);
                    color: var(--primary);
                }
                .btn-icon.delete:hover {
                    color: #ef4444;
                }
                .badge-error { background: #fee2e2; color: #991b1b; }
                .font-mono { font-family: monospace; font-size: 0.85em; color: var(--text-muted); }

                /* Editor Modal */
                .editor-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                }
                .editor-panel {
                    width: 500px;
                    max-width: 90vw;
                    border: none;
                    box-shadow: var(--shadow-md);
                }
                .editor-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                .form-group {
                    margin-bottom: 16px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    font-size: 0.9rem;
                }
                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .checkbox-group label { margin: 0; }
                .editor-footer {
                    margin-top: 24px;
                    display: flex;
                    justify-content: flex-end;
                }
            `}</style>
        </div>
    );
}
