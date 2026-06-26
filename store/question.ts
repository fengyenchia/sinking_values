import { create } from 'zustand'

// 1. 定義 AI 報告的型別結構
interface AiReport {
  soulType: string;
  tags: string[];
  analysis: string;
  advice: string;
}

// 定義單個題目的型別結構
interface QuestionItem {
  mainTitle: string;
  title: string;
  options: { text: string }[]; // 物件陣列
}

interface PsyData {
  questionData: QuestionItem[];
  answers: Record<string, string | null>; // Q1~Q5 的明確文字(鍵的型別是 string；值的型別是 string 或 null)
  finalWords: string;
  aiReport: AiReport | null;
}

interface PsyStore {
  psyData: PsyData;
  setAnswer: (questionKey: string, optionText: string) => void;
  setFinalWords: (text: string) => void;
  setAiReport: (report: AiReport) => void;
  reset: () => void;
}

// 乾淨的前 5 題純選擇題陣列
const questionData: QuestionItem[] = [
  {
    mainTitle: "迷霧中的重量",
    title: "船底開始滲水，木船微微下沉。擺渡人冷冷地說，必須先丟棄一件重物。",
    options:[
      { text: "丟棄克羅斯教授那箱沉重的人類文明與醫療文獻" },
      { text: "丟棄雷恩大半的求生物資與防身小刀。" },
      { text: "拒絕丟棄任何人的東西，提議大家輪流用手把水舀出去，但這會大幅消耗體力。" }
    ]
  },
  {
    mainTitle: "同舟共濟的代價",
    title: "霧氣中傳來怪異的低鳴，海面泛起黑色的漣漪，船身劇烈搖晃。驚恐的艾蓮不小心鬆了手，她唯一的保暖毛毯即將被海浪捲走，那是用來包裹她懷中嬰兒的。",
    options:[
      { text: "立刻伸手去抓毛毯，但這可能導致自己失去平衡掉入海中。" },
      { text: "拉住想衝去撿毛毯的艾蓮，冷靜地告訴她安全第一，毛毯沒了可以用別的代替。" },
      { text: "冷眼旁觀，趁機穩固自己的坐姿，確保自己不會被晃下船。" }
    ]
  },
  {
    mainTitle: "利益的權衡",
    title: "木船下沉得更厲害了，水已經淹到腳踝。此時海面上漂來一個破爛的救生圈，只夠承載一個人的重量，且需要有人在船上拉著繩子拖行。",
    options:[
      { text: "讓抱著嬰兒的艾蓮帶著救生圈下海，由我們拉著繩子，但這會大大拖慢木船行進的速度。" },
      { text: "讓體力最好的雷恩拿去，如果船沉了，他最有機會游到彼岸尋求救援。" },
      { text: "既然只能救一個人，不如留在船上當作修補船底漏洞的材料，誰也不准私自使用。" }
    ]
  },
  {
    mainTitle: "誠實與猜忌",
    title: "克羅斯教授突然臉色蒼白，身體不斷發抖，顯然是失溫或感染了某種疾病。雷恩懷疑他隱瞞了病情，並主張如果教授死在船上，屍體會加速虛無的腐蝕，應該立刻隔離他。",
    options:[
      { text: "站在教授這邊，認為不該在人生病時排擠他，並將自己的外套分給他。" },
      { text: "站在雷恩這邊，要求教授坐到最角落的船尾，限制他的行動與飲水。" },
      { text: "保持沉默，不參與爭吵，默默觀察誰會先動手，好做出應變。" }
    ]
  },
  {
    mainTitle: "最後的籌碼",
    title: "彼岸的微光已經出現在濃霧遠方，但船身突然發出乾裂的破裂聲，虛無的腐蝕來到臨界點，船隻瞬間沉了一大半。擺渡人停下槳：「最後的考驗到了。除了你們的生命，船上已經沒有任何死物可以丟棄。此時此刻，你們必須決定讓誰離開這艘船。」",
    options:[
      { text: "指向克羅斯教授（生病的弱者/理性價值的代表）" },
      { text: "指向雷恩（強壯的威脅者/生存本能的代表）" },
      { text: "指向艾蓮（帶有嬰兒的母親/愛與同理的代表）" },
      { text: "指向自己（自願犧牲）" }
    ]
  }
];

export const usePsyStore = create<PsyStore>((set) => ({
  psyData: {
    questionData: questionData,
    answers: {
      Q1: null,
      Q2: null,
      Q3: null,
      Q4: null,
      Q5: null,
    },
    finalWords: "",
    aiReport: null,
  },

  setAnswer: (questionKey, optionText) => set((state) => ({
    psyData: {
      ...state.psyData,
      answers: {
        ...state.psyData.answers,
        [questionKey]: optionText,
      }
    }
  })),

  setFinalWords: (text) => set((state) => ({
    psyData: {
      ...state.psyData,
      finalWords: text
    }
  })),

  setAiReport: (report) => set((state) => ({
    psyData: {
      ...state.psyData,
      aiReport: report
    }
  })),

  reset: () => set((state) => ({
    psyData: {
      ...state.psyData,
      answers: { Q1: null, Q2: null, Q3: null, Q4: null, Q5: null },
      finalWords: "",
      aiReport: null,
    }
  })),
}));