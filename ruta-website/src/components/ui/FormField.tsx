import type { InputHTMLAttributes } from 'react';

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  labelClassName?: string;
  inputClassName?: string;
};

export default function FormField({
  label,
  labelClassName = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1',
  inputClassName = 'w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
  ...inputProps
}: FormFieldProps) {
  return (
    <div>
      <label className={labelClassName}>{label}</label>
      <input {...inputProps} className={inputClassName} />
    </div>
  );
}
