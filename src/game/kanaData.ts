export interface KanaItem {
  id: string;
  kana: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  group: string;
  groupName: string;
  mnemonic?: string;
  similarTo?: string[]; // characters easily confused with
}

export interface KanaGroup {
  id: string;
  type: 'hiragana' | 'katakana';
  name: string;
  title: string;
  description: string;
  order: number;
  items: KanaItem[];
  boss: {
    name: string;
    title: string;
    avatar: string;
    description: string;
    hp: number;
  };
}

export const KANA_GROUPS: KanaGroup[] = [
  // HIRAGANA
  {
    id: 'hira-vowels',
    type: 'hiragana',
    name: 'Vokal (A-I-U-E-O)',
    title: 'あ い う え お',
    description: '5 huruf vokal utama fondasi bahasa Jepang',
    order: 1,
    boss: {
      name: 'Oni Kabut A-I-U-E-O',
      title: 'Penjaga Gerbang Vokal 👹',
      avatar: '👺',
      description: 'Kalahkan kabut kebingungan huruf vokal untuk membuka baris Ka!',
      hp: 10,
    },
    items: [
      { id: 'h-a', kana: 'あ', romaji: 'a', type: 'hiragana', group: 'hira-vowels', groupName: 'Vokal', mnemonic: 'Bentuknya mirip apel bundar dengan tangkai melengkung', similarTo: ['お', 'め'] },
      { id: 'h-i', kana: 'い', romaji: 'i', type: 'hiragana', group: 'hira-vowels', groupName: 'Vokal', mnemonic: 'Dua garis sejajar mirip dua jarI (I)', similarTo: ['り', 'こ'] },
      { id: 'h-u', kana: 'う', romaji: 'u', type: 'hiragana', group: 'hira-vowels', groupName: 'Vokal', mnemonic: 'Bentuknya melengkung seperti Orang rukUk (U)', similarTo: ['つ', 'ろ'] },
      { id: 'h-e', kana: 'え', romaji: 'e', type: 'hiragana', group: 'hira-vowels', groupName: 'Vokal', mnemonic: 'Mirip burung Elang yang sedang terbang (E)', similarTo: ['ん', 'そ'] },
      { id: 'h-o', kana: 'お', romaji: 'o', type: 'hiragana', group: 'hira-vowels', groupName: 'Vokal', mnemonic: 'Mirip orang sedang main golf Memukul bOla (O)', similarTo: ['あ', 'む'] },
    ],
  },
  {
    id: 'hira-k',
    type: 'hiragana',
    name: 'Baris K (Ka-Ki-Ku-Ke-Ko)',
    title: 'か き く け こ',
    description: 'Huruf konsonan K yang renyah dan berenergi',
    order: 2,
    boss: {
      name: 'Tengu Kaze no K',
      title: 'Penjaga Angin Baris Ka 🦅',
      avatar: '👺',
      description: 'Buktikan ingatan tajammu pada baris konsonan Ka-Ki-Ku-Ke-Ko!',
      hp: 12,
    },
    items: [
      { id: 'h-ka', kana: 'か', romaji: 'ka', type: 'hiragana', group: 'hira-k', groupName: 'Baris K', mnemonic: 'Mirip pedang Samurai KAtana', similarTo: ['が', 'や'] },
      { id: 'h-ki', kana: 'き', romaji: 'ki', type: 'hiragana', group: 'hira-k', groupName: 'Baris K', mnemonic: 'Bentuknya mirip Kunci (Key/Ki)', similarTo: ['さ', 'ち'] },
      { id: 'h-ku', kana: 'く', romaji: 'ku', type: 'hiragana', group: 'hira-k', groupName: 'Baris K', mnemonic: 'Bentuk paruh burung Ku-Kuk membuka (Ku)', similarTo: ['へ', 'つ'] },
      { id: 'h-ke', kana: 'け', romaji: 'ke', type: 'hiragana', group: 'hira-k', groupName: 'Baris K', mnemonic: 'Bentuknya mirip tong KEceng kelapa', similarTo: ['は', 'に'] },
      { id: 'h-ko', kana: 'こ', romaji: 'ko', type: 'hiragana', group: 'hira-k', groupName: 'Baris K', mnemonic: 'Dua cacing KO-in bertumpuk', similarTo: ['い', 'に'] },
    ],
  },
  {
    id: 'hira-s',
    type: 'hiragana',
    name: 'Baris S (Sa-Shi-Su-Se-So)',
    title: 'さ し す せ そ',
    description: 'Huruf dengan suara desis lembut khas Jepang',
    order: 3,
    boss: {
      name: 'Kitsune Rubah Shi-Su',
      title: 'Penjaga Desir Halus 🦊',
      avatar: '🦊',
      description: 'Waspadai huruf Shi dan Su yang sering membingungkan!',
      hp: 12,
    },
    items: [
      { id: 'h-sa', kana: 'さ', romaji: 'sa', type: 'hiragana', group: 'hira-s', groupName: 'Baris S', mnemonic: 'Mirip cangkir SAlad berputar', similarTo: ['き', 'ち'] },
      { id: 'h-shi', kana: 'し', romaji: 'shi', type: 'hiragana', group: 'hira-s', groupName: 'Baris S', mnemonic: 'Kail pancing SHInar laut', similarTo: ['つ', 'い'] },
      { id: 'h-su', kana: 'す', romaji: 'su', type: 'hiragana', group: 'hira-s', groupName: 'Baris S', mnemonic: 'Orang main SUling berputar', similarTo: ['む', 'お'] },
      { id: 'h-se', kana: 'せ', romaji: 'se', type: 'hiragana', group: 'hira-s', groupName: 'Baris S', mnemonic: 'Mirip bangku SEtengah terbuka', similarTo: ['や', 'け'] },
      { id: 'h-so', kana: 'そ', romaji: 'so', type: 'hiragana', group: 'hira-s', groupName: 'Baris S', mnemonic: 'Jalur zigzag SO-da', similarTo: ['ろ', 'る'] },
    ],
  },
  {
    id: 'hira-t',
    type: 'hiragana',
    name: 'Baris T (Ta-Chi-Tsu-Te-To)',
    title: 'た ち つ て と',
    description: 'Kombinasi Ta, Chi, Tsu, Te, To yang ekspresif',
    order: 4,
    boss: {
      name: 'Ryuu Naga Chi-Tsu',
      title: 'Penguasa Ombak T 🐉',
      avatar: '🐉',
      description: 'Buktikan kamu tidak tertukar antara Chi (ち) dan Sa (さ)!',
      hp: 12,
    },
    items: [
      { id: 'h-ta', kana: 'た', romaji: 'ta', type: 'hiragana', group: 'hira-t', groupName: 'Baris T', mnemonic: 'Huruf "ta" mirip tulisan "ta"', similarTo: ['な', 'に'] },
      { id: 'h-chi', kana: 'ち', romaji: 'chi', type: 'hiragana', group: 'hira-t', groupName: 'Baris T', mnemonic: 'Angka 5 terbalik, pemandu CHI-p', similarTo: ['さ', 'き'] },
      { id: 'h-tsu', kana: 'つ', romaji: 'tsu', type: 'hiragana', group: 'hira-t', groupName: 'Baris T', mnemonic: 'Ombak TSU-nami melengkung besar', similarTo: ['し', 'う'] },
      { id: 'h-te', kana: 'て', romaji: 'te', type: 'hiragana', group: 'hira-t', groupName: 'Baris T', mnemonic: 'Gagang payung TE-gak', similarTo: ['で', 'そ'] },
      { id: 'h-to', kana: 'と', romaji: 'to', type: 'hiragana', group: 'hira-t', groupName: 'Baris T', mnemonic: 'Jari kaki kemasukan duri (TO-e)', similarTo: ['て', 'い'] },
    ],
  },
  {
    id: 'hira-n',
    type: 'hiragana',
    name: 'Baris N (Na-Ni-Nu-Ne-No)',
    title: 'な に ぬ ね の',
    description: 'Huruf lembut Na, Ni, Nu, Ne, No',
    order: 5,
    boss: {
      name: 'Siluman Nu-Ne-Me',
      title: 'Teka-Teki Simpul N 🪢',
      avatar: '🪢',
      description: 'Uji ketelitianmu pada simpul Nu (ぬ) dan Ne (ね)!',
      hp: 12,
    },
    items: [
      { id: 'h-na', kana: 'な', romaji: 'na', type: 'hiragana', group: 'hira-n', groupName: 'Baris N', mnemonic: 'Biksu sedang NA-ngis berdoa', similarTo: ['た', 'ば'] },
      { id: 'h-ni', kana: 'に', romaji: 'ni', type: 'hiragana', group: 'hira-n', groupName: 'Baris N', mnemonic: 'Jarum dan benang (NI-ddle)', similarTo: ['こ', 'け'] },
      { id: 'h-nu', kana: 'ぬ', romaji: 'nu', type: 'hiragana', group: 'hira-n', groupName: 'Baris N', mnemonic: 'Mie NU-dles dengan sumpit berputar ada ekornya', similarTo: ['め', 'ね'] },
      { id: 'h-ne', kana: 'ね', romaji: 'ne', type: 'hiragana', group: 'hira-n', groupName: 'Baris N', mnemonic: 'Kucing NE-ko dengan ekor melingkar', similarTo: ['わ', 'れ'] },
      { id: 'h-no', kana: 'の', romaji: 'no', type: 'hiragana', group: 'hira-n', groupName: 'Baris N', mnemonic: 'Rambu dilarang NO melingkar satu goresan', similarTo: ['め', 'あ'] },
    ],
  },

  // KATAKANA BASIC VOWELS
  {
    id: 'kata-vowels',
    type: 'katakana',
    name: 'Katakana Vokal (A-I-U-E-O)',
    title: 'ア イ ウ エ オ',
    description: 'Huruf Katakana bersudut tegas untuk kata serapan asing',
    order: 6,
    boss: {
      name: 'Cyber Robot A-I-U-E-O',
      title: 'Penjaga Garis Tegas Katakana 🤖',
      avatar: '🤖',
      description: 'Kuasai sudut tajam Katakana Vokal untuk menaklukkan mode modern!',
      hp: 10,
    },
    items: [
      { id: 'k-a', kana: 'ア', romaji: 'a', type: 'katakana', group: 'kata-vowels', groupName: 'Katakana Vokal', mnemonic: 'Sudut atap rumah bergaya Arsitek (A)', similarTo: ['マ', 'ヤ'] },
      { id: 'k-i', kana: 'イ', romaji: 'i', type: 'katakana', group: 'kata-vowels', groupName: 'Katakana Vokal', mnemonic: 'Kuda-kuda orang berdiri tegak (I)', similarTo: ['ト', 'ノ'] },
      { id: 'k-u', kana: 'ウ', romaji: 'u', type: 'katakana', group: 'kata-vowels', groupName: 'Katakana Vokal', mnemonic: 'Topi pelindung Udara (U)', similarTo: ['ワ', 'フ'] },
      { id: 'k-e', kana: 'エ', romaji: 'e', type: 'katakana', group: 'kata-vowels', groupName: 'Katakana Vokal', mnemonic: 'Rangka lift Elevator bertingkat (E)', similarTo: ['工', 'コ'] },
      { id: 'k-o', kana: 'オ', romaji: 'o', type: 'katakana', group: 'kata-vowels', groupName: 'Katakana Vokal', mnemonic: 'Orang Opera berotot merentangkan tangan (O)', similarTo: ['ホ', '木'] },
    ],
  },
];

// Helper to get all Kana items
export const ALL_KANA_ITEMS: KanaItem[] = KANA_GROUPS.flatMap((g) => g.items);

export function getKanaById(id: string): KanaItem | undefined {
  return ALL_KANA_ITEMS.find((k) => k.id === id);
}

export function getKanaByCharacter(char: string): KanaItem | undefined {
  return ALL_KANA_ITEMS.find((k) => k.kana === char);
}
