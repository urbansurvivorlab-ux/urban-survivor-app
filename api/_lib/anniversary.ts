// 防災の記念日にリマインド送信日を寄せるためのヘルパー。
// 「約6ヶ月ごと」という約束は崩さず、機械的な日付の代わりに
// 家族で防災を振り返る文脈が既に社会に共有されている日（1/17・3/11・9/1）に
// 近ければそちらへスナップする。近い記念日が無ければ元の日付のまま。
export type AnniversaryKind = 'hanshin' | 'tohoku' | 'bousai' | null;

const ANCHORS: { month: number; day: number; kind: AnniversaryKind }[] = [
  { month: 1, day: 17, kind: 'hanshin' }, // 阪神・淡路大震災
  { month: 3, day: 11, kind: 'tohoku' }, // 東日本大震災
  { month: 9, day: 1, kind: 'bousai' }, // 防災の日（防災週間 8/30〜9/5）
];

// この日数以内に記念日があれば、そちらへスナップする（約6ヶ月の約束を大きく崩さない範囲）
const SNAP_TOLERANCE_DAYS = 45;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function anchorOccurrence(anchor: { month: number; day: number }, year: number): Date {
  return new Date(Date.UTC(year, anchor.month - 1, anchor.day));
}

// fromDateからintervalMonths後を基準に、近い記念日があればその日付とkindを返す。
// 無ければ機械的な計算日のままkind:nullで返す。
export function computeNextSendAt(
  fromDate: Date,
  intervalMonths: number
): { date: Date; anchor: AnniversaryKind } {
  const raw = new Date(fromDate);
  raw.setUTCMonth(raw.getUTCMonth() + intervalMonths);

  let best: { date: Date; anchor: AnniversaryKind; diffDays: number } = {
    date: raw,
    anchor: null,
    diffDays: Infinity,
  };

  for (const anchor of ANCHORS) {
    // 前年・当年・翌年の3パターンを候補にし、rawに最も近いものを採用する
    for (const year of [raw.getUTCFullYear() - 1, raw.getUTCFullYear(), raw.getUTCFullYear() + 1]) {
      const occurrence = anchorOccurrence(anchor, year);
      const diffDays = Math.abs((occurrence.getTime() - raw.getTime()) / MS_PER_DAY);
      if (diffDays <= SNAP_TOLERANCE_DAYS && diffDays < best.diffDays) {
        best = { date: occurrence, anchor: anchor.kind, diffDays };
      }
    }
  }

  return { date: best.date, anchor: best.anchor };
}

// next_send_atが記念日ちょうどにスナップされた日付かどうかを、実際に送信するタイミングで判定する。
export function anchorForDate(date: Date): AnniversaryKind {
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const match = ANCHORS.find((a) => a.month === month && a.day === day);
  return match ? match.kind : null;
}
