export interface Character {
  jp: string;
  romaji: string;
  meaning?: string;
  example?: string;
  onyomi?: string;
  kunyomi?: string;
}

export const HIRAGANA: Character[] = [
  { jp: 'あ', romaji: 'a' }, { jp: 'い', romaji: 'i' }, { jp: 'う', romaji: 'u' }, { jp: 'え', romaji: 'e' }, { jp: 'お', romaji: 'o' },
  { jp: 'か', romaji: 'ka' }, { jp: 'き', romaji: 'ki' }, { jp: 'く', romaji: 'ku' }, { jp: 'け', romaji: 'ke' }, { jp: 'こ', romaji: 'ko' },
  { jp: 'さ', romaji: 'sa' }, { jp: 'し', romaji: 'shi' }, { jp: 'す', romaji: 'su' }, { jp: 'せ', romaji: 'se' }, { jp: 'そ', romaji: 'so' },
  { jp: 'た', romaji: 'ta' }, { jp: 'ち', romaji: 'chi' }, { jp: 'つ', romaji: 'tsu' }, { jp: 'て', romaji: 'te' }, { jp: 'と', romaji: 'to' },
  { jp: 'な', romaji: 'na' }, { jp: 'に', romaji: 'ni' }, { jp: 'ぬ', romaji: 'nu' }, { jp: 'ね', romaji: 'ne' }, { jp: 'の', romaji: 'no' },
  { jp: 'は', romaji: 'ha' }, { jp: 'ひ', romaji: 'hi' }, { jp: 'ふ', romaji: 'fu' }, { jp: 'へ', romaji: 'he' }, { jp: 'ほ', romaji: 'ho' },
  { jp: 'ま', romaji: 'ma' }, { jp: 'み', romaji: 'mi' }, { jp: 'む', romaji: 'mu' }, { jp: 'め', romaji: 'me' }, { jp: 'も', romaji: 'mo' },
  { jp: 'や', romaji: 'ya' }, { jp: 'ゆ', romaji: 'yu' }, { jp: 'よ', romaji: 'yo' },
  { jp: 'ら', romaji: 'ra' }, { jp: 'り', romaji: 'ri' }, { jp: 'る', romaji: 'ru' }, { jp: 'れ', romaji: 're' }, { jp: 'ろ', romaji: 'ro' },
  { jp: 'わ', romaji: 'wa' }, { jp: 'を', romaji: 'wo' }, { jp: 'ん', romaji: 'n' }
];

export const KATAKANA: Character[] = [
  { jp: 'ア', romaji: 'a' }, { jp: 'イ', romaji: 'i' }, { jp: 'ウ', romaji: 'u' }, { jp: 'エ', romaji: 'e' }, { jp: 'オ', romaji: 'o' },
  { jp: 'カ', romaji: 'ka' }, { jp: 'キ', romaji: 'ki' }, { jp: 'ク', romaji: 'ku' }, { jp: 'ケ', romaji: 'ke' }, { jp: 'コ', romaji: 'ko' },
  { jp: 'サ', romaji: 'sa' }, { jp: 'シ', romaji: 'shi' }, { jp: 'ス', romaji: 'su' }, { jp: 'セ', romaji: 'se' }, { jp: 'ソ', romaji: 'so' },
  { jp: 'タ', romaji: 'ta' }, { jp: 'ち', romaji: 'chi' }, { jp: 'ツ', romaji: 'tsu' }, { jp: 'テ', romaji: 'te' }, { jp: 'ト', romaji: 'to' },
  { jp: 'ナ', romaji: 'na' }, { jp: 'ニ', romaji: 'ni' }, { jp: 'ヌ', romaji: 'nu' }, { jp: 'ネ', romaji: 'ne' }, { jp: 'ノ', romaji: 'no' },
  { jp: 'ハ', romaji: 'ha' }, { jp: 'ヒ', romaji: 'hi' }, { jp: 'フ', romaji: 'fu' }, { jp: 'ヘ', romaji: 'he' }, { jp: 'ホ', romaji: 'ho' },
  { jp: 'マ', romaji: 'ma' }, { jp: 'ミ', romaji: 'mi' }, { jp: 'ム', romaji: 'mu' }, { jp: 'メ', romaji: 'me' }, { jp: 'モ', romaji: 'mo' },
  { jp: 'ヤ', romaji: 'ya' }, { jp: 'ユ', romaji: 'yu' }, { jp: 'ヨ', romaji: 'yo' },
  { jp: 'ら', romaji: 'ra' }, { jp: 'り', romaji: 'ri' }, { jp: 'る', romaji: 'ru' }, { jp: 'レ', romaji: 're' }, { jp: 'ロ', romaji: 'ro' },
  { jp: 'ワ', romaji: 'wa' }, { jp: 'ヲ', romaji: 'wo' }, { jp: 'ン', romaji: 'n' }
];

