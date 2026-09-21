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
  ArrowRight,
  RefreshCw,
  Check,
  KeyRound,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { BOOKS, SECTIONS } from "@/utilities/constants";
import { TopicData } from "@/utilities/interfaces";
import { addTopicApi } from "@/utilities/api";

export default function AddTopic() {
  const [topicData, setTopicData] = useState<TopicData>({
    topic: "",
    book: "",
    section: "",
  });
  const [submittedTopic, setSubmittedTopic] = useState<TopicData | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    status: "success" | "error" | null;
  }>({
    text: "",
    status: null,
  });

  // Admin Key Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [adminKeyInput, setAdminKeyInput] = useState<string>("");
  const [showAdminKey, setShowAdminKey] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTopicData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "book" && value === "book5" ? { section: "" } : {}),
    }));
    if (message.status) {
      setMessage({ text: "", status: null });
    }
  };

  const handleSelectPreset = (name: "book" | "section", value: string) => {
    setTopicData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "book" && value === "book5" ? { section: "" } : {}),
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

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  };

  // Form submission: Validate fields and open the Admin Key Modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { topic, book, section } = topicData;

    if (!topic.trim()) {
      setMessage({ text: "Please provide a topic title", status: "error" });
      scrollToTop();
      return;
    }
    if (!book) {
      setMessage({ text: "Please select a book", status: "error" });
      scrollToTop();
      return;
    }
    const selectedBookObj = BOOKS.find((b) => b.value === book);
    const requiresSection = selectedBookObj ? selectedBookObj.hasVolumes !== false : book !== "book5";
    if (requiresSection && !section) {
      setMessage({ text: "Please select a section", status: "error" });
      scrollToTop();
      return;
    }

    // Required fields are valid -> Open Admin Key verification modal
    setMessage({ text: "", status: null });
    setAdminKeyInput("");
    setShowAdminKey(false);
    setIsModalOpen(true);
  };

  // 1. User skips the admin key -> close modal and show permission error
  const handleSkipAdminKey = () => {
    setIsModalOpen(false);
    setAdminKeyInput("");
    setShowAdminKey(false);
    setMessage({
      text: "Only the administrator has permission to write/save data",
      status: "error",
    });
    scrollToTop();
  };

  // Close modal without notice (e.g. clicking 'X' or backdrop)
  const handleCloseModal = () => {
    if (!isVerifying) {
      setIsModalOpen(false);
      setAdminKeyInput("");
      setShowAdminKey(false);
    }
  };

  // 2, 3, 4. User submits admin key (or submits empty input)
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = adminKeyInput.trim();

    // If key is omitted or empty, treat as skip
    if (!trimmedKey) {
      handleSkipAdminKey();
      return;
    }

    setIsVerifying(true);

    try {
      const response = await addTopicApi(topicData, trimmedKey);
      if (response.status === 201 || response.status === 200) {
        setIsModalOpen(false);
        setAdminKeyInput("");
        setShowAdminKey(false);
        fireSuccessConfetti();
        setSubmittedTopic({ ...topicData });
        const targetLocation = topicData.section
          ? `${topicData.book.toUpperCase()} - ${topicData.section.toUpperCase()}`
          : topicData.book.toUpperCase();
        setMessage({
          text: `"${topicData.topic}" successfully indexed to ${targetLocation}`,
          status: "success",
        });
        // Clear form
        setTopicData({ topic: "", book: "", section: "" });
        scrollToTop();
      }
    } catch (err: unknown) {
      console.error("Add Topic API Error:", err);
      setIsModalOpen(false);
      setAdminKeyInput("");
      setShowAdminKey(false);

      if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        // 401 Unauthorized / 403 Forbidden
        setMessage({
          text: "Only the administrator has permission to write/save data",
          status: "error",
        });
      } else {
        // General API error (network issue, 500, timeout)
        setMessage({
          text: "Something went wrong, please try again later",
          status: "error",
        });
      }
      scrollToTop();
    } finally {
      setIsVerifying(false);
    }
  };

  // Close modal when Escape key is pressed
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen && !isVerifying) {
        setIsModalOpen(false);
        setAdminKeyInput("");
        setShowAdminKey(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isVerifying]);

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
        <div
          id="success-banner"
          role="alert"
          aria-live="polite"
          className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
        >
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
        <div
          id="error-banner"
          role="alert"
          aria-live="assertive"
          className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-start gap-3 shadow-lg"
        >
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Topic <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="topic"
                  value={topicData.topic}
                  onChange={handleChange}
                  placeholder="e.g. Redux Toolkit"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Book Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Book <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Click preset or select</span>
              </div>

              {/* Quick Select Chips for Books */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {BOOKS.map((book) => {
                  const isSelected = topicData.book === book.value;
                  return (
                    <button
                      type="button"
                      key={book.value}
                      onClick={() => handleSelectPreset("book", book.value)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all cursor-pointer ${isSelected
                        ? book.color.selected
                        : "bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${book.color.dot} shrink-0`}></span>
                        {book.label}
                      </span>
                      {isSelected && <Check className={`w-3.5 h-3.5 ${book.color.check} flex-shrink-0`} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume / Section Selection - Hidden for Book 5 */}
            {currentBookObj?.hasVolumes !== false && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Section <span className="text-rose-400">*</span>
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
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Topic</span>
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
                    <span className={`w-1.5 h-1.5 rounded-full ${currentBookObj.color.dot} shrink-0`}></span>
                    {currentBookObj.label}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 italic">No book selected</span>
                )}

                {/* Section Badge */}
                {currentBookObj?.hasVolumes === false ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
                    No Volume
                  </span>
                ) : currentSectionObj ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    <Layers className="w-3 h-3 text-slate-400" />
                    {currentSectionObj.label}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 italic">No volume</span>
                )}
              </div>

              {/* Topic Title Preview */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Topic
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
          </div>
        </div>

      </div>

      {/* Admin Key Verification Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 text-left relative"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Admin Verification</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isVerifying}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              This application serves as a public showcase. To protect the database from unauthorized modifications, saving topics requires an admin passcode.
            </p>

            {/* Admin Key Form */}
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Admin Key <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type={showAdminKey ? "text" : "password"}
                    value={adminKeyInput}
                    onChange={(e) => setAdminKeyInput(e.target.value)}
                    disabled={isVerifying}
                    autoFocus
                    className="w-full px-4 py-2.5 pr-11 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey((prev) => !prev)}
                    disabled={isVerifying}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                    tabIndex={-1}
                    aria-label={showAdminKey ? "Hide admin key" : "Show admin key"}
                  >
                    {showAdminKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSkipAdminKey}
                  disabled={isVerifying}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Skip (Demo Mode)
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Submit & Save</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

