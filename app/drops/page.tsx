import type { Metadata } from 'next';
import DropsPageClient from '@/components/DropsPageClient';

export const metadata: Metadata = {
  title: 'Limited Drops – AL SHOP',
};

export default function DropsPage() {
  return <DropsPageClient />;
}
