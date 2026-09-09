import type { Category } from '../types';

export interface OfficialLink {
  id: string;
  title: string;
  url: string;
  source: string; // 発行元（例：総務省、首相官邸など）
  description: string;
}

export const officialLinks: Record<Category, OfficialLink[]> = {
  organize: [
    {
      id: "org_link_1",
      title: "防災教育・普及啓発",
      url: "https://www.bousai.go.jp/kyoiku/index.html",
      source: "内閣府",
      description: "家族間での安否確認やルールの取り決めなど、実践的な防災教育に関する公式ポータルです。"
    },
    {
      id: "org_link_2",
      title: "災害用伝言ダイヤル（171）",
      url: "https://www.soumu.go.jp/menu_seisaku/ictseisaku/net_anzen/hijyo/dengon.html",
      source: "総務省",
      description: "通信インフラが混雑・断絶した際の確実な安否確認手段である「171」の正しい利用方法です。"
    }
  ],
  risk: [
    {
      id: "risk_link_1",
      title: "ハザードマップポータルサイト",
      url: "https://disaportal.gsi.go.jp/",
      source: "国土交通省",
      description: "身の回りでどんな災害が起こりうるのか、浸水や土砂災害のリスクを地図上で確認できる公式ポータルです。"
    },
    {
      id: "risk_link_2",
      title: "住宅・建築物の耐震化",
      url: "https://www.mlit.go.jp/jutakukentiku/house/jutakukentiku_house_fr_000043.html",
      source: "国土交通省",
      description: "旧耐震基準の住宅を補強するための制度や、耐震診断の進め方に関する公式サイト集。"
    }
  ],
  finance: [
    {
      id: "fin_link_1",
      title: "地震保険制度の概要",
      url: "https://www.mof.go.jp/policy/financial_system/earthquake_insurance/",
      source: "財務省",
      description: "被災後の生活再建に不可欠な「地震保険」の補償内容および控除制度についての公式解説。"
    }
  ],
  design: [
    {
      id: "des_link_1",
      title: "家具類の転倒・落下・移動防止対策",
      url: "https://www.tfd.metro.tokyo.lg.jp/hp-bousaika/kaguten/index.html",
      source: "東京消防庁",
      description: "地震の揺れによる家具の下敷きを防ぐため、効果的なL字金具や突っ張り棒の正しい使用法を解説。"
    }
  ],
  environment: [],
  capacity: [
    {
      id: "cap_link_1",
      title: "赤十字救急法等の講習",
      url: "https://www.jrc.or.jp/activity/study/",
      source: "日本赤十字社",
      description: "大出血の止血や心肺蘇生法など、知っていれば救える命の応急手当についての受講情報です。"
    }
  ],
  society: [
    {
      id: "soc_link_1",
      title: "自主防災組織の育成等",
      url: "https://www.fdma.go.jp/mission/prevention/suisin/",
      source: "総務省消防庁",
      description: "災害が起きた際、地域住民で連携して救助・消火を行うための自主防災についてのマニュアル。"
    }
  ],
  lifeline: [
    {
      id: "life_link_1",
      title: "災害時に備えた食品ストックガイド",
      url: "https://www.maff.go.jp/j/zyukyu/foodstock/",
      source: "農林水産省",
      description: "日常品を少し多めに買い置きする「ローリングストック」の実践方法や必要量がまとまっています。"
    },
    {
      id: "life_link_2",
      title: "災害に対するご家庭での備え",
      url: "https://www.kantei.go.jp/jp/headline/bousai/sonae.html",
      source: "首相官邸",
      description: "水や食料だけでなく、非常用トイレなど停電・断水時に必須となる代替インフラの備蓄リスト。"
    }
  ],
  response: [
    {
      id: "res_link_1",
      title: "防災情報のページ",
      url: "https://www.bousai.go.jp/",
      source: "内閣府",
      description: "国が発表する災害関連情報、避難勧告のガイドラインなどを確認できる国の防災ポータル。"
    }
  ],
  recovery: [
    {
      id: "rec_link_1",
      title: "被災者生活再建支援制度",
      url: "https://www.bousai.go.jp/taisaku/seikatsusaiken/index.html",
      source: "内閣府",
      description: "住宅が全壊するなど著しい被害を受けた際に、生活再建のための支援金を受け取るための制度案内。"
    },
    {
      id: "rec_link_2",
      title: "罹災証明書について",
      url: "https://www.bousai.go.jp/taisaku/gijutushiryou/higaishintei/index.html",
      source: "内閣府",
      description: "各種支援策（義援金や税の減免等）の適用に必須となる「罹災証明書」の発行基準や手続きの公式対応ページ。"
    }
  ]
};
