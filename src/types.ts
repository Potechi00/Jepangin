export type NavigationTab = 'beranda' | 'belajar' | 'latihan' | 'progress' | 'profil' | 'battle' | 'yomeru';

export interface LessonItem {
  id: string;
  japanese: string; // e.g. あ or こんにちは
  hiraganaOrKatakana?: string;
  romaji: string; // e.g. "a" or "konnichiwa"
  indonesian: string; // e.g. "Huruf vokal A" or "Halo / Selamat siang"
  notes?: string; // e.g. "Bentuknya seperti orang sedang membungkuk"
  exampleJapanese?: string;
  exampleRomaji?: string;
  exampleIndonesian?: string;
}

export type QuizType = 'multiple_choice' | 'audio_guess' | 'match_pairs' | 'arrange_words';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string; // e.g. "Huruf manakah yang dibaca 'Ka'?"
  promptAudio?: string; // japanese text to speak
  promptDisplay?: string; // big character or text
  options?: string[]; // e.g. ["か", "き", "く", "け"]
  correctAnswer: string; // e.g. "か"
  explanation: string; // e.g. "か dibaca 'ka', sedangkan き dibaca 'ki'."
  pairs?: { left: string; right: string }[]; // for match_pairs
}

export interface Lesson {
  id: string;
  title: string; // e.g. "Hiragana: Baris A (あ, い, う, え, お)"
  description: string; // e.g. "Pelajari 5 huruf vokal pertama dalam bahasa Jepang"
  xpReward: number; // e.g. 50
  items: LessonItem[];
  quizzes: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  category: 'huruf' | 'kosakata' | 'percakapan' | 'tatabahasa';
  title: string;
  subtitle: string;
  iconSymbol: string; // e.g. "あ" or "💬" or "123"
  badge: string; // e.g. "Dasar 1"
  colorTheme: string; // Tailwind color accent
  lessons: Lesson[];
}

export interface UserProgress {
  userName: string;
  avatar: string;
  currentStreak: number;
  lastStudyDate: string | null;
  totalXp: number;
  level: number;
  completedLessonIds: string[];
  activeLessonId: string;
  largeFontMode: boolean;
  soundEffects: boolean;
  autoVoice: boolean;
  selectedLandmark?: 'fuji' | 'shibuya' | 'kyoto';
  sceneryTime?: 'auto' | 'day' | 'sunset' | 'night';
  livingEffects?: boolean;
}
