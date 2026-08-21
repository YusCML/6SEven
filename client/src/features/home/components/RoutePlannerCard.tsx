import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/router';
import { ArrowsUpDownIcon, ChevronRightIcon, MapPinIcon, SearchIcon } from '@/components/icons';

type FieldProps = {
  label: string;
  icon: ReactNode;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

function Field({ label, icon, value, placeholder, onChange }: FieldProps) {
  const id = useId();

  return (
    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition hover:bg-slate-50">
      <span aria-hidden className="shrink-0 text-slate-400">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <label htmlFor={id} className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </label>
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full border-0 bg-transparent p-0 text-sm font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none"
        />
      </span>
    </div>
  );
}

export default function RoutePlannerCard() {
  const router = useRouter();
  const [origin, setOrigin] = useState('Manila City Hall');
  const [destination, setDestination] = useState('');

  const swap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push({ pathname: '/routes', query: { from: origin, to: destination } });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid items-center gap-1.5 rounded-xl border border-slate-100 bg-white p-1.5 shadow-[0_18px_38px_-14px_rgb(2_6_23/0.5)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto]"
    >
      <Field
        label="From"
        icon={<MapPinIcon className="h-4 w-3" />}
        value={origin}
        placeholder="Where from?"
        onChange={setOrigin}
      />

      <div className="flex items-center justify-center lg:px-1">
        <button
          type="button"
          onClick={swap}
          aria-label="Swap origin and destination"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
        >
          <ArrowsUpDownIcon className="h-3.5 w-3.5 lg:rotate-90" />
        </button>
      </div>

      <Field
        label="To"
        icon={<SearchIcon className="h-4 w-4" />}
        value={destination}
        placeholder="Where to?"
        onChange={setDestination}
      />

      <button
        type="submit"
        className="flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white shadow-[0_10px_22px_-8px_rgb(37_99_235/0.9)] transition hover:bg-blue-700 lg:h-11 lg:w-11 lg:px-0"
      >
        <span className="lg:sr-only">Find Best Ride</span>
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
