export interface KanaExampleWord {
  wordJapanese: string;
  wordRomaji: string;
  wordIndonesian: string;
}

export interface KanaItem {
  id: string;
  kana: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  group: string;
  groupName: string;
  mnemonic?: string;
  similarTo?: string[]; // characters easily confused with
  exampleWord?: KanaExampleWord;
}

export interface KanaBossInfo {
  name: string;
  title: string;
  avatar: string;
  description: string;
  hp: number;
}

export interface KanaGroup {
  id: string;
  type: 'hiragana' | 'katakana' | 'mixed';
  stageNumber: number; // 1-10, or 11 for special
  name: string;
  title: string;
  description: string;
  order: number;
  isMasterStage?: boolean;
  isMixMaster?: boolean;
  items: KanaItem[];
  boss: KanaBossInfo;
}

// ----------------------------------------------------
// 1. HIRAGANA GROUPS (STAGE 1 TO 10 + ALL HIRAGANA)
// ----------------------------------------------------

export const HIRAGANA_ITEMS: KanaItem[] = [
  // Stage 1: Vowels (A I U E O)
  { id: 'h-a', kana: 'あ', romaji: 'a', type: 'hiragana', group: 'hira-1', groupName: 'Stage 1: Vokal', mnemonic: 'Bentuknya mirip apel bundar dengan tangkai melengkung (A)', similarTo: ['お', 'め'], exampleWord: { wordJapanese: 'あめ', wordRomaji: 'ame', wordIndonesian: 'hujan / permen' } },
  { id: 'h-i', kana: 'い', romaji: 'i', type: 'hiragana', group: 'hira-1', groupName: 'Stage 1: Vokal', mnemonic: 'Dua garis sejajar mirip dua jarI (I)', similarTo: ['り', 'こ'], exampleWord: { wordJapanese: 'いぬ', wordRomaji: 'inu', wordIndonesian: 'anjing' } },
  { id: 'h-u', kana: 'う', romaji: 'u', type: 'hiragana', group: 'hira-1', groupName: 'Stage 1: Vokal', mnemonic: 'Bentuk melengkung seperti orang rukUk (U)', similarTo: ['つ', 'ろ'], exampleWord: { wordJapanese: 'うみ', wordRomaji: 'umi', wordIndonesian: 'laut' } },
  { id: 'h-e', kana: 'え', romaji: 'e', type: 'hiragana', group: 'hira-1', groupName: 'Stage 1: Vokal', mnemonic: 'Mirip burung Elang yang sedang terbang (E)', similarTo: ['ん', 'そ'], exampleWord: { wordJapanese: 'えき', wordRomaji: 'eki', wordIndonesian: 'stasiun' } },
  { id: 'h-o', kana: 'お', romaji: 'o', type: 'hiragana', group: 'hira-1', groupName: 'Stage 1: Vokal', mnemonic: 'Orang main golf memukul bOla (O)', similarTo: ['あ', 'む'], exampleWord: { wordJapanese: 'おに', wordRomaji: 'oni', wordIndonesian: 'raksasa / ogre' } },

  // Stage 2: K-row (Ka Ki Ku Ke Ko)
  { id: 'h-ka', kana: 'か', romaji: 'ka', type: 'hiragana', group: 'hira-2', groupName: 'Stage 2: Baris K', mnemonic: 'Mirip pedang samurai KAtana menebas', similarTo: ['が', 'や'], exampleWord: { wordJapanese: 'かさ', wordRomaji: 'kasa', wordIndonesian: 'payung' } },
  { id: 'h-ki', kana: 'き', romaji: 'ki', type: 'hiragana', group: 'hira-2', groupName: 'Stage 2: Baris K', mnemonic: 'Bentuknya mirip Kunci (Key / Ki)', similarTo: ['さ', 'ち'], exampleWord: { wordJapanese: 'き', wordRomaji: 'ki', wordIndonesian: 'pohon' } },
  { id: 'h-ku', kana: 'く', romaji: 'ku', type: 'hiragana', group: 'hira-2', groupName: 'Stage 2: Baris K', mnemonic: 'Bentuk paruh burung Ku-kuk membuka (Ku)', similarTo: ['へ', 'つ'], exampleWord: { wordJapanese: 'くるま', wordRomaji: 'kuruma', wordIndonesian: 'mobil' } },
  { id: 'h-ke', kana: 'け', romaji: 'ke', type: 'hiragana', group: 'hira-2', groupName: 'Stage 2: Baris K', mnemonic: 'Mirip bilah bambu KEceng lurus', similarTo: ['は', 'に'], exampleWord: { wordJapanese: 'けむり', wordRomaji: 'kemuri', wordIndonesian: 'asap' } },
  { id: 'h-ko', kana: 'こ', romaji: 'ko', type: 'hiragana', group: 'hira-2', groupName: 'Stage 2: Baris K', mnemonic: 'Dua cacing KO-in sejajar horizontal', similarTo: ['い', 'に'], exampleWord: { wordJapanese: 'こども', wordRomaji: 'kodomo', wordIndonesian: 'anak-anak' } },

  // Stage 3: S-row (Sa Shi Su Se So)
  { id: 'h-sa', kana: 'さ', romaji: 'sa', type: 'hiragana', group: 'hira-3', groupName: 'Stage 3: Baris S', mnemonic: 'Mirip mangkok SAlad berputar', similarTo: ['き', 'ち'], exampleWord: { wordJapanese: 'さくら', wordRomaji: 'sakura', wordIndonesian: 'bunga sakura' } },
  { id: 'h-shi', kana: 'し', romaji: 'shi', type: 'hiragana', group: 'hira-3', groupName: 'Stage 3: Baris S', mnemonic: 'Kail pancing SHInar laut ke atas', similarTo: ['つ', 'い'], exampleWord: { wordJapanese: 'しま', wordRomaji: 'shima', wordIndonesian: 'pulau' } },
  { id: 'h-su', kana: 'す', romaji: 'su', type: 'hiragana', group: 'hira-3', groupName: 'Stage 3: Baris S', mnemonic: 'Orang meniup SUling berputar', similarTo: ['む', 'お'], exampleWord: { wordJapanese: 'すし', wordRomaji: 'sushi', wordIndonesian: 'sushi' } },
  { id: 'h-se', kana: 'せ', romaji: 'se', type: 'hiragana', group: 'hira-3', groupName: 'Stage 3: Baris S', mnemonic: 'Mirip bangku SEtengah terbuka', similarTo: ['や', 'け'], exampleWord: { wordJapanese: 'せんせい', wordRomaji: 'sensei', wordIndonesian: 'guru' } },
  { id: 'h-so', kana: 'そ', romaji: 'so', type: 'hiragana', group: 'hira-3', groupName: 'Stage 3: Baris S', mnemonic: 'Jalur zigzag kaleng SOda', similarTo: ['ろ', 'る'], exampleWord: { wordJapanese: 'そら', wordRomaji: 'sora', wordIndonesian: 'langit' } },

  // Stage 4: T-row (Ta Chi Tsu Te To)
  { id: 'h-ta', kana: 'た', romaji: 'ta', type: 'hiragana', group: 'hira-4', groupName: 'Stage 4: Baris T', mnemonic: 'Huruf "ta" mirip tulisan huruf "ta"', similarTo: ['な', 'に'], exampleWord: { wordJapanese: 'たいよう', wordRomaji: 'taiyou', wordIndonesian: 'matahari' } },
  { id: 'h-chi', kana: 'ち', romaji: 'chi', type: 'hiragana', group: 'hira-4', groupName: 'Stage 4: Baris T', mnemonic: 'Pemandu sorak memegang bendera CHI-p', similarTo: ['さ', 'き'], exampleWord: { wordJapanese: 'ちず', wordRomaji: 'chizu', wordIndonesian: 'peta' } },
  { id: 'h-tsu', kana: 'つ', romaji: 'tsu', type: 'hiragana', group: 'hira-4', groupName: 'Stage 4: Baris T', mnemonic: 'Ombak raksasa TSU-nami melengkung', similarTo: ['し', 'う'], exampleWord: { wordJapanese: 'つき', wordRomaji: 'tsuki', wordIndonesian: 'bulan' } },
  { id: 'h-te', kana: 'て', romaji: 'te', type: 'hiragana', group: 'hira-4', groupName: 'Stage 4: Baris T', mnemonic: 'Gagang payung TE-gak melengkung', similarTo: ['で', 'そ'], exampleWord: { wordJapanese: 'て', wordRomaji: 'te', wordIndonesian: 'tangan' } },
  { id: 'h-to', kana: 'と', romaji: 'to', type: 'hiragana', group: 'hira-4', groupName: 'Stage 4: Baris T', mnemonic: 'Jari kaki kemasukan duri (TO-e)', similarTo: ['て', 'い'], exampleWord: { wordJapanese: 'とり', wordRomaji: 'tori', wordIndonesian: 'burung' } },

  // Stage 5: N-row (Na Ni Nu Ne No)
  { id: 'h-na', kana: 'な', romaji: 'na', type: 'hiragana', group: 'hira-5', groupName: 'Stage 5: Baris N', mnemonic: 'Biksu sedang NA-ngis berdoa', similarTo: ['た', 'ば'], exampleWord: { wordJapanese: 'なつ', wordRomaji: 'natsu', wordIndonesian: 'musim panas' } },
  { id: 'h-ni', kana: 'に', romaji: 'ni', type: 'hiragana', group: 'hira-5', groupName: 'Stage 5: Baris N', mnemonic: 'Jarum dan benang (NI-ddle)', similarTo: ['こ', 'け'], exampleWord: { wordJapanese: 'にじ', wordRomaji: 'niji', wordIndonesian: 'pelangi' } },
  { id: 'h-nu', kana: 'ぬ', romaji: 'nu', type: 'hiragana', group: 'hira-5', groupName: 'Stage 5: Baris N', mnemonic: 'Mie NU-dles dengan sumpit melingkar', similarTo: ['め', 'ね'], exampleWord: { wordJapanese: 'ぬいぐるみ', wordRomaji: 'nuigurumi', wordIndonesian: 'boneka' } },
  { id: 'h-ne', kana: 'ね', romaji: 'ne', type: 'hiragana', group: 'hira-5', groupName: 'Stage 5: Baris N', mnemonic: 'Kucing NE-ko dengan ekor melingkar', similarTo: ['わ', 'れ'], exampleWord: { wordJapanese: 'ねこ', wordRomaji: 'neko', wordIndonesian: 'kucing' } },
  { id: 'h-no', kana: 'の', romaji: 'no', type: 'hiragana', group: 'hira-5', groupName: 'Stage 5: Baris N', mnemonic: 'Rambu dilarang NO melingkar satu goresan', similarTo: ['め', 'あ'], exampleWord: { wordJapanese: 'のり', wordRomaji: 'nori', wordIndonesian: 'rumput laut' } },

  // Stage 6: H-row (Ha Hi Fu He Ho)
  { id: 'h-ha', kana: 'は', romaji: 'ha', type: 'hiragana', group: 'hira-6', groupName: 'Stage 6: Baris H', mnemonic: 'Bentuk huruf H dan A menyatu tertawa HA', similarTo: ['ほ', 'け'], exampleWord: { wordJapanese: 'はな', wordRomaji: 'hana', wordIndonesian: 'bunga / hidung' } },
  { id: 'h-hi', kana: 'ひ', romaji: 'hi', type: 'hiragana', group: 'hira-6', groupName: 'Stage 6: Baris H', mnemonic: 'Senyum lebar tertawa HI-HI', similarTo: ['て', 'と'], exampleWord: { wordJapanese: 'ひかり', wordRomaji: 'hikari', wordIndonesian: 'cahaya' } },
  { id: 'h-fu', kana: 'ふ', romaji: 'fu', type: 'hiragana', group: 'hira-6', groupName: 'Stage 6: Baris H', mnemonic: 'Gunung FU-ji dengan lereng kiri kanan', similarTo: ['う', 'む'], exampleWord: { wordJapanese: 'ふね', wordRomaji: 'fune', wordIndonesian: 'kapal' } },
  { id: 'h-he', kana: 'へ', romaji: 'he', type: 'hiragana', group: 'hira-6', groupName: 'Stage 6: Baris H', mnemonic: 'Gundukan bukit HE-bat naik turun', similarTo: ['く', 'つ'], exampleWord: { wordJapanese: 'へや', wordRomaji: 'heya', wordIndonesian: 'kamar' } },
  { id: 'h-ho', kana: 'ほ', romaji: 'ho', type: 'hiragana', group: 'hira-6', groupName: 'Stage 6: Baris H', mnemonic: 'Sinterklas bertopi tertawa HO-HO-HO', similarTo: ['は', 'ま'], exampleWord: { wordJapanese: 'ほし', wordRomaji: 'hoshi', wordIndonesian: 'bintang' } },

  // Stage 7: M-row (Ma Mi Mu Me Mo)
  { id: 'h-ma', kana: 'ま', romaji: 'ma', type: 'hiragana', group: 'hira-7', groupName: 'Stage 7: Baris M', mnemonic: 'Topeng MA-ska dengan tali pengikat', similarTo: ['ほ', 'も'], exampleWord: { wordJapanese: 'まつり', wordRomaji: 'matsuri', wordIndonesian: 'festival' } },
  { id: 'h-mi', kana: 'み', romaji: 'mi', type: 'hiragana', group: 'hira-7', groupName: 'Stage 7: Baris M', mnemonic: 'Angka 21 mirip nada MI', similarTo: ['む', 'よ'], exampleWord: { wordJapanese: 'みず', wordRomaji: 'mizu', wordIndonesian: 'air' } },
  { id: 'h-mu', kana: 'む', romaji: 'mu', type: 'hiragana', group: 'hira-7', groupName: 'Stage 7: Baris M', mnemonic: 'Sapi perah berbunyi MU-MU (Moo)', similarTo: ['す', 'お'], exampleWord: { wordJapanese: 'むし', wordRomaji: 'mushi', wordIndonesian: 'serangga' } },
  { id: 'h-me', kana: 'め', romaji: 'me', type: 'hiragana', group: 'hira-7', groupName: 'Stage 7: Baris M', mnemonic: 'Mie tanpa simpul bulat seperti ME-mata', similarTo: ['ぬ', 'あ'], exampleWord: { wordJapanese: 'め', wordRomaji: 'me', wordIndonesian: 'mata' } },
  { id: 'h-mo', kana: 'も', romaji: 'mo', type: 'hiragana', group: 'hira-7', groupName: 'Stage 7: Baris M', mnemonic: 'Kail pancing ganda menangkap banyak (MO-re)', similarTo: ['ま', 'し'], exampleWord: { wordJapanese: 'もり', wordRomaji: 'mori', wordIndonesian: 'hutan' } },

  // Stage 8: Y-row (Ya Yu Yo)
  { id: 'h-ya', kana: 'や', romaji: 'ya', type: 'hiragana', group: 'hira-8', groupName: 'Stage 8: Baris Y', mnemonic: 'Kapal layar YA-cht dengan bendera', similarTo: ['せ', 'か'], exampleWord: { wordJapanese: 'やま', wordRomaji: 'yama', wordIndonesian: 'gunung' } },
  { id: 'h-yu', kana: 'ゆ', romaji: 'yu', type: 'hiragana', group: 'hira-8', groupName: 'Stage 8: Baris Y', mnemonic: 'Ikan berenang mirip huruf YU', similarTo: ['わ', 'ね'], exampleWord: { wordJapanese: 'ゆき', wordRomaji: 'yuki', wordIndonesian: 'salju' } },
  { id: 'h-yo', kana: 'よ', romaji: 'yo', type: 'hiragana', group: 'hira-8', groupName: 'Stage 8: Baris Y', mnemonic: 'Mainan YO-yo dengan tali melilit', similarTo: ['ま', 'は'], exampleWord: { wordJapanese: 'よる', wordRomaji: 'yoru', wordIndonesian: 'malam' } },

  // Stage 9: R-row (Ra Ri Ru Re Ro)
  { id: 'h-ra', kana: 'ら', romaji: 'ra', type: 'hiragana', group: 'hira-9', groupName: 'Stage 9: Baris R', mnemonic: 'Orang memakai helm naik RA-ket motor', similarTo: ['ち', 'ろ'], exampleWord: { wordJapanese: 'らいおん', wordRomaji: 'raion', wordIndonesian: 'singa' } },
  { id: 'h-ri', kana: 'り', romaji: 'ri', type: 'hiragana', group: 'hira-9', groupName: 'Stage 9: Baris R', mnemonic: 'Dua helai pita pita RI-bbon melengkung', similarTo: ['い', 'こ'], exampleWord: { wordJapanese: 'りんご', wordRomaji: 'ringo', wordIndonesian: 'apel' } },
  { id: 'h-ru', kana: 'る', romaji: 'ru', type: 'hiragana', group: 'hira-9', groupName: 'Stage 9: Baris R', mnemonic: 'Jalur jalan ada bundaran RU-nding melingkar', similarTo: ['ろ', 'そ'], exampleWord: { wordJapanese: 'るす', wordRomaji: 'rusu', wordIndonesian: 'tidak di rumah' } },
  { id: 'h-re', kana: 'れ', romaji: 're', type: 'hiragana', group: 'hira-9', groupName: 'Stage 9: Baris R', mnemonic: 'Orang sedang RE-hat bersandar santai', similarTo: ['ね', 'わ'], exampleWord: { wordJapanese: 'れもん', wordRomaji: 'remon', wordIndonesian: 'lemon' } },
  { id: 'h-ro', kana: 'ろ', romaji: 'ro', type: 'hiragana', group: 'hira-9', groupName: 'Stage 9: Baris R', mnemonic: 'Jalur jalan RO-ad terbuka tanpa simpul', similarTo: ['る', 'そ'], exampleWord: { wordJapanese: 'ろうそく', wordRomaji: 'rousoku', wordIndonesian: 'lilin' } },

  // Stage 10: W & N row (Wa Wo N)
  { id: 'h-wa', kana: 'わ', romaji: 'wa', type: 'hiragana', group: 'hira-10', groupName: 'Stage 10: Baris W & N', mnemonic: 'Angsa putih WA-ngi melengkung anggun', similarTo: ['ね', 'れ'], exampleWord: { wordJapanese: 'わに', wordRomaji: 'wani', wordIndonesian: 'buaya' } },
  { id: 'h-wo', kana: 'を', romaji: 'wo', type: 'hiragana', group: 'hira-10', groupName: 'Stage 10: Baris W & N', mnemonic: 'Orang bermain skateboard teriak WO-W', similarTo: ['ち', 'と'], exampleWord: { wordJapanese: 'ほんをよむ', wordRomaji: 'hon o yomu', wordIndonesian: 'membaca buku (partikel objek)' } },
  { id: 'h-n', kana: 'ん', romaji: 'n', type: 'hiragana', group: 'hira-10', groupName: 'Stage 10: Baris W & N', mnemonic: 'Bentuk huruf cursive "n" berayun (N)', similarTo: ['え', 'そ'], exampleWord: { wordJapanese: 'ほん', wordRomaji: 'hon', wordIndonesian: 'buku' } },
];

