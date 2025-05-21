'use client';

import { useState, useEffect } from 'react';
import PrimaryButton from '@/components/button/primary-button';
import SecondaryButton from '@/components/button/secondary-button';
import { DataTable } from '@/components/ui/data-table';
import Modal from '@/components/modal';
import { toast } from 'react-hot-toast';
import type { CellValue } from '@/components/ui/data-table';

interface Config {
  id: string;
  key: string;
  value: string;
  type: 'STRING' | 'BOOLEAN' | 'NUMBER' | 'DATE' | 'JSON';
  updatedAt: string;
}

type ConfigType = 'STRING' | 'BOOLEAN' | 'NUMBER' | 'DATE' | 'JSON';

// Add new helper functions for value handling
const formatValueForDisplay = (value: string, type: ConfigType): string => {
  try {
    switch (type) {
      case 'JSON':
        return JSON.stringify(JSON.parse(value), null, 2);
      case 'BOOLEAN':
        return value.toLowerCase() === 'true' ? 'Yes' : 'No';
      default:
        return value;
    }
  } catch {
    return value;
  }
};

const validateAndFormatValue = (value: string, type: ConfigType): string => {
  try {
    switch (type) {
      case 'JSON':
        return JSON.stringify(JSON.parse(value));
      case 'BOOLEAN':
        return value.toLowerCase() === 'true' || value.toLowerCase() === 'yes' ? 'true' : 'false';
      case 'NUMBER':
        return isNaN(Number(value)) ? value : Number(value).toString();
      case 'DATE':
        return new Date(value).toISOString();
      default:
        return value;
    }
  } catch {
    return value;
  }
};

export default function ConfigSettingsPage() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<Config | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    type: 'STRING' as ConfigType,
  });

  const columns = [
    { header: 'Key', accessorKey: 'key' as const },
    {
      header: 'Value',
      accessorKey: 'value' as const,
      cell: (value: CellValue, row: Config) => formatValueForDisplay(value as string, row.type)
    },
    { header: 'Type', accessorKey: 'type' as const },
    {
      header: 'Last Updated',
      accessorKey: 'updatedAt' as const,
      cell: (value: CellValue) => value ? new Date(value as string).toLocaleString() : '',
    },
    {
      header: 'Actions',
      accessorKey: 'id' as const,
      cell: (value: CellValue, row: Config) => (
        <div className="flex space-x-2">
          <SecondaryButton
            onClick={() => handleEdit(row)}
            className="text-sm"
          >
            Edit
          </SecondaryButton>
          <SecondaryButton
            onClick={() => handleDelete(value as string)}
            className="text-sm bg-red-500 hover:bg-red-600 text-white border-red-800"
          >
            Delete
          </SecondaryButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/config');
      const data = await response.json();
      setConfigs(data);
    } catch (err: unknown) {
      console.error('Error fetching configs:', err);
      toast.error('Failed to fetch config settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = editingConfig
        ? `/api/admin/config/${editingConfig.id}`
        : '/api/admin/config';

      const method = editingConfig ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save config');

      toast.success(`Config ${editingConfig ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchConfigs();
      resetForm();
    } catch (err: unknown) {
      console.error('Error saving config:', err);
      toast.error('Failed to save config setting');
    }
  };

  const handleDelete = async (id: string) => {
    setConfigToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!configToDelete) return;

    try {
      const response = await fetch(`/api/admin/config/${configToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete config');

      toast.success('Config deleted successfully');
      fetchConfigs();
    } catch (err: unknown) {
      console.error('Error deleting config:', err);
      toast.error('Failed to delete config setting');
    } finally {
      setIsDeleteModalOpen(false);
      setConfigToDelete(null);
    }
  };

  const handleEdit = (config: Config) => {
    setEditingConfig(config);
    setFormData({
      key: config.key,
      value: config.value,
      type: config.type,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      key: '',
      value: '',
      type: 'STRING',
    });
    setEditingConfig(null);
  };

  const handleModalSubmit = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Config Settings</h1>
        <PrimaryButton onClick={() => setIsModalOpen(true)}>
          Add New Config
        </PrimaryButton>
      </div>

      <DataTable
        columns={columns}
        data={configs}
        isLoading={isLoading}
        emptyMessage="No configuration settings found. Click 'Add New Config' to create one."
      />

      {isDeleteModalOpen && (
        <Modal
          message={
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this configuration? This action cannot be undone.
              </p>
            </div>
          }
          closeModal={() => {
            setIsDeleteModalOpen(false);
            setConfigToDelete(null);
          }}
          onSubmit={confirmDelete}
        />
      )}

      {isModalOpen && (
        <Modal
          className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-xl w-full"
          message={
            <form id="configForm" onSubmit={handleSubmit} className="text-base space-y-6">
              <h2 className="text-gray-800 mb-4 font-semibold">
                {editingConfig ? 'Edit Config' : 'Add New Config'}
              </h2>
              <div>
                <label className="block text-sm text-gray-600 mb-1 font-normal">Key</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="Enter config key"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md outline-none font-normal"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 font-normal">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value as ConfigType;
                    setFormData({
                      ...formData,
                      type: newType,
                      value: validateAndFormatValue(formData.value, newType)
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md outline-none font-normal"
                >
                  <option value="STRING">String</option>
                  <option value="BOOLEAN">Boolean</option>
                  <option value="NUMBER">Number</option>
                  <option value="DATE">Date</option>
                  <option value="JSON">JSON</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 font-normal">Value</label>
                {formData.type === 'BOOLEAN' ? (
                  <select
                    value={formData.value.toLowerCase() === 'true' ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md outline-none font-normal"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : formData.type === 'JSON' ? (
                  <textarea
                    value={formatValueForDisplay(formData.value, 'JSON')}
                    onChange={(e) => {
                      try {
                        const formatted = JSON.stringify(JSON.parse(e.target.value));
                        setFormData({ ...formData, value: formatted });
                      } catch {
                        setFormData({ ...formData, value: e.target.value });
                      }
                    }}
                    placeholder="Enter JSON value"
                    required
                    rows={6}
                    className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm outline-none font-normal"
                  />
                ) : formData.type === 'DATE' ? (
                  <input
                    type="datetime-local"
                    value={formData.value ? new Date(formData.value).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, value: new Date(e.target.value).toISOString() })}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md outline-none font-normal"
                  />
                ) : formData.type === 'NUMBER' ? (
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter number value"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md outline-none font-normal"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="Enter string value"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md outline-none font-normal"
                  />
                )}
              </div>
            </form>
          }
          closeModal={() => {
            setIsModalOpen(false);
            resetForm();
          }}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}