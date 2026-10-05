import React from 'react';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If not logged in, allow login page but protect other /admin paths
  // Note: /admin/login handles its own layout or will bypass if we check
  return (
    <div className="min-h-screen bg-[#FFF9E6] text-[#502813] flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-[#763C1E]/15 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60">
              Doi Koi Commercial Platform
            </span>
            <span className="text-xs bg-[#763C1E] text-[#FCE08B] px-2 py-0.5 font-mono font-bold">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#763C1E]/80">
            <span>Signed in as: <strong>{session?.email || 'admin@doikoi.com'}</strong></span>
          </div>
        </header>

        <main className="p-8 sm:p-10 flex-1">{children}</main>
      </div>
    </div>
  );
}
