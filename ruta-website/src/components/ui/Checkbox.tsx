import { useId, type ReactNode } from 'react';
import { CheckIcon } from '@/components/icons';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  name?: string;
};

/**
 * 24px checkbox with a 4px radius. The native input is kept for keyboard and
 * screen-reader behaviour and restyled with `appearance-none`, rather than
 * being replaced by a div that would lose both.
 */
export default function Checkbox({ checked, onChange, children, name }: CheckboxProps) {
  const id = useId();

  return (
    <div className="flex items-start gap-3">
      <span className="relative grid h-6 w-6 shrink-0 place-items-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-slate-300 bg-white transition checked:border-blue-600 checked:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
        />
        <CheckIcon className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition peer-checked:opacity-100" />
      </span>
      <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-6 text-slate-500">
        {children}
      </label>
    </div>
  );
}