// ----------------------------------------------------
// 2. KATAKANA ITEMS (STAGE 1 TO 10 + ALL KATAKANA)
// ----------------------------------------------------

export const KATAKANA_ITEMS: KanaItem[] = [
  // Stage 1: Vowels (A I U E O)
  { id: 'k-a', kana: 'ア', romaji: 'a', type: 'katakana', group: 'kata-1', groupName: 'Stage 1: Katakana Vokal', mnemonic: 'Sudut atap arsitektur modern (A)', similarTo: ['マ', 'ヤ'], exampleWord: { wordJapanese: 'アイス', wordRomaji: 'aisu', wordIndonesian: 'es krim' } },
  { id: 'k-i', kana: 'イ', romaji: 'i', type: 'katakana', group: 'kata-1', groupName: 'Stage 1: Katakana Vokal', mnemonic: 'Orang berdiri tegak berpose (I)', similarTo: ['ト', 'ノ'], exampleWord: { wordJapanese: 'インク', wordRomaji: 'inku', wordIndonesian: 'tinta' } },
  { id: 'k-u', kana: 'ウ', romaji: 'u', type: 'katakana', group: 'kata-1', groupName: 'Stage 1: Katakana Vokal', mnemonic: 'Topi pelindung luar angkasa (U)', similarTo: ['ワ', 'フ'], exampleWord: { wordJapanese: 'ウクレレ', wordRomaji: 'ukurere', wordIndonesian: 'ukulele' } },
  { id: 'k-e', kana: 'エ', romaji: 'e', type: 'katakana', group: 'kata-1', groupName: 'Stage 1: Katakana Vokal', mnemonic: 'Rangka besi lift elevator (E)', similarTo: ['工', 'コ'], exampleWord: { wordJapanese: 'エレベーター', wordRomaji: 'erebeetaa', wordIndonesian: 'lift / elevator' } },
  { id: 'k-o', kana: 'オ', romaji: 'o', type: 'katakana', group: 'kata-1', groupName: 'Stage 1: Katakana Vokal', mnemonic: 'Penyanyi opera merentangkan lengan (O)', similarTo: ['ホ', '木'], exampleWord: { wordJapanese: 'オレンジ', wordRomaji: 'orenji', wordIndonesian: 'jeruk / oranye' } },

  // Stage 2: K-row (Ka Ki Ku Ke Ko)
  { id: 'k-ka', kana: 'カ', romaji: 'ka', type: 'katakana', group: 'kata-2', groupName: 'Stage 2: Katakana Baris K', mnemonic: 'Siku tangan memegang kamera (KA)', similarTo: ['力', 'ガ'], exampleWord: { wordJapanese: 'カメラ', wordRomaji: 'kamera', wordIndonesian: 'kamera' } },
  { id: 'k-ki', kana: 'キ', romaji: 'ki', type: 'katakana', group: 'kata-2', groupName: 'Stage 2: Katakana Baris K', mnemonic: 'Gantungan kunci logam tajam (KI)', similarTo: ['チ', 'テ'], exampleWord: { wordJapanese: 'キー', wordRomaji: 'kii', wordIndonesian: 'kunci' } },
  { id: 'k-ku', kana: 'ク', romaji: 'ku', type: 'katakana', group: 'kata-2', groupName: 'Stage 2: Katakana Baris K', mnemonic: 'Sepatu koki masak di dapur (KU)', similarTo: ['ワ', 'タ'], exampleWord: { wordJapanese: 'クラス', wordRomaji: 'kurasu', wordIndonesian: 'kelas' } },
  { id: 'k-ke', kana: 'ケ', romaji: 'ke', type: 'katakana', group: 'kata-2', groupName: 'Stage 2: Katakana Baris K', mnemonic: 'Pisau pemotong kue ulang tahun (KE)', similarTo: ['ク', 'テ'], exampleWord: { wordJapanese: 'ケーキ', wordRomaji: 'keeki', wordIndonesian: 'kue / cake' } },
  { id: 'k-ko', kana: 'コ', romaji: 'ko', type: 'katakana', group: 'kata-2', groupName: 'Stage 2: Katakana Baris K', mnemonic: 'Kotak persegi terbuka (KO)', similarTo: ['ユ', 'エ'], exampleWord: { wordJapanese: 'コーヒー', wordRomaji: 'koohii', wordIndonesian: 'kopi' } },

  // Stage 3: S-row (Sa Shi Su Se So)
  { id: 'k-sa', kana: 'サ', romaji: 'sa', type: 'katakana', group: 'kata-3', groupName: 'Stage 3: Katakana Baris S', mnemonic: 'Tiang gawang sepak bola (SA)', similarTo: ['セ', 'ナ'], exampleWord: { wordJapanese: 'サッカー', wordRomaji: 'sakkaa', wordIndonesian: 'sepak bola' } },
  { id: 'k-shi', kana: 'シ', romaji: 'shi', type: 'katakana', group: 'kata-3', groupName: 'Stage 3: Katakana Baris S', mnemonic: 'Mata tersenyum melihat ke atas (SHI - 3 titik dari bawah)', similarTo: ['ツ', 'ソ', 'ン'], exampleWord: { wordJapanese: 'シャツ', wordRomaji: 'shatsu', wordIndonesian: 'kemeja' } },
  { id: 'k-su', kana: 'ス', romaji: 'su', type: 'katakana', group: 'kata-3', groupName: 'Stage 3: Katakana Baris S', mnemonic: 'Papan seluncur ski es meluncur (SU)', similarTo: ['ヌ', 'ラ'], exampleWord: { wordJapanese: 'スキー', wordRomaji: 'sukii', wordIndonesian: 'ski' } },
  { id: 'k-se', kana: 'セ', romaji: 'se', type: 'katakana', group: 'kata-3', groupName: 'Stage 3: Katakana Baris S', mnemonic: 'Orang memakai sweter hangat (SE)', similarTo: ['サ', 'ヒ'], exampleWord: { wordJapanese: 'セーター', wordRomaji: 'seetaa', wordIndonesian: 'sweter' } },
  { id: 'k-so', kana: 'ソ', romaji: 'so', type: 'katakana', group: 'kata-3', groupName: 'Stage 3: Katakana Baris S', mnemonic: 'Jarum menjahit menusuk ke bawah (SO - goresan dari atas)', similarTo: ['ン', 'シ', 'ツ'], exampleWord: { wordJapanese: 'ソファ', wordRomaji: 'sofa', wordIndonesian: 'sofa' } },

  // Stage 4: T-row (Ta Chi Tsu Te To)
  { id: 'k-ta', kana: 'タ', romaji: 'ta', type: 'katakana', group: 'kata-4', groupName: 'Stage 4: Katakana Baris T', mnemonic: 'Lampu taksi di atap mobil (TA)', similarTo: ['ク', 'ケ'], exampleWord: { wordJapanese: 'タクシー', wordRomaji: 'takushii', wordIndonesian: 'taksi' } },
  { id: 'k-chi', kana: 'チ', romaji: 'chi', type: 'katakana', group: 'kata-4', groupName: 'Stage 4: Katakana Baris T', mnemonic: 'Pemandu sorak cheerleaders (CHI)', similarTo: ['テ', 'キ'], exampleWord: { wordJapanese: 'チーズ', wordRomaji: 'chiizu', wordIndonesian: 'keju' } },
  { id: 'k-tsu', kana: 'ツ', romaji: 'tsu', type: 'katakana', group: 'kata-4', groupName: 'Stage 4: Katakana Baris T', mnemonic: 'Dua jarum menusuk ke bawah (TSU - dari atas ke bawah)', similarTo: ['シ', 'ソ', 'ン'], exampleWord: { wordJapanese: 'ツアー', wordRomaji: 'tsuaa', wordIndonesian: 'tur / wisata' } },
  { id: 'k-te', kana: 'テ', romaji: 'te', type: 'katakana', group: 'kata-4', groupName: 'Stage 4: Katakana Baris T', mnemonic: 'Antena televisi jadul bercabang (TE)', similarTo: ['チ', 'ケ'], exampleWord: { wordJapanese: 'テレビ', wordRomaji: 'terebi', wordIndonesian: 'televisi' } },
  { id: 'k-to', kana: 'ト', romaji: 'to', type: 'katakana', group: 'kata-4', groupName: 'Stage 4: Katakana Baris T', mnemonic: 'Gagang tombak tajam (TO)', similarTo: ['イ', 'ド'], exampleWord: { wordJapanese: 'トマト', wordRomaji: 'tomato', wordIndonesian: 'tomat' } },

  // Stage 5: N-row (Na Ni Nu Ne No)
  { id: 'k-na', kana: 'ナ', romaji: 'na', type: 'katakana', group: 'kata-5', groupName: 'Stage 5: Katakana Baris N', mnemonic: 'Gagang pisau tajam (NA-ifu)', similarTo: ['メ', 'サ'], exampleWord: { wordJapanese: 'ナイフ', wordRomaji: 'naifu', wordIndonesian: 'pisau' } },
  { id: 'k-ni', kana: 'ニ', romaji: 'ni', type: 'katakana', group: 'kata-5', groupName: 'Stage 5: Katakana Baris N', mnemonic: 'Dua garis sejajar horizontal (angka NI = 2)', similarTo: ['ミ', 'こ'], exampleWord: { wordJapanese: 'ニュース', wordRomaji: 'nyuusu', wordIndonesian: 'berita' } },
  { id: 'k-nu', kana: 'ヌ', romaji: 'nu', type: 'katakana', group: 'kata-5', groupName: 'Stage 5: Katakana Baris N', mnemonic: 'Sumpit menyilang mangkok mi (NU-doru)', similarTo: ['ス', 'マ'], exampleWord: { wordJapanese: 'ヌードル', wordRomaji: 'nuudoru', wordIndonesian: 'mi / noodle' } },
  { id: 'k-ne', kana: 'ネ', romaji: 'ne', type: 'katakana', group: 'kata-5', groupName: 'Stage 5: Katakana Baris N', mnemonic: 'Pria berdasi rapi (NE-kutai)', similarTo: ['ホ', '木'], exampleWord: { wordJapanese: 'ネクタイ', wordRomaji: 'nekutai', wordIndonesian: 'dasi' } },
  { id: 'k-no', kana: 'ノ', romaji: 'no', type: 'katakana', group: 'kata-5', groupName: 'Stage 5: Katakana Baris N', mnemonic: 'Satu garis miring menulis di buku catatan (NO-to)', similarTo: ['ソ', 'ン'], exampleWord: { wordJapanese: 'ノート', wordRomaji: 'nooto', wordIndonesian: 'buku catatan' } },

  // Stage 6: H-row (Ha Hi Fu He Ho)
  { id: 'k-ha', kana: 'ハ', romaji: 'ha', type: 'katakana', group: 'kata-6', groupName: 'Stage 6: Katakana Baris H', mnemonic: 'Dua sisi roti hamburger (HA)', similarTo: ['八', 'ル'], exampleWord: { wordJapanese: 'ハンバーガー', wordRomaji: 'hanbaagaa', wordIndonesian: 'hamburger' } },
  { id: 'k-hi', kana: 'ヒ', romaji: 'hi', type: 'katakana', group: 'kata-6', groupName: 'Stage 6: Katakana Baris H', mnemonic: 'Pahlawan bertopeng berdiri gagah (HI-roo)', similarTo: ['セ', '七'], exampleWord: { wordJapanese: 'ヒーロー', wordRomaji: 'hiiroo', wordIndonesian: 'pahlawan' } },
  { id: 'k-fu', kana: 'フ', romaji: 'fu', type: 'katakana', group: 'kata-6', groupName: 'Stage 6: Katakana Baris H', mnemonic: 'Bentuk garpu makan melengkung (FU-fork)', similarTo: ['ラ', 'ワ'], exampleWord: { wordJapanese: 'フォーク', wordRomaji: 'fooku', wordIndonesian: 'garpu' } },
  { id: 'k-he', kana: 'ヘ', romaji: 'he', type: 'katakana', group: 'kata-6', groupName: 'Stage 6: Katakana Baris H', mnemonic: 'Baling-baling helikopter (HE) persis seperti Hiragana', similarTo: ['へ', 'く'], exampleWord: { wordJapanese: 'ヘリコプター', wordRomaji: 'herikoputaa', wordIndonesian: 'helikopter' } },
  { id: 'k-ho', kana: 'ホ', romaji: 'ho', type: 'katakana', group: 'kata-6', groupName: 'Stage 6: Katakana Baris H', mnemonic: 'Tanda palang di pintu hotel (HO)', similarTo: ['オ', '木'], exampleWord: { wordJapanese: 'ホテル', wordRomaji: 'hoteru', wordIndonesian: 'hotel' } },

  // Stage 7: M-row (Ma Mi Mu Me Mo)
  { id: 'k-ma', kana: 'マ', romaji: 'ma', type: 'katakana', group: 'kata-7', groupName: 'Stage 7: Katakana Baris M', mnemonic: 'Kain masker penutup wajah (MA)', similarTo: ['ア', 'ム'], exampleWord: { wordJapanese: 'マスク', wordRomaji: 'masuku', wordIndonesian: 'masker' } },
  { id: 'k-mi', kana: 'ミ', romaji: 'mi', type: 'katakana', group: 'kata-7', groupName: 'Stage 7: Katakana Baris M', mnemonic: 'Tiga tetesan susu segar (MI-ruku)', similarTo: ['シ', 'ニ'], exampleWord: { wordJapanese: 'ミルク', wordRomaji: 'miruku', wordIndonesian: 'susu' } },
  { id: 'k-mu', kana: 'ム', romaji: 'mu', type: 'katakana', group: 'kata-7', groupName: 'Stage 7: Katakana Baris M', mnemonic: 'Segitiga pemutar film bioskop (MU-bii)', similarTo: ['マ', 'ラ'], exampleWord: { wordJapanese: 'ムービー', wordRomaji: 'muubii', wordIndonesian: 'film' } },
  { id: 'k-me', kana: 'メ', romaji: 'me', type: 'katakana', group: 'kata-7', groupName: 'Stage 7: Katakana Baris M', mnemonic: 'Garis potongan buah melon (ME)', similarTo: ['ナ', 'ヌ'], exampleWord: { wordJapanese: 'メロン', wordRomaji: 'meron', wordIndonesian: 'melon' } },
  { id: 'k-mo', kana: 'モ', romaji: 'mo', type: 'katakana', group: 'kata-7', groupName: 'Stage 7: Katakana Baris M', mnemonic: 'Layar monitor komputer bersiku (MO)', similarTo: ['テ', 'ラ'], exampleWord: { wordJapanese: 'モニター', wordRomaji: 'monitaa', wordIndonesian: 'monitor' } },

  // Stage 8: Y-row (Ya Yu Yo)
  { id: 'k-ya', kana: 'ヤ', romaji: 'ya', type: 'katakana', group: 'kata-8', groupName: 'Stage 8: Katakana Baris Y', mnemonic: 'Pohon kelapa yashi di pantai (YA)', similarTo: ['セ', 'マ'], exampleWord: { wordJapanese: 'ヤシ', wordRomaji: 'yashi', wordIndonesian: 'pohon kelapa' } },
  { id: 'k-yu', kana: 'ユ', romaji: 'yu', type: 'katakana', group: 'kata-8', groupName: 'Stage 8: Katakana Baris Y', mnemonic: 'Kerah seragam serasi (YU-nifoomu)', similarTo: ['コ', 'エ'], exampleWord: { wordJapanese: 'ユニフォーム', wordRomaji: 'yunifoomu', wordIndonesian: 'seragam' } },
  { id: 'k-yo', kana: 'ヨ', romaji: 'yo', type: 'katakana', group: 'kata-8', groupName: 'Stage 8: Katakana Baris Y', mnemonic: 'Sendok makan cup yogurt (YO)', similarTo: ['コ', 'ユ'], exampleWord: { wordJapanese: 'ヨーグルト', wordRomaji: 'yooguruto', wordIndonesian: 'yogurt' } },

  // Stage 9: R-row (Ra Ri Ru Re Ro)
  { id: 'k-ra', kana: 'ラ', romaji: 'ra', type: 'katakana', group: 'kata-9', groupName: 'Stage 9: Katakana Baris R', mnemonic: 'Antena radio bersudut (RA)', similarTo: ['フ', 'ウ'], exampleWord: { wordJapanese: 'ラジオ', wordRomaji: 'rajio', wordIndonesian: 'radio' } },
  { id: 'k-ri', kana: 'リ', romaji: 'ri', type: 'katakana', group: 'kata-9', groupName: 'Stage 9: Katakana Baris R', mnemonic: 'Dua garis daftar belanjaan (RI-suto)', similarTo: ['り', 'ル'], exampleWord: { wordJapanese: 'リスト', wordRomaji: 'risuto', wordIndonesian: 'daftar / list' } },
  { id: 'k-ru', kana: 'ル', romaji: 'ru', type: 'katakana', group: 'kata-9', groupName: 'Stage 9: Katakana Baris R', mnemonic: 'Dua pilar aturan tata tertib (RU-uru)', similarTo: ['レ', 'ハ'], exampleWord: { wordJapanese: 'ルール', wordRomaji: 'ruuru', wordIndonesian: 'aturan / rules' } },
  { id: 'k-re', kana: 'レ', romaji: 're', type: 'katakana', group: 'kata-9', groupName: 'Stage 9: Katakana Baris R', mnemonic: 'Piring dan sendok restoran (RE)', similarTo: ['ル', 'フ'], exampleWord: { wordJapanese: 'レストラン', wordRomaji: 'resutoran', wordIndonesian: 'restoran' } },
  { id: 'k-ro', kana: 'ロ', romaji: 'ro', type: 'katakana', group: 'kata-9', groupName: 'Stage 9: Katakana Baris R', mnemonic: 'Bentuk kotak badan robot (RO)', similarTo: ['コ', '口'], exampleWord: { wordJapanese: 'ロボット', wordRomaji: 'robotto', wordIndonesian: 'robot' } },

  // Stage 10: W & N row (Wa Wo N)
  { id: 'k-wa', kana: 'ワ', romaji: 'wa', type: 'katakana', group: 'kata-10', groupName: 'Stage 10: Katakana Baris W & N', mnemonic: 'Gelas anggur wine bersudut (WA)', similarTo: ['ウ', 'フ'], exampleWord: { wordJapanese: 'ワイン', wordRomaji: 'wain', wordIndonesian: 'anggur / wine' } },
  { id: 'k-wo', kana: 'ヲ', romaji: 'wo', type: 'katakana', group: 'kata-10', groupName: 'Stage 10: Katakana Baris W & N', mnemonic: 'Orang mendayung kano (WO)', similarTo: ['フ', 'ラ'], exampleWord: { wordJapanese: 'ヲ', wordRomaji: 'wo', wordIndonesian: 'partikel penanda kata khusus' } },
  { id: 'k-n', kana: 'ン', romaji: 'n', type: 'katakana', group: 'kata-10', groupName: 'Stage 10: Katakana Baris W & N', mnemonic: 'Satu garis naik dari bawah (N - berlawanan arah dengan SO)', similarTo: ['ソ', 'シ', 'ツ'], exampleWord: { wordJapanese: 'パン', wordRomaji: 'pan', wordIndonesian: 'roti' } },
];

