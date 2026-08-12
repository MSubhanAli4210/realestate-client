import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function FormField({ label, ...props }: FormFieldProps) {
  return (
    <label className="block mb-5">
      <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">
        {label}
      </span>
      <input
        {...props}
        className="w-full border-b-2 border-ink/10 focus:border-brass outline-none py-2 text-ink placeholder:text-slate/40 transition-colors bg-transparent"
      />
    </label>
  );
}