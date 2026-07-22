import type { HTMLAttributes } from 'react';

export default function Panel({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={className} />;
}
