"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import axios from "axios";
import {
  PlusCircle,
  BookOpen,
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Info,
  Check,
} from "lucide-react";
import { BOOKS, SECTIONS } from "@/utilities/constants";
import { TopicData } from "@/utilities/interfaces";
import { addTopicApi, getApiBaseUrl } from "@/utilities/api";

export default function AddTopic() {
  const [topicData, setTopicData] = useState<TopicData>({
    topic: "",
    book: "",
    section: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submittedTopic, setSubmittedTopic] = useState<TopicData | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    status: "success" | "error" | null;
  }>({
    text: "",
    status: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setTopicData({
      ...topicData,
      [e.target.name]: e.target.value,
    });
    if (message.status) {
      setMessage({ text: "", status: null });
    }
  };

  const handleSelectPreset = (name: "book" | "section", value: string) => {
    setTopicData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message.status) {
      setMessage({ text: "", status: null });
    }
  };

  const fireSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#10b981", "#38bdf8", "#ec4899"],
      });
    } catch {
      // Graceful fallback if confetti unavailable
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { topic, book, section } = topicData;

    if (!topic.trim()) {
      setMessage({ text: "Please provide a topic title or concept name.", status: "error" });
      return;
    }
    if (!book) {
      setMessage({ text: "Please select a book volume.", status: "error" });
      return;
    }
    if (!section) {
      setMessage({ text: "Please select a section.", status: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", status: null });

    try {
      const response = await addTopicApi(topicData);
      if (response.status === 201 || response.status === 200) {
        fireSuccessConfetti();
        setSubmittedTopic({ ...topicData });
        setMessage({
          text: `"${topicData.topic}" successfully indexed to ${book.toUpperCase()} (${section.toUpperCase()})!`,
          status: "success",
        });
        // Clear form
        setTopicData({ topic: "", book: "", section: "" });
      }
    } catch (err: unknown) {
      console.error("Add Topic API Error:", err);
      let errorText = "Failed to save topic to database.";
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          errorText = `Could not connect to backend server at ${getApiBaseUrl()}. Please verify your backend is running.`;
        } else if (err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
          errorText = String((err.response.data as { message: string }).message);
        }
      }
      setMessage({
        text: errorText,
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentBookObj = BOOKS.find((b) => b.value === topicData.book);
  const currentSectionObj = SECTIONS.find((s) => s.value === topicData.section);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Add New Topic</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Add a new concept, chapter, or algorithm into your book knowledge database.
            </p>
          </div>

          <Link
            href="/search-topic"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-colors self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>View All Topics</span>
          </Link>
        </div>
      </div>

      {/* Success Notification Banner */}
      {message.status === "success" && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-base font-semibold text-emerald-300">Topic Added Successfully!</h4>
              <p className="text-sm text-emerald-200/90 mt-0.5">{message.text}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {submittedTopic && (
              <Link
                href={`/search-topic?q=${encodeURIComponent(submittedTopic.topic)}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
              >
                <span>Search This Topic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={() => setMessage({ text: "", status: null })}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {message.status === "error" && (
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-rose-300">Submission Notice</h4>
            <p className="text-xs text-rose-200/90 mt-0.5">{message.text}</p>
          </div>
        </div>
      )}

      {/* Dual Pane Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Form (7 columns) */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800/80 pb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" />
              <span>Topic Details</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Fill in the concept title and pick the corresponding book volume and chapter section.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Topic Title / Concept <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="topic"
                  value={topicData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Distributed Consensus: Raft Protocol"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  autoComplete="off"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Be specific with keywords or algorithm names for effortless future search.
              </p>
            </div>

            {/* Book Volume Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Book Volume <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Click preset or select</span>
              </div>

              {/* Quick Select Chips for Books */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BOOKS.map((book) => {
                  const isSelected = topicData.book === book.value;
                  return (
                    <button
                      type="button"
                      key={book.value}
                      onClick={() => handleSelectPreset("book", book.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${isSelected
                        ? `bg-indigo-600/20 border-indigo-500 text-white shadow-md ring-2 ring-indigo-500/20`
                        : "bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${book.color.bg.replace('/10', '')} bg-current`}></span>
                        {book.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Native Dropdown Fallback */}
              <div className="pt-1">
                <select
                  name="book"
                  value={topicData.book}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Or choose book from list --</option>
                  {BOOKS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Section Location <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Select section (1 - 5)</span>
              </div>

              {/* Quick Select Chips for Sections */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {SECTIONS.map((section) => {
                  const isSelected = topicData.section === section.value;
                  return (
                    <button
                      type="button"
                      key={section.value}
                      onClick={() => handleSelectPreset("section", section.value)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${isSelected
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md ring-2 ring-emerald-500/20"
                        : "bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-white"
                        }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>{section.label.replace("Section ", "Sec ")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Native Dropdown Fallback */}
              <div className="pt-1">
                <select
                  name="section"
                  value={topicData.section}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-700/80 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Or choose section from list --</option>
                  {SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Index Topic Now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setTopicData({ topic: "", book: "", section: "" })}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Interactive Preview Card (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">

            {/* The Live Rendered Card */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-700/80 p-5 shadow-xl space-y-4 relative overflow-hidden group">
              {/* Subtle accent gradient strip */}
              <div
                className={`h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r ${currentBookObj ? currentBookObj.color.gradient : "from-slate-600 to-slate-700"
                  }`}
              ></div>

              <div className="flex items-center justify-between gap-2 pt-1">
                {/* Book Badge */}
                {currentBookObj ? (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentBookObj.color.badge}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {currentBookObj.label}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 italic">No book selected</span>
                )}

                {/* Section Badge */}
                {currentSectionObj ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    <Layers className="w-3 h-3 text-slate-400" />
                    {currentSectionObj.label}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 italic">No section</span>
                )}
              </div>

              {/* Topic Title Preview */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Indexed Topic
                </span>
                <h3 className="text-lg font-bold text-white mt-1 break-words leading-snug">
                  {topicData.topic || (
                    <span className="text-slate-600 italic">
                      Type a topic name on the left to see live preview...
                    </span>
                  )}
                </h3>
              </div>
            </div>

            {/* Helpful Guide Card */}
            <div className="rounded-2xl bg-indigo-950/20 border border-indigo-900/40 p-4 space-y-2 text-xs text-indigo-200/80">
              <div className="flex items-center gap-2 text-indigo-300 font-medium">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Indexing Tips</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                <li>Use clean keywords (e.g. &ldquo;B-Tree Indexing&rdquo; instead of &ldquo;how does b-tree index work&rdquo;).</li>
                <li>Tagging accurate book volume and section makes search instantaneous.</li>
                <li>You can search for newly added topics immediately in the Search page.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
