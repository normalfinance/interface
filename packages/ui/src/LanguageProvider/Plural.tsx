export function Plural({ value, one, other }: { value: number; one: string; other: string }) {
    const children = value === 1 ? one : other;
    if (process.env.VERCEL_ENV === 'test') {
      return <>{children}</>;
    }
    // ensures it re-renders when language changes
    return <Translation>{() => children}</Translation>;
  }