export interface BookOption {
  value: string;
  label: string;
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    gradient: string;
  };
}

export interface SectionOption {
  value: string;
  label: string;
}

export const BOOKS: BookOption[] = [
  {
    value: "book1",
    label: "Book 1",
    color: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
      gradient: "from-blue-600 to-cyan-500",
    },
  },
  {
    value: "book2",
    label: "Book 2",
    color: {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
      badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
      gradient: "from-purple-600 to-indigo-500",
    },
  },
  {
    value: "book3",
    label: "Book 3",
    color: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
      gradient: "from-emerald-600 to-teal-500",
    },
  },
  {
    value: "book4",
    label: "Book 4",
    color: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
      gradient: "from-amber-600 to-orange-500",
    },
  },
];

export const SECTIONS: SectionOption[] = [
  { value: "section1", label: "Section 1" },
  { value: "section2", label: "Section 2" },
  { value: "section3", label: "Section 3" },
  { value: "section4", label: "Section 4" },
  { value: "section5", label: "Section 5" },
];

export const SAMPLE_TOPICS = [
  { topic: "Binary Search Trees & Balancing", book: "book1", section: "section2" },
  { topic: "Asynchronous JavaScript & Event Loop", book: "book2", section: "section1" },
  { topic: "Database Indexing & B-Trees", book: "book1", section: "section4" },
  { topic: "React Fiber Architecture & Reconciliation", book: "book2", section: "section3" },
  { topic: "Distributed Consensus: Raft & Paxos", book: "book3", section: "section1" },
  { topic: "Zero-Knowledge Proofs & Cryptography", book: "book4", section: "section5" },
  { topic: "Memory Management & Garbage Collection", book: "book3", section: "section3" },
  { topic: "REST vs GraphQL API Design", book: "book2", section: "section4" },
];
