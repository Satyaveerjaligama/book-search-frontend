"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  PlusCircle,
  BookOpen,
  ArrowRight,
  Layers,
  Database,
  Zap,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/search-topic?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      router.push("/search-topic");
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-20 subtle-grid">
      <div className="max-w-5xl w-full mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Find Any Concept Across Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Book Library
            </span>
          </h1>

          {/* Quick Search Input */}
          <form
            onSubmit={handleQuickSearch}
            className="relative max-w-2xl mx-auto mt-4 group"
          >
            <div className="relative flex items-center rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl p-2 transition-all group-focus-within:border-indigo-500/80 group-focus-within:ring-4 group-focus-within:ring-indigo-500/20">
              <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search topics (e.g. 'Binary Search', 'React Hooks', 'Indexing')..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none px-2"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* 2 Main Portals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Card 1: Search Topic */}
          <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-transparent hover:from-indigo-500/50 hover:via-indigo-500/20 hover:to-transparent transition-all duration-300 shadow-xl">
            <div className="h-full rounded-[23px] bg-slate-900/90 backdrop-blur-xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                    <Search className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Search Topics
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Lookup concepts across books and sections. View results in an interactive data table or card grid, filter by volume, and copy entries.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    <span>Interactive table</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    <span>Filter by Book volume and Section</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    <span>One-click copy & fast retrieval</span>
                  </div>
                </div>
              </div>

              <Link
                href="/search-topic"
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-600 font-semibold text-sm transition-all duration-200 group-hover:shadow-lg group-hover:shadow-indigo-600/30"
              >
                <span>Topic Search</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Add Topic */}
          <div className="group relative rounded-3xl p-[1px] bg-gradient-to-b from-slate-700/50 via-slate-800/30 to-transparent hover:from-emerald-500/50 hover:via-emerald-500/20 hover:to-transparent transition-all duration-300 shadow-xl">
            <div className="h-full rounded-[23px] bg-slate-900/90 backdrop-blur-xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Add New Topic
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Contribute new topics to your database. Features an interactive form with quick presets and a live preview card that updates in real time.
                  </p>
                </div>

                <div className="space-y-2 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <span>Real-time visual catalog entry preview</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <span>One-click Book & Section quick selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <span>Instant database sync</span>
                  </div>
                </div>
              </div>

              <Link
                href="/add-topic"
                className="flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-600 font-semibold text-sm transition-all duration-200 group-hover:shadow-lg group-hover:shadow-emerald-600/30"
              >
                <span>Add New Topic</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center space-y-1">
            <div className="flex items-center justify-center text-indigo-400 mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">4 Volumes</div>
            <div className="text-xs text-slate-400">Indexed Multi-Books</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center space-y-1">
            <div className="flex items-center justify-center text-blue-400 mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">5 Sections</div>
            <div className="text-xs text-slate-400">Granular Organization</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center space-y-1">
            <div className="flex items-center justify-center text-emerald-400 mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">&lt; 50ms</div>
            <div className="text-xs text-slate-400">Fast Query Retrieval</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center space-y-1">
            <div className="flex items-center justify-center text-amber-400 mb-2">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">REST API</div>
            <div className="text-xs text-slate-400">Seamless Backend Sync</div>
          </div>
        </div>

      </div>
    </div>
  );
}
