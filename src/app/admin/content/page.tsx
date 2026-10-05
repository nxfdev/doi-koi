import React from 'react';
import { getSiteContent } from '@/lib/db';
import { ContentManagementClient } from '@/components/admin/ContentManagementClient';

export const revalidate = 0;

export default async function AdminContentPage() {
  const content = await getSiteContent();
  return <ContentManagementClient initialContent={content} />;
}
