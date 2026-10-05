'use client';

import React, { useState } from 'react';
import { SiteContent } from '@/lib/types';
import { Upload, Check, RefreshCw, Video } from 'lucide-react';

interface ContentManagementClientProps {
  initialContent: SiteContent;
}

export function ContentManagementClient({
  initialContent,
}: ContentManagementClientProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'heritage' | 'map' | 'footer'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Hero fields
  const [heroTagline, setHeroTagline] = useState(content.hero.tagline);
  const [heroSubheading, setHeroSubheading] = useState(content.hero.subheading);
  const [heroCtaText, setHeroCtaText] = useState(content.hero.ctaText);
  const [heroSpeed, setHeroSpeed] = useState(content.hero.speedSeconds);

  // About fields
  const [aboutHeading, setAboutHeading] = useState(content.about.heading);
  const [aboutSubheading, setAboutSubheading] = useState(content.about.subheading);
  const [aboutBody, setAboutBody] = useState(content.about.bodyParagraphs.join('\n\n'));
  const [aboutVideoUrl, setAboutVideoUrl] = useState(content.about.videoUrl);
  const [aboutPoster, setAboutPoster] = useState(content.about.videoPoster);
  const [aboutAutoplay, setAboutAutoplay] = useState(content.about.autoplay);
  const [aboutLoop, setAboutLoop] = useState(content.about.loop);
  const [aboutMuted, setAboutMuted] = useState(content.about.muted);

  // Map fields
  const [mapHeading, setMapHeading] = useState(content.map.heading);
  const [mapSubheading, setMapSubheading] = useState(content.map.subheading);
  const [mapOriginName, setMapOriginName] = useState(content.map.originName);
  const [mapOriginDetail, setMapOriginDetail] = useState(content.map.originDetail);
  const [mapDestName, setMapDestName] = useState(content.map.destinationName);
  const [mapDestDetail, setMapDestDetail] = useState(content.map.destinationDetail);

  // Footer fields
  const [footerPhone, setFooterPhone] = useState(content.footer.phone);
  const [footerEmail, setFooterEmail] = useState(content.footer.email);
  const [footerHours, setFooterHours] = useState(content.footer.hours);
  const [footerCopyright, setFooterCopyright] = useState(content.footer.copyright);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'about');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setAboutVideoUrl(data.url);
        setStatusMessage('Video uploaded and set as active!');
      } else {
        alert(data.error || 'Video upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    const updatedContent: SiteContent = {
      ...content,
      hero: {
        tagline: heroTagline.trim(),
        subheading: heroSubheading.trim(),
        ctaText: heroCtaText.trim(),
        speedSeconds: Number(heroSpeed) || 70,
      },
      about: {
        heading: aboutHeading.trim(),
        subheading: aboutSubheading.trim(),
        bodyParagraphs: aboutBody
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean),
        videoUrl: aboutVideoUrl.trim(),
        videoPoster: aboutPoster.trim(),
        autoplay: aboutAutoplay,
        loop: aboutLoop,
        muted: aboutMuted,
      },
      map: {
        heading: mapHeading.trim(),
        subheading: mapSubheading.trim(),
        originName: mapOriginName.trim(),
        originDetail: mapOriginDetail.trim(),
        destinationName: mapDestName.trim(),
        destinationDetail: mapDestDetail.trim(),
      },
      footer: {
        ...content.footer,
        phone: footerPhone.trim(),
        email: footerEmail.trim(),
        hours: footerHours.trim(),
        copyright: footerCopyright.trim(),
      },
    };

    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
      });

      if (res.ok) {
        setContent(updatedContent);
        setStatusMessage('Website marketing content successfully updated!');
      } else {
        alert('Failed to save CMS updates.');
      }
    } catch {
      alert('Error connecting to CMS service.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="border-b border-[#763C1E]/15 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#763C1E]/60 block mb-1">
            Content Management System (CMS)
          </span>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#502813]">
            Editorial & Media Control
          </h1>
        </div>

        {statusMessage && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#763C1E]/20 gap-2">
        {[
          { id: 'hero', label: '01 — Hero & Motion' },
          { id: 'about', label: '02 — About & Video' },
          { id: 'map', label: '03 — Geographic Map' },
          { id: 'footer', label: '04 — Contact & Footer' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 text-xs font-bold font-mono uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#763C1E] text-[#763C1E] bg-white'
                : 'border-transparent text-[#763C1E]/60 hover:text-[#763C1E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main CMS Form */}
      <form onSubmit={handleSaveAll} className="bg-white border border-[#763C1E]/15 p-8 space-y-8 shadow-xs">
        {/* Tab 1: Hero */}
        {activeTab === 'hero' && (
          <div className="space-y-6 text-xs font-sans">
            <h3 className="text-base font-bold uppercase tracking-tight text-[#502813]">
              Hero Section Settings
            </h3>

            <div>
              <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                Tagline
              </label>
              <input
                type="text"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                Subheading
              </label>
              <input
                type="text"
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Order Button Text
                </label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={(e) => setHeroCtaText(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Hypnotic Rotation Cycle (Seconds)
                </label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={heroSpeed}
                  onChange={(e) => setHeroSpeed(Number(e.target.value))}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-mono"
                />
                <span className="text-[10px] text-[#763C1E]/60 block mt-1">
                  Default: 70 seconds. Controls speed of circular doi continuous rotation.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: About & Video */}
        {activeTab === 'about' && (
          <div className="space-y-6 text-xs font-sans">
            <h3 className="text-base font-bold uppercase tracking-tight text-[#502813]">
              About Section & Craft Video Settings
            </h3>

            <div>
              <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                About Heading
              </label>
              <input
                type="text"
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                About Subheading
              </label>
              <input
                type="text"
                value={aboutSubheading}
                onChange={(e) => setAboutSubheading(e.target.value)}
                className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                Editorial Paragraphs (Separate paragraphs with double enter)
              </label>
              <textarea
                rows={5}
                value={aboutBody}
                onChange={(e) => setAboutBody(e.target.value)}
                className="w-full border border-[#763C1E]/30 p-2.5 text-sm leading-relaxed"
              />
            </div>

            <div className="border border-[#763C1E]/20 bg-[#FFF9E6]/30 p-4 space-y-4">
              <span className="font-bold uppercase tracking-wider text-[#502813] block">
                Video Asset Controls
              </span>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1">
                  Video File URL / Path
                </label>
                <input
                  type="text"
                  value={aboutVideoUrl}
                  onChange={(e) => setAboutVideoUrl(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-mono"
                />
              </div>

              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 border border-[#763C1E] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#763C1E] hover:text-[#FCE08B] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload & Replace Video (MP4 / WebM)</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
                {isUploading && (
                  <span className="text-[10px] text-[#763C1E] font-mono ml-3">
                    Uploading video file...
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-xs">
                  <input
                    type="checkbox"
                    checked={aboutLoop}
                    onChange={(e) => setAboutLoop(e.target.checked)}
                    className="accent-[#763C1E] w-4 h-4"
                  />
                  <span>Loop Playback</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-xs">
                  <input
                    type="checkbox"
                    checked={aboutMuted}
                    onChange={(e) => setAboutMuted(e.target.checked)}
                    className="accent-[#763C1E] w-4 h-4"
                  />
                  <span>Mute Audio Initially</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold uppercase text-xs">
                  <input
                    type="checkbox"
                    checked={aboutAutoplay}
                    onChange={(e) => setAboutAutoplay(e.target.checked)}
                    className="accent-[#763C1E] w-4 h-4"
                  />
                  <span>Autoplay (Muted)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Geographic Map */}
        {activeTab === 'map' && (
          <div className="space-y-6 text-xs font-sans">
            <h3 className="text-base font-bold uppercase tracking-tight text-[#502813]">
              Geographic Map Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Origin Title
                </label>
                <input
                  type="text"
                  value={mapOriginName}
                  onChange={(e) => setMapOriginName(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Destination Title
                </label>
                <input
                  type="text"
                  value={mapDestName}
                  onChange={(e) => setMapDestName(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Origin Description
                </label>
                <input
                  type="text"
                  value={mapOriginDetail}
                  onChange={(e) => setMapOriginDetail(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Destination Description
                </label>
                <input
                  type="text"
                  value={mapDestDetail}
                  onChange={(e) => setMapDestDetail(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Contact & Footer */}
        {activeTab === 'footer' && (
          <div className="space-y-6 text-xs font-sans">
            <h3 className="text-base font-bold uppercase tracking-tight text-[#502813]">
              Contact Details & Footer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={footerPhone}
                  onChange={(e) => setFooterPhone(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className="w-full border border-[#763C1E]/30 p-2.5 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                Operating & Dispatch Hours
              </label>
              <input
                type="text"
                value={footerHours}
                onChange={(e) => setFooterHours(e.target.value)}
                className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block font-mono uppercase text-[#763C1E] mb-1 font-bold">
                Copyright String
              </label>
              <input
                type="text"
                value={footerCopyright}
                onChange={(e) => setFooterCopyright(e.target.value)}
                className="w-full border border-[#763C1E]/30 p-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="pt-6 border-t border-[#763C1E]/15 flex items-center justify-between">
          <span className="text-xs font-mono text-[#763C1E]/60">
            Changes save immediately to the live storefront
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[#763C1E] text-[#FCE08B] font-bold uppercase tracking-wider text-xs hover:bg-[#502813] transition-colors"
          >
            {isSaving ? 'Updating Storefront...' : 'Publish Content Updates'}
          </button>
        </div>
      </form>
    </div>
  );
}
