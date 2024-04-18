import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import Init from '@/components/ui/Init/Init';
import { BrainStackProvider } from './providers/brainstack';
import { TaskManagerProvider } from './providers/taskManager';
import TaskDisplayComponent from '@/components/ui/TaskManager/TaskDisplayComponent';

const meta = {
  title: 'Your Business Answers, Just a Conversation Away | iBrain',
  description: 'Empower your team with iBrain - intuitive AI assistant for dynamic language interaction, schema-aware data analysis, and effortless database integration.',
  cardImage: '/header.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://my.ibrain.one'
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: meta.title,
    description: meta.description,
    referrer: 'origin-when-cross-origin',
    keywords: ['iBrain', 'AI assistant', 'natural language interaction', 'database integration'],
    authors: [{ name: 'iBrain Team', url: 'https://my.ibrain.one' }],
    creator: 'iBrain',
    publisher: 'iBrain',
    robots: meta.robots,
    icons: { icon: meta.favicon },
    metadataBase: new URL(meta.url),
    openGraph: {
      url: meta.url,
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage],
      type: 'website',
      siteName: 'iBrain'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@InfinisoftI',
      creator: '@InfinisoftI',
      title: meta.title,
      description: meta.description,
      images: [meta.cardImage]
    }
  };
}


export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-black loading">
        <BrainStackProvider>
          <TaskManagerProvider>
            <Navbar />
            <Init />
            <TaskDisplayComponent />
            <main
              id="skip"
              className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
            >
              {children}
            </main>
            <Footer />
            <Suspense>
              <Toaster />
            </Suspense>
          </TaskManagerProvider>
        </BrainStackProvider>
      </body>
    </html>
  );
}
