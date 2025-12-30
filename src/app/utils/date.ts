export interface DateRange {
  from?: string; // ISO
  to?: string;   // ISO
}

export const startOfMonth = (iso: string): string => {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
};

export const endOfMonth = (iso: string): string => {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
};

export const isWithinRange = (dateIso: string, range: DateRange): boolean => {
  if (range.from && dateIso < range.from) return false;
  if (range.to && dateIso > range.to) return false;
  return true;
};

export const todayIso = (): string => new Date().toISOString();

export const monthKey = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};