export const KANJI_N5: Character[] = [
  { jp: '日', romaji: 'hi', meaning: 'Sun / Day', example: '日本 (Nihon)', onyomi: 'ニチ, ジツ', kunyomi: 'ひ, -び' },
  { jp: '月', romaji: 'tsuki', meaning: 'Moon / Month', example: '一月 (Ichigatsu)', onyomi: 'ゲツ, ガツ', kunyomi: 'つき' },
  { jp: '火', romaji: 'hi', meaning: 'Fire', example: '火曜日 (Kayoubi)', onyomi: 'カ', kunyomi: 'ひ, -び' },
  { jp: '水', romaji: 'mizu', meaning: 'Water', example: '水曜日 (Suiyoubi)', onyomi: 'スイ', kunyomi: 'みず' },
  { jp: '木', romaji: 'ki', meaning: 'Tree', example: '木曜日 (Mokuyoubi)', onyomi: 'モク, ボク', kunyomi: 'き, こ-' },
  { jp: '金', romaji: 'kane', meaning: 'Gold / Money', example: '金曜日 (Kinyoubi)', onyomi: 'キン, コン', kunyomi: 'かね, かな-' },
  { jp: '土', romaji: 'tsuchi', meaning: 'Earth', example: '土曜日 (Doyoubi)', onyomi: 'ド, ト', kunyomi: 'つち' },
  { jp: '一', romaji: 'ichi', meaning: 'One', example: '一人 (Hitori)', onyomi: 'イチ, イツ', kunyomi: 'ひと, ひと-つ' },
  { jp: '二', romaji: 'ni', meaning: 'Two', example: '二月 (Nigatsu)', onyomi: 'ニ', kunyomi: 'ふた, ふた-つ' },
  { jp: '三', romaji: 'san', meaning: 'Three', example: '三日 (Mikka)', onyomi: 'サン', kunyomi: 'み, み-つ' },
  { jp: '四', romaji: 'yon', meaning: 'Four', example: '四月 (Shigatsu)', onyomi: 'シ', kunyomi: 'よ, よ-つ, よん' },
  { jp: '五', romaji: 'go', meaning: 'Five', example: '五日 (Itsuka)', onyomi: 'ゴ', kunyomi: 'いつ, いつ-つ' },
  { jp: '六', romaji: 'roku', meaning: 'Six', example: '六月 (Rokugatsu)', onyomi: 'ロク', kunyomi: 'む, む-つ' },
  { jp: '七', romaji: 'nana', meaning: 'Seven', example: '七日 (Nanoka)', onyomi: 'シチ', kunyomi: 'なな, なな-つ' },
  { jp: '八', romaji: 'hachi', meaning: 'Eight', example: '八月 (Hachigatsu)', onyomi: 'ハチ', kunyomi: 'や, や-つ' },
  { jp: '九', romaji: 'kyuu', meaning: 'Nine', example: '九日 (Kokonoka)', onyomi: 'キュウ, ク', kunyomi: 'ここの, ここの-つ' },
  { jp: '十', romaji: 'juu', meaning: 'Ten', example: '十月 (Juugatsu)', onyomi: 'ジュウ', kunyomi: 'とお, と' },
  { jp: '人', romaji: 'hito', meaning: 'Person', example: '日本人 (Nihonjin)', onyomi: 'ジン, ニン', kunyomi: 'ひと, -り' },
  { jp: '学', romaji: 'gaku', meaning: 'Study', example: '学生 (Gakusei)', onyomi: 'ガク', kunyomi: 'まな-ぶ' },
  { jp: '大', romaji: 'dai', meaning: 'Big', example: '大学 (Daigaku)', onyomi: 'ダイ, タイ', kunyomi: 'おお-きい' },
  { jp: '小', romaji: 'shou', meaning: 'Small', example: '小学校 (Shougakkou)', onyomi: 'ショウ', kunyomi: 'ちい-さい, こ-, お-' },
  { jp: '年', romaji: 'nen', meaning: 'Year', example: '来年 (Rainen)', onyomi: 'ネン', kunyomi: 'とし' },
  { jp: '先', romaji: 'saki', meaning: 'Ahead', example: '先生 (Sensei)', onyomi: 'セン', kunyomi: 'さき, ま-ず' },
  { jp: '生', romaji: 'sei', meaning: 'Life', example: '誕生日 (Tanjoubi)', onyomi: 'セイ, ショウ', kunyomi: 'い-きる, う-まれる' },
  { jp: '中', romaji: 'naka', meaning: 'Middle', example: '中国 (Chuugoku)', onyomi: 'チュウ', kunyomi: 'なか' }
];

