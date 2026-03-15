import type { Category } from '../types';

export interface AffiliateItem {
  id: string;
  name: string;
  description: string;
  asin: string;
}

// 60問・6つの新都市機能カテゴリに応じたAmazon推奨グッズ群
export const affiliateItems: Record<Category, AffiliateItem[]> = {
  management: [
    {
      id: "mgt_1",
      name: "自衛隊防災BOOK",
      description: "家族のルール作りに役立つ、自衛隊員に学ぶ究極の危機管理ノウハウ。",
      asin: "4838730101"
    },
    {
      id: "mgt_2",
      name: "防災用エマージェンシーホイッスル 笛",
      description: "家族全員に持たせたい、倒壊など緊急時の安否を知らせる生命線としての救助笛。",
      asin: "B000FVRGSI"
    },
    {
      id: "mgt_3",
      name: "ホワイトボード（家族伝言用）",
      description: "スマホや通信手段が途絶えた際、自宅に書き残すためのマグネット式掲示板。",
      asin: "B0CBB1P52J"
    }
  ],
  education: [
    {
      id: "edu_1",
      name: "ファーストエイド 救急セット",
      description: "応急手当に必要な医療用具が1つのポーチにまとまった完全装備。",
      asin: "B0BNSQ71KD"
    },
    {
      id: "edu_2",
      name: "サバイバルシート（防寒・保温シート）",
      description: "EDCポーチに入れて常に持ち歩きたい、体温の低下を防ぐ超薄型アルミシート。",
      asin: "B0GFCH8WXK"
    },
    {
      id: "edu_3",
      name: "携帯浄水器 浄水フィルター",
      description: "泥水すら飲み水に変える、サバイバルスキルの最終兵器。持ち運びにも便利。",
      asin: "B00FA2RLX2"
    }
  ],
  infrastructure: [
    {
      id: "inf_1",
      name: "家具転倒防止 突っ張り棒 (2本セット)",
      description: "背の高い食器棚や本棚を大地震から守る、強力な面圧式の転倒防止棒。",
      asin: "B0B87BKGFK"
    },
    {
      id: "inf_2",
      name: "ガラス飛散防止フィルム",
      description: "窓ガラスや食器棚のガラス面へ貼り付け、地震時の鋭利な破片による二次災害を防ぐ。",
      asin: "B0033W1SDK"
    },
    {
      id: "inf_3",
      name: "家庭用 蓄圧式粉末消火器",
      description: "初期消火が命運を分ける。倒壊や火災の延焼を防ぐための必須ハード設備。",
      asin: "B0922HK882"
    }
  ],
  stockpile: [
    {
      id: "stc_1",
      name: "カセットコンロ＆予備ガスボンベセット",
      description: "電気もガスも止まった冬を生き延びる、強力な熱源となるインフラ代替兵器。",
      asin: "B01J59SGCK"
    },
    {
      id: "stc_2",
      name: "簡易トイレ 非常用 防臭袋 50回分",
      description: "水洗トイレが使えない環境下で、家族の衛生と尊厳を守るための防臭トイレ袋。",
      asin: "B0CGGWG8F4"
    },
    {
      id: "stc_3",
      name: "大容量ポータブル電源 蓄電池",
      description: "停電下での長期情報戦を制する、スマホ充電・小型家電稼働用の予備電源。",
      asin: "B0GQ9DHMR1"
    }
  ],
  finance: [
    {
      id: "fin_1",
      name: "耐火・防水 小型金庫",
      description: "重要書類（証券・通帳・印鑑）や緊急用現金を火災や水害から物理的に保護する。",
      asin: "B0922HK882"
    },
    {
      id: "fin_2",
      name: "書類整理 じゃばらファイル",
      description: "避難時に瞬時に持ち出せるよう、保険証券や権利書などの全ての書類を一時避難させるケース。",
      asin: "B0D731S543"
    },
    {
      id: "fin_3",
      name: "防刃・防水サコッシュ（隠しポーチ）",
      description: "避難所でのスリや窃盗から多額の現金を守るための、肌身離さず持てるセキュリティポーチ。",
      asin: "B0D8GHQWZR"
    }
  ],
  community: [
    {
      id: "com_1",
      name: "手回し充電・ソーラー防災ラジオ",
      description: "通信ダウン下でも行政の正確な情報を得られ、モバイルバッテリーにもなる公式情報収集ツール。",
      asin: "B0GRZBTRB7"
    },
    {
      id: "com_2",
      name: "LED広角ランタン（複数セット）",
      description: "ご近所やコミュニティの集会・救助活動でも使える周囲を照らす絶対的な光量。",
      asin: "B0751B8XQB"
    },
    {
      id: "com_3",
      name: "多機能レスキューツール（バール・ハンマー）",
      description: "隣家のドアや窓が歪んだ際に、物理的に破壊して扉をこじ開け、救出活動（共助）を行うための道具。",
      asin: "B0D3DLL7NP"
    }
  ]
};
