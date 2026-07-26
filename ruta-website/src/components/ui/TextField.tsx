import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> & {
  label: string;
  /** Optional leading glyph rendered inside the field. */
  icon?: ReactNode;
  /** Optional control aligned to the right of the label, e.g. a "Forgot password?" link. */
  labelAction?: ReactNode;
};

/**
 * Labelled text input: 56px tall, 12px radius, slate-50 fill with a slate-200
 * hairline. The label is bound to the input via a generated id so clicking it
 * focuses the field and screen readers announce the pair.
 */
export default function TextField({ label, icon, labelAction, ...inputProps }: TextFieldProps) {
  const id = useId();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-bold text-slate-600">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center text-slate-400">
            {icon}
          </span>
        ) : null}
        <input
          {...inputProps}
          id={id}
          className={`h-14 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 text-base text-slate-900 transition placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60 ${icon ? 'pl-11' : 'pl-4'}`}
        />
      </div>
    </div>
  );
}