export const KANJI_N4: Character[] = [
  { jp: '会', romaji: 'kai', meaning: 'Meeting / Meet', example: '会社 (Kaisha)', onyomi: 'カイ, エ', kunyomi: 'あ-う' },
  { jp: '同', romaji: 'dou', meaning: 'Same', example: '同時に (Doujini)', onyomi: 'ドウ', kunyomi: 'おな-じ' },
  { jp: '自', romaji: 'ji', meaning: 'Self', example: '自分 (Jibun)', onyomi: 'ジ, シ', kunyomi: 'みずか-ら' },
  { jp: '社', romaji: 'sha', meaning: 'Company', example: '社長 (Shachou)', onyomi: 'シャ', kunyomi: 'やしろ' },
  { jp: '発', romaji: 'hatsu', meaning: 'Departure', example: '発表 (Happyou)', onyomi: 'ハツ, ホツ', kunyomi: 'た-つ, あば-く' },
  { jp: '者', romaji: 'sha', meaning: 'Person', example: '学者 (Gakusha)', onyomi: 'シャ', kunyomi: 'もの' },
  { jp: '地', romaji: 'chi', meaning: 'Ground', example: '地下鉄 (Chikatetsu)', onyomi: 'チ, ジ', kunyomi: '' },
  { jp: '業', romaji: 'gyou', meaning: 'Business', example: '授業 (Jugyou)', onyomi: 'ギョウ, ゴウ', kunyomi: 'わざ' },
  { jp: '方', romaji: 'hou', meaning: 'Direction', example: '書き方 (Kakikata)', onyomi: 'ホウ', kunyomi: 'かた, -がた' },
  { jp: '新', romaji: 'shin', meaning: 'New', example: '新聞 (Shinbun)', onyomi: 'シン', kunyomi: 'あたら-しい, あら-た' },
  { jp: '場', romaji: 'ba', meaning: 'Place', example: '場所 (Basho)', onyomi: 'ジョウ, チョウ', kunyomi: 'ば' },
  { jp: '員', romaji: 'in', meaning: 'Member', example: '店員 (Ten-in)', onyomi: 'イン', kunyomi: '' },
  { jp: '立', romaji: 'ritsu', meaning: 'Stand', example: '国立 (Kokuritsu)', onyomi: 'リツ, リュウ', kunyomi: 'た-つ, た-てる' },
  { jp: '開', romaji: 'kai', meaning: 'Open', example: '開店 (Kaiten)', onyomi: 'カイ', kunyomi: 'あ-く, ひら-く' },
  { jp: '代', romaji: 'dai', meaning: 'Substitute / Age', example: '時代 (Jidai)', onyomi: 'ダイ, タイ', kunyomi: 'か-わる, よ' },
  { jp: '道', romaji: 'michi', meaning: 'Road / Way', example: '柔道 (Juudo)', onyomi: 'ドウ, トウ', kunyomi: 'みち' },
  { jp: '理', romaji: 'ri', meaning: 'Reason / Logic', example: '料理 (Ryouri)', onyomi: 'リ', kunyomi: 'ことわり' },
  { jp: '意', romaji: 'i', meaning: 'Mind / Meaning', example: '意味 (Imi)', onyomi: 'イ', kunyomi: '' },
  { jp: '通', romaji: 'tuu', meaning: 'Pass / Commute', example: '通学 (Tsuugaku)', onyomi: 'ツウ, ツ', kunyomi: 'とお-る, かよ-う' },
  { jp: '家', romaji: 'ie', meaning: 'House', example: '家族 (Kazoku)', onyomi: 'カ, ケ', kunyomi: 'いえ, や' },
  { jp: '度', romaji: 'do', meaning: 'Degree / Times', example: '今度 (Kondo)', onyomi: 'ド, ト, タク', kunyomi: 'たび, もり' }
];

