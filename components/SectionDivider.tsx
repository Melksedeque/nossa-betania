export function SectionDivider({ space = 'my-0' }: { space?: string }) {
  return (
    <div className={`w-full h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent ${space}`} />
  );
}
