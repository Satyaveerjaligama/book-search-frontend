"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  BookOpen,
  Layers,
  ArrowLeft,
  X,
  Copy,
  Check,
  Filter,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { BOOKS, SECTIONS, SAMPLE_TOPICS } from "@/utilities/constants";
import { searchTopicsApi, getApiBaseUrl } from "@/utilities/api";
import { TopicData } from "@/utilities/interfaces";

function SearchTopicContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [topic, setTopic] = useState<string>(initialQuery);
  const [tableData, setTableData] = useState<TopicData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters state
  const [selectedBook, setSelectedBook] = useState<string>("all");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showDemoData, setShowDemoData] = useState<boolean>(false);

  // Trigger search
  const performSearch = async (queryToSearch: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const results = await searchTopicsApi(queryToSearch);
      setTableData(results);
      setShowDemoData(false);
    } catch (err: unknown) {
      console.error("Search API Error:", err);
      let errorText = "Failed to fetch topics from the server.";
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          errorText = `Backend API at ${getApiBaseUrl()} is unreachable. Make sure your backend server is running.`;
        } else if (err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
          errorText = String((err.response.data as { message: string }).message);
        }
      }
      setErrorMessage(errorText);
      // If error occurs, keep previous data or offer demo fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Initial search if query param provided
  useEffect(() => {
    if (initialQuery) {
      setTopic(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(topic);
  };

  const handleClear = () => {
    setTopic("");
  };

  const handleUseDemoData = () => {
    setTableData(SAMPLE_TOPICS);
    setShowDemoData(true);
    setErrorMessage(null);
    setHasSearched(true);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesBook = selectedBook === "all" || item.book.toLowerCase() === selectedBook.toLowerCase();
      const matchesSection = selectedSection === "all" || item.section.toLowerCase() === selectedSection.toLowerCase();
      return matchesBook && matchesSection;
    });
  }, [tableData, selectedBook, selectedSection]);

  const getBookBadge = (bookValue: string) => {
    const bookObj = BOOKS.find((b) => b.value.toLowerCase() === bookValue.toLowerCase());
    if (bookObj) {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bookObj.color.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${bookObj.color.bg.replace('/10', '')} bg-current`}></span>
          {bookObj.label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
        {bookValue}
      </span>
    );
  };

  const getSectionBadge = (sectionValue: string) => {
    const sectionObj = SECTIONS.find((s) => s.value.toLowerCase() === sectionValue.toLowerCase());
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
        <Layers className="w-3 h-3 text-slate-400" />
        {sectionObj ? sectionObj.label : sectionValue}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Overview</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Search Topics</span>
          </h1>
        </div>

        <Link
          href="/add-topic"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <span>Add New Topic</span>
          <span className="text-indigo-400">+</span>
        </Link>
      </div>

      {/* Main Search Control Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-xl p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Search topic or concept (e.g. 'Binary Search', 'React', 'Trees')..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {topic && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error / Backend Alert with Demo Option */}
      {errorMessage && (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-300">Backend API Notice</h4>
              <p className="text-xs text-amber-200/80 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => performSearch(topic)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-medium transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={handleUseDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-all"
            >
              <span>Load Sample Preview Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and View Bar (shown if search performed or data available) */}
      {hasSearched && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters:</span>
            </div>

            {/* Book Filter */}
            <div className="relative">
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Books ({BOOKS.length})</option>
                {BOOKS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Section Filter */}
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">All Sections ({SECTIONS.length})</option>
                {SECTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {(selectedBook !== "all" || selectedSection !== "all") && (
              <button
                onClick={() => {
                  setSelectedBook("all");
                  setSelectedSection("all");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{filteredData.length}</strong> of {tableData.length} results
              {showDemoData && <span className="ml-1 text-indigo-400">(Preview Mode)</span>}
            </span>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {isLoading ? (
        /* Loading Skeleton */
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-16 rounded-xl bg-slate-900/60 border border-slate-800/80 skeleton-shimmer"
            ></div>
          ))}
        </div>
      ) : !hasSearched ? (
        /* Initial Ready State */
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-semibold text-white">Ready to Explore</h3>
            <p className="text-sm text-slate-400">
              Enter any topic keyword above, or click one of the suggested search chips to inspect chapter and section locations.
            </p>
          </div>
          <button
            onClick={handleUseDemoData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
          >
            <span>Explore Demo Data</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : filteredData.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-semibold text-white">No Matching Topics Found</h3>
            <p className="text-sm text-slate-400">
              We couldn&apos;t find topics matching your current search query and filters.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setTopic("");
                setSelectedBook("all");
                setSelectedSection("all");
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
            >
              Clear Filters
            </button>
            <Link
              href="/add-topic"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow transition-colors"
            >
              Add This Topic Now
            </Link>
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Topic Name</th>
                  <th className="py-3.5 px-6">Book Volume</th>
                  <th className="py-3.5 px-6">Section Location</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors flex-shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="group-hover:text-white transition-colors">{row.topic}</span>
                    </td>
                    <td className="py-4 px-6">
                      {getBookBadge(row.book)}
                    </td>
                    <td className="py-4 px-6">
                      {getSectionBadge(row.section)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleCopy(row.topic, index)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        title="Copy topic name"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchTopic() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-16 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading Search Directory...</span>
        </div>
      }
    >
      <SearchTopicContent />
    </Suspense>
  );
}
