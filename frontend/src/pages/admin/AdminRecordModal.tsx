import React from 'react';
import { X } from 'lucide-react';

export type AdminFieldType = 'text' | 'url' | 'email' | 'number' | 'textarea' | 'checkbox' | 'list' | 'select';

export interface AdminField {
  name: string;
  label: string;
  type?: AdminFieldType;
  required?: boolean;
  options?: string[];
  rows?: number;
}

interface AdminRecordModalProps {
  title: string;
  fields: AdminField[];
  values: Record<string, unknown>;
  onChange: (field: string, value: string | number | boolean | string[]) => void;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  submitLabel: string;
}

const inputClass = 'w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#00B87C]';

export const AdminRecordModal: React.FC<AdminRecordModalProps> = ({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onClose,
  submitLabel,
}) => (
  <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-[#0F1522] rounded-2xl border border-white/15 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button type="button" onClick={onClose} aria-label="Close editor" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => {
            const type = field.type ?? 'text';
            const value = values[field.name];
            const isWide = type === 'textarea' || type === 'list';

            if (type === 'checkbox') {
              return (
                <label key={field.name} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value === true}
                    onChange={(event) => onChange(field.name, event.target.checked)}
                    className="accent-[#00B87C] w-4 h-4"
                  />
                  {field.label}
                </label>
              );
            }

            return (
              <label key={field.name} className={`block ${isWide ? 'sm:col-span-2' : ''}`}>
                <span className="block text-xs font-semibold text-gray-300 mb-1">{field.label}</span>
                {type === 'textarea' || type === 'list' ? (
                  <textarea
                    rows={field.rows ?? (type === 'list' ? 4 : 3)}
                    required={field.required}
                    value={Array.isArray(value) ? value.join('\n') : String(value ?? '')}
                    onChange={(event) => onChange(
                      field.name,
                      type === 'list'
                        ? event.target.value.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
                        : event.target.value
                    )}
                    placeholder={type === 'list' ? 'Enter one item per line' : undefined}
                    className={`${inputClass} resize-y`}
                  />
                ) : type === 'select' ? (
                  <select
                    required={field.required}
                    value={String(value ?? '')}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    className={inputClass}
                  >
                    {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                ) : (
                  <input
                    type={type}
                    required={field.required}
                    value={String(value ?? '')}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    className={inputClass}
                  />
                )}
              </label>
            );
          })}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-lg bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold">{submitLabel}</button>
        </div>
      </form>
    </div>
  </div>
);
