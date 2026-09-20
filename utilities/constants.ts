export interface BookOption {
  value: string;
  label: string;
  hasVolumes?: boolean;
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    gradient: string;
    dot: string;
    selected: string;
    check: string;
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
    hasVolumes: true,
    color: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
      gradient: "from-blue-600 to-cyan-500",
      dot: "bg-blue-500",
      selected: "bg-blue-600/20 border-blue-500 text-white shadow-md ring-2 ring-blue-500/30",
      check: "text-blue-400",
    },
  },
  {
    value: "book2",
    label: "Book 2",
    hasVolumes: true,
    color: {
      bg: "bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
      badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
      gradient: "from-purple-600 to-indigo-500",
      dot: "bg-purple-500",
      selected: "bg-purple-600/20 border-purple-500 text-white shadow-md ring-2 ring-purple-500/30",
      check: "text-purple-400",
    },
  },
  {
    value: "book3",
    label: "Book 3",
    hasVolumes: true,
    color: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
      gradient: "from-emerald-600 to-teal-500",
      dot: "bg-emerald-500",
      selected: "bg-emerald-600/20 border-emerald-500 text-white shadow-md ring-2 ring-emerald-500/30",
      check: "text-emerald-400",
    },
  },
  {
    value: "book4",
    label: "Book 4",
    hasVolumes: true,
    color: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
      gradient: "from-amber-600 to-orange-500",
      dot: "bg-amber-500",
      selected: "bg-amber-600/20 border-amber-500 text-white shadow-md ring-2 ring-amber-500/30",
      check: "text-amber-400",
    },
  },
  {
    value: "book5",
    label: "Book 5",
    hasVolumes: false,
    color: {
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-500/30",
      badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
      gradient: "from-rose-600 to-pink-500",
      dot: "bg-rose-500",
      selected: "bg-rose-600/20 border-rose-500 text-white shadow-md ring-2 ring-rose-500/30",
      check: "text-rose-400",
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