// Combine all 46 + 46 = 92 basic kana items
export const ALL_KANA_ITEMS: KanaItem[] = [...HIRAGANA_ITEMS, ...KATAKANA_ITEMS];

// ----------------------------------------------------
// 3. STRUCTURED KANA STAGE GROUPS
// ----------------------------------------------------

export const KANA_GROUPS: KanaGroup[] = [
  // --- HIRAGANA STAGES (1 to 10) ---
  {
    id: 'hira-1',
    type: 'hiragana',
    stageNumber: 1,
    name: 'Stage 1: Vokal (あ い う え お)',
    title: 'あ い う え お',
    description: '5 huruf vokal utama fondasi bahasa Jepang',
    order: 1,
    boss: {
      name: 'Oni Kabut Vokal',
      title: 'Penjaga Gerbang A-I-U-E-O 👹',
      avatar: '👺',
      description: 'Kalahkan kabut kebingungan huruf vokal untuk membuka Stage 2!',
      hp: 10,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-1'),
  },
  {
    id: 'hira-2',
    type: 'hiragana',
    stageNumber: 2,
    name: 'Stage 2: Baris K (か き く け こ)',
    title: 'か き く け こ',
    description: 'Huruf konsonan K yang renyah dan berenergi',
    order: 2,
    boss: {
      name: 'Tengu Angin Ka',
      title: 'Penjaga Badai Baris K 🦅',
      avatar: '🦅',
      description: 'Buktikan ingatan tajammu pada baris konsonan Ka-Ki-Ku-Ke-Ko!',
      hp: 12,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-2'),
  },
  {
    id: 'hira-3',
    type: 'hiragana',
    stageNumber: 3,
    name: 'Stage 3: Baris S (さ し す せ そ)',
    title: 'さ し す せ そ',
    description: 'Huruf desis halus khas Jepang, waspadai Shi & Su',
    order: 3,
    boss: {
      name: 'Kitsune Desir Halus',
      title: 'Rubah Ilusi Shi & Sa 🦊',
      avatar: '🦊',
      description: 'Waspadai perbedaan huruf Sa (さ) dan Shi (し)!',
      hp: 12,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-3'),
  },
  {
    id: 'hira-4',
    type: 'hiragana',
    stageNumber: 4,
    name: 'Stage 4: Baris T (た ち つ て と)',
    title: 'た ち つ て と',
    description: 'Kombinasi Ta, Chi, Tsu, Te, To yang ekspresif',
    order: 4,
    boss: {
      name: 'Ryuu Ombak Tsunami',
      title: 'Naga Penguasa Chi & Tsu 🐉',
      avatar: '🐉',
      description: 'Buktikan kamu tidak tertukar antara Chi (ち) dan Tsu (つ)!',
      hp: 12,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-4'),
  },
  {
    id: 'hira-5',
    type: 'hiragana',
    stageNumber: 5,
    name: 'Stage 5: Baris N (な に ぬ ね の)',
    title: 'な に ぬ ね の',
    description: 'Huruf lembut Na, Ni, Nu, Ne, No penuh simpul',
    order: 5,
    boss: {
      name: 'Siluman Simpul Neko',
      title: 'Teka-Teki Simpul Nu & Ne 🪢',
      avatar: '🪢',
      description: 'Uji ketelitianmu pada simpul Nu (ぬ) dan Ne (ね)!',
      hp: 12,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-5'),
  },
  {
    id: 'hira-6',
    type: 'hiragana',
    stageNumber: 6,
    name: 'Stage 6: Baris H (は ひ ふ へ ほ)',
    title: 'は ひ ふ へ ほ',
    description: 'Huruf desah Ha, Hi, Fu, He, Ho dengan lekukan anggun',
    order: 6,
    boss: {
      name: 'Shogun Api Fuji',
      title: 'Pendekar Gunung Fu & Ho 🌋',
      avatar: '⚔️',
      description: 'Bedakan Ha (は) dan Ho (ほ) dengan ketajaman mata seorang samurai!',
      hp: 12,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-6'),
  },
  {
    id: 'hira-7',
    type: 'hiragana',
    stageNumber: 7,
    name: 'Stage 7: Baris M (ま み む め も)',
    title: 'ま み む め も',
    description: 'Huruf bibir Ma, Mi, Mu, Me, Mo yang lembut',
    order: 7,
    boss: {
      name: 'Tanuki Festival Malam',
      title: 'Musang Penggoda Me & Mu 🏮',
      avatar: '🏮',
      description: 'Jangan sampai tertipu antara Me (め) dan Nu (ぬ)!',
      hp: 12,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-7'),
  },
  {
    id: 'hira-8',
    type: 'hiragana',
    stageNumber: 8,
    name: 'Stage 8: Baris Y (や ゆ よ)',
    title: 'や ゆ よ',
    description: '3 huruf semivokal dinamis Ya, Yu, Yo',
    order: 8,
    boss: {
      name: 'Garuda Salju Yuki',
      title: 'Elang Salju Puncak Ya-Yu-Yo ❄️',
      avatar: '❄️',
      description: 'Kuasai 3 huruf gesit ini dengan kecepatan refleks penuh!',
      hp: 10,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-8'),
  },
  {
    id: 'hira-9',
    type: 'hiragana',
    stageNumber: 9,
    name: 'Stage 9: Baris R (ら り る れ ろ)',
    title: 'ら り る れ ろ',
    description: 'Lafal getar lidah Ra, Ri, Ru, Re, Ro',
    order: 9,
    boss: {
      name: 'Ksatria Lilin Sakura',
      title: 'Penjaga Jalur Ru & Ro 🕯️',
      avatar: '🕯️',
      description: 'Tunjukkan ketelitian membedakan Ru (る) dan Ro (ろ)!',
      hp: 12,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-9'),
  },
  {
    id: 'hira-10',
    type: 'hiragana',
    stageNumber: 10,
    name: 'Stage 10: Baris W & N (わ を ん)',
    title: 'わ を ん',
    description: '3 huruf penutup sakral Wa, Wo, dan konsonan tunggal N',
    order: 10,
    boss: {
      name: 'Kaisar Angsa Emas',
      title: 'Penguasa Akhir Hiragana 👑',
      avatar: '🦢',
      description: 'Kalahkan penjaga terakhir untuk membuka mode 🔥 ALL HIRAGANA!',
      hp: 14,
    },
    items: HIRAGANA_ITEMS.filter((i) => i.group === 'hira-10'),
  },

  // --- SPECIAL MASTER HIRAGANA ---
  {
    id: 'hira-all',
    type: 'hiragana',
    stageNumber: 11,
    isMasterStage: true,
    name: '🔥 ALL HIRAGANA',
    title: '46 Huruf Lengkap',
    description: 'Tantangan acak seluruh 46 karakter Hiragana tanpa batas!',
    order: 11,
    boss: {
      name: 'Dewa Hiragana Agung',
      title: 'Penguasa 46 Aksara Sejati ⛩️',
      avatar: '⛩️',
      description: 'Uji penguasaan mutlak seluruh 46 aksara Hiragana!',
      hp: 20,
    },
    items: HIRAGANA_ITEMS,
  },

  // --- KATAKANA STAGES (1 to 10) ---
  {
    id: 'kata-1',
    type: 'katakana',
    stageNumber: 1,
    name: 'Stage 1: Katakana Vokal (ア イ ウ エ オ)',
    title: 'ア イ ウ エ オ',
    description: 'Sudut tegas modern untuk kata serapan asing',
    order: 12,
    boss: {
      name: 'Cyber Mech Vokal',
      title: 'Penjaga Sudut Tajam A-I-U-E-O 🤖',
      avatar: '🤖',
      description: 'Kuasai sudut tajam Katakana Vokal untuk melaju ke Stage 2!',
      hp: 10,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-1'),
  },
  {
    id: 'kata-2',
    type: 'katakana',
    stageNumber: 2,
    name: 'Stage 2: Katakana Baris K (カ キ ク ケ コ)',
    title: 'カ キ ク ケ コ',
    description: 'Garis presisi Katakana Ka, Ki, Ku, Ke, Ko',
    order: 13,
    boss: {
      name: 'Drone Laser Ka',
      title: 'Pengawal Presisi Baris K 🛸',
      avatar: '🛸',
      description: 'Uji ketepatan refleksmu mengenali sudut Katakana K!',
      hp: 12,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-2'),
  },
  {
    id: 'kata-3',
    type: 'katakana',
    stageNumber: 3,
    name: 'Stage 3: Katakana Baris S (サ シ ス セ ソ)',
    title: 'サ シ ス セ ソ',
    description: 'Waspadai goresan Shi (シ) dan So (ソ)',
    order: 14,
    boss: {
      name: 'Hologram Ilusi Shi & So',
      title: 'Teka-Teki Arah Goresan Ganda ⚡',
      avatar: '⚡',
      description: 'Perhatikan arah goresan Shi (dari bawah) dan So (dari atas)!',
      hp: 12,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-3'),
  },
  {
    id: 'kata-4',
    type: 'katakana',
    stageNumber: 4,
    name: 'Stage 4: Katakana Baris T (タ チ ツ テ ト)',
    title: 'タ チ ツ テ ト',
    description: 'Tantangan Tsu (ツ) vs Chi & Te',
    order: 15,
    boss: {
      name: 'Android Tsu-Nami',
      title: 'Master Kembar Shi vs Tsu 🦾',
      avatar: '🦾',
      description: 'Buktikan kemampuanmu membedakan Tsu (ツ) dan Shi (シ)!',
      hp: 12,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-4'),
  },
  {
    id: 'kata-5',
    type: 'katakana',
    stageNumber: 5,
    name: 'Stage 5: Katakana Baris N (ナ ニ ヌ ネ ノ)',
    title: 'ナ ニ ヌ ネ ノ',
    description: 'Bentuk pisau Na dan dasi Ne yang rapi',
    order: 16,
    boss: {
      name: 'Cyber Shinobi N',
      title: 'Ninja Bilah Tajam Na-Ni-Nu 🥷',
      avatar: '🥷',
      description: 'Kuasai sudut minimalis baris N tanpa ragu!',
      hp: 12,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-5'),
  },
  {
    id: 'kata-6',
    type: 'katakana',
    stageNumber: 6,
    name: 'Stage 6: Katakana Baris H (ハ ヒ フ ヘ ホ)',
    title: 'ハ ヒ フ ヘ ホ',
    description: 'Garis Ha, garpu Fu, dan tanda silang Ho',
    order: 17,
    boss: {
      name: 'Titan Vulkanik Ho',
      title: 'Benteng Baja Ha-Fu-Ho 🛡️',
      avatar: '🛡️',
      description: 'Hancurkan pertahanan bos dengan ketajaman membedakan Fu dan Ra!',
      hp: 12,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-6'),
  },
  {
    id: 'kata-7',
    type: 'katakana',
    stageNumber: 7,
    name: 'Stage 7: Katakana Baris M (マ ミ ム メ モ)',
    title: 'マ ミ ム メ モ',
    description: 'Tiga garis Mi dan siku tajam Ma & Mu',
    order: 18,
    boss: {
      name: 'Cyber Tanuki Neon',
      title: 'Musang Digital Ma-Mu-Me 🦝',
      avatar: '🦝',
      description: 'Waspadai kemiripan Ma (マ) dan Mu (ム)!',
      hp: 12,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-7'),
  },
  {
    id: 'kata-8',
    type: 'katakana',
    stageNumber: 8,
    name: 'Stage 8: Katakana Baris Y (ヤ ユ ヨ)',
    title: 'ヤ ユ ヨ',
    description: '3 aksara seragam serbaguna Ya, Yu, Yo',
    order: 19,
    boss: {
      name: 'Phoenix Neon Shibuya',
      title: 'Burung Api Ya-Yu-Yo 🔥',
      avatar: '🔥',
      description: 'Kuasai 3 aksara modern ini dalam hitungan milidetik!',
      hp: 10,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-8'),
  },
  {
    id: 'kata-9',
    type: 'katakana',
    stageNumber: 9,
    name: 'Stage 9: Katakana Baris R (ラ リ ル レ ロ)',
    title: 'ラ リ ル レ ロ',
    description: 'Kotak Robot Ro dan dua tiang Ru & Re',
    order: 20,
    boss: {
      name: 'Gundam Mecha Ro',
      title: 'Raksasa Baja Ra-Ru-Ro 🤖',
      avatar: '🤖',
      description: 'Taklukkan pilar baja Katakana baris R!',
      hp: 12,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-9'),
  },
  {
    id: 'kata-10',
    type: 'katakana',
    stageNumber: 10,
    name: 'Stage 10: Katakana Baris W & N (ワ ヲ ン)',
    title: 'ワ ヲ ン',
    description: 'Penutup Katakana Wa, Wo, dan N',
    order: 21,
    boss: {
      name: 'Kaisar Cyber Neo-Tokyo',
      title: 'Penguasa Akhir Katakana 👑',
      avatar: '👑',
      description: 'Kalahkan penjaga terakhir untuk membuka mode 🔥 ALL KATAKANA!',
      hp: 14,
    },
    items: KATAKANA_ITEMS.filter((i) => i.group === 'kata-10'),
  },

  // --- SPECIAL MASTER KATAKANA ---
  {
    id: 'kata-all',
    type: 'katakana',
    stageNumber: 11,
    isMasterStage: true,
    name: '🔥 ALL KATAKANA',
    title: '46 Huruf Lengkap',
    description: 'Tantangan acak seluruh 46 karakter Katakana tanpa batas!',
    order: 22,
    boss: {
      name: 'Dewa Katakana Cyber',
      title: 'Penguasa 46 Aksara Modern ⛩️',
      avatar: '⛩️',
      description: 'Uji penguasaan mutlak seluruh 46 aksara Katakana!',
      hp: 20,
    },
    items: KATAKANA_ITEMS,
  },

  // --- ULTIMATE MIX MASTER (HIRAGANA + KATAKANA) ---
  {
    id: 'mix-master',
    type: 'mixed',
    stageNumber: 12,
    isMixMaster: true,
    name: '👑 MIX MASTER',
    title: 'Hiragana & Katakana (92 Huruf)',
    description: 'Tantangan pamungkas menguji refleks gabungan Hiragana & Katakana!',
    order: 23,
    boss: {
      name: 'Raja Aksara Nusantara-Jepang',
      title: 'Master Tak Terkalahkan 👑',
      avatar: '👑',
      description: 'Mode tersulit untuk membuktikan dirimu Master Sejati Bahasa Jepang!',
      hp: 25,
    },
    items: ALL_KANA_ITEMS,
  },
];

// Helper functions
export function getKanaById(id: string): KanaItem | undefined {
  return ALL_KANA_ITEMS.find((k) => k.id === id);
}

export function getKanaByCharacter(char: string): KanaItem | undefined {
  return ALL_KANA_ITEMS.find((k) => k.kana === char);
}

export function getGroupById(groupId: string): KanaGroup | undefined {
  // Support legacy group IDs for seamless backwards-compatibility
  if (groupId === 'hira-vowels') return KANA_GROUPS.find((g) => g.id === 'hira-1');
  if (groupId === 'hira-k') return KANA_GROUPS.find((g) => g.id === 'hira-2');
  if (groupId === 'hira-s') return KANA_GROUPS.find((g) => g.id === 'hira-3');
  if (groupId === 'hira-t') return KANA_GROUPS.find((g) => g.id === 'hira-4');
  if (groupId === 'hira-n') return KANA_GROUPS.find((g) => g.id === 'hira-5');
  if (groupId === 'kata-vowels') return KANA_GROUPS.find((g) => g.id === 'kata-1');

  return KANA_GROUPS.find((g) => g.id === groupId);
}
