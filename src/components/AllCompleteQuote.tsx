"use client";

const QUOTES = [
  { text: "千里の道も一歩から。", author: "老子" },
  { text: "継続は力なり。", author: "住岡夜晃" },
  { text: "今日という日は、残りの人生の最初の日である。", author: "チャールズ・ディードリッヒ" },
  { text: "小さなことを積み重ねることが、とんでもないところへ行くただ一つの道。", author: "イチロー" },
  { text: "努力した者が全て報われるとは限らん。しかし、成功した者は皆すべからく努力しておる。", author: "鴨川源二" },
  { text: "明日死ぬかのように生きよ。永遠に生きるかのように学べ。", author: "マハトマ・ガンジー" },
  { text: "人生とは自分を見つけることではない。人生とは自分を創ることである。", author: "バーナード・ショー" },
  { text: "どんな壁も扉である。", author: "エマーソン" },
  { text: "行動は必ずしも幸福をもたらさないが、行動のないところに幸福はない。", author: "ベンジャミン・ディズレーリ" },
  { text: "為せば成る、為さねば成らぬ何事も。", author: "上杉鷹山" },
  { text: "今日の成果は過去の努力の結果であり、未来はこれからの努力で決まる。", author: "稲盛和夫" },
  { text: "毎日少しずつ。それがなかなかできねんだなあ。", author: "相田みつを" },
  { text: "自分自身を信じてみるだけでいい。きっと、生きる道が見えてくる。", author: "ゲーテ" },
  { text: "夢を見ることができれば、それは実現できる。", author: "ウォルト・ディズニー" },
  { text: "石の上にも三年。", author: "日本のことわざ" },
];

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function AllCompleteQuote() {
  const quote = getRandomQuote();

  return (
    <div className="mt-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center shadow-sm">
      <p className="mb-2 text-2xl">🎉</p>
      <p className="mb-1 text-sm font-bold text-amber-700">今日の習慣、全て達成！</p>
      <blockquote className="mt-3 text-base italic text-slate-600">
        「{quote.text}」
      </blockquote>
      <p className="mt-1 text-sm text-slate-400">― {quote.author}</p>
    </div>
  );
}
