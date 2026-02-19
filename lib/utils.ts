import { clsx, type ClassValue } from 'clsx';
import { addDays, startOfWeek } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mondayOf(date: Date) {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function shiftWeek(date: Date, amount: number) {
  return addDays(mondayOf(date), amount * 7);
}

export function centsToDollars(cents: number) {
  return (cents / 100).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
}