export const KANJI_N3: Character[] = [
  { jp: '政', romaji: 'sei', meaning: 'Politics / Government', example: '政治 (Seiji)', onyomi: 'セイ, ショウ', kunyomi: 'まつりごと' },
  { jp: '議', romaji: 'gi', meaning: 'Deliberation', example: '会議 (Kaigi)', onyomi: 'ギ', kunyomi: '' },
  { jp: '対', romaji: 'tai', meaning: 'Opposite', example: '反対 (Hantai)', onyomi: 'タイ, ツイ', kunyomi: 'あいて' },
  { jp: '部', romaji: 'bu', meaning: 'Part / Department', example: '全部 (Zenbu)', onyomi: 'ブ', kunyomi: '-' },
  { jp: '相', romaji: 'sou', meaning: 'Mutual / Aspect', example: '相談 (Soudan)', onyomi: 'ソウ, ショウ', kunyomi: 'あい' },
  { jp: '定', romaji: 'tei', meaning: 'Determine / Fix', example: '予定 (Yotei)', onyomi: 'テイ, ジョウ', kunyomi: 'さだ-める' },
  { jp: '実', romaji: 'jitsu', meaning: 'Reality / Fruit', example: '実際 (Jissai)', onyomi: 'ジツ', kunyomi: 'み, みの-る' },
  { jp: '決', romaji: 'ketsu', meaning: 'Decide / Fix', example: '決定 (Kettei)', onyomi: 'ケツ', kunyomi: 'き-める' },
  { jp: '表', romaji: 'hyou', meaning: 'Surface / Table', example: '発表 (Happyou)', onyomi: 'ヒョウ', kunyomi: 'おもて, あらわ-す' },
  { jp: '調', romaji: 'chou', meaning: 'Tune / Investigate', example: '調査 (Chousa)', onyomi: 'チョウ', kunyomi: 'しら-べる' },
  { jp: '野', romaji: 'ya', meaning: 'Field', example: '野球 (Yakyuu)', onyomi: 'ヤ, ショ', kunyomi: 'の' },
  { jp: '強', romaji: 'kyou', meaning: 'Strong', example: '勉強 (Benkyou)', onyomi: 'キョウ, ゴウ', kunyomi: 'つよ-い' },
  { jp: '込', romaji: 'komi', meaning: 'Include / Crowded', example: '申し込む (Moushikomu)', onyomi: '', kunyomi: 'こ-む, -こ-む' },
  { jp: '顔', romaji: 'kao', meaning: 'Face', example: '笑顔 (Egao)', onyomi: 'ガン', kunyomi: 'かお' },
  { jp: '願', romaji: 'gan', meaning: 'Wish / Hope', example: 'お願い (Onegai)', onyomi: 'ガン', kunyomi: 'ねが-う' }
];
