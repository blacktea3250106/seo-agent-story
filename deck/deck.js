// SEO Agent 六個版本：給技術面試官的 21 頁版本。每頁一個重點；技術名詞用英文，第一次出現附白話。
// 講稿就是每頁的 n 欄位（按 N 顯示），另輸出成 deck/story/講稿.md。
// 事實來源：~/seo-experiment/DECISIONS.md、seo-task1/docs/ai-dev-log.md、runs/v2/common-regrade
(() => {
const H = (eb, t) => `<div class="hd"><p class="sub">${eb}</p><h2>${t}</h2></div>`;
const pill = (id) => `<b class="vp">${id}</b>`;
const PH = ['交件前', '做尺與驗證', '挑戰強模型'];
const eb = (id, ph, extra = '') => `${pill(id)}${PH[ph]}${extra ? `　·　${extra}` : ''}`;
const nums = (a) => `<div class="nums">${a.map(([n, l]) => `<div class="n"><b>${n}</b><span>${l}</span></div>`).join('')}</div>`;
const chg = (before, after, bk = '之前', ak = '這版改成') => `<div class="chgrow"><div class="cb"><p class="k">${bk}</p><p>${before}</p></div><div class="arw"><i class="tn-ar"></i></div><div class="cb after"><p class="k">${ak}</p><p>${after}</p></div></div>`;
const why = (t, k = '為什麼改') => `<p class="why"><b>${k}</b>${t}</p>`;
const res = (n, ex, exk = '例子') => `<div class="res2"><div class="num"><p class="lbl">結果</p>${nums(n)}</div><div class="exq"><p class="lbl">${exk}</p><p>${ex}</p></div></div>`;
const nxt = (t, k = '所以下一版') => `<div class="nxt"><b>${k} →</b><span>${t}</span></div>`;
const def = (t) => `<p class="def">${t}</p>`;
const tbl = (head, rows, cls = '') => `<table class="tb ${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const bar = (label, v, max, txt, cls, side) => `<div class="br ${cls}"><span class="br-l">${label}</span><div class="br-t"><i style="width:${(v / max) * 100}%"></i><b>${txt}</b></div><span class="br-s">${side}</span></div>`;
const ok = '✅', no = '❌';

const MAP = [
  [0, 'V1', '我定好每一步，程式照規則判斷', '起點；之後修過一次，沒實跑就放棄', '8 個重點找到 3 個'],
  [0, 'V2', '一個 AI 自己研究，配上從三家 AI 學來的 Tools', '先學三家 AI 搭起來，再砍掉沒用的功能（面試交付版）', '5 輪沒有越跑越好'],
  [1, 'V3', 'Agent 不動，多一個 AI 負責閱卷', '改評分，不改 Agent', '第一次有可信的分數'],
  [1, 'V4', 'AI 每個動作都被 Hooks 檢查；再逐一加功能測試', '規則從提醒改成程式擋，功能一次只測一個', '捏造 6 → 1，三個功能都沒用'],
  [2, 'V5', 'Fable 當主管下指令，Opus 當員工去做', '一個 AI 改成兩個 AI 分工', '差不多，但貴 4 倍'],
  [2, 'V6', 'Fable 一個人做，配上 V4 的 Hooks', '不分工，改加 Hooks', '三組分不出高下'],
];
const TRI = [
  ['Hook 擋下動作', '動作前檢查：不准改觀察紀錄、不准繞過工具上網', '動作直接被擋，改不了紀錄來湊結論', 'V4'],
  ['Tool 檢查結果', '交卷時呼叫引用檢查 Tool，逐字比對網頁', '對不上就退回，交不出去', 'V4'],
  ['Prompt 提醒', 'Prompt、Skill 寫「每條都要附證據」', 'Haiku 6 次裡有 3 次照樣亂編', 'V2 之前'],
  ['另一個 AI 審查', '交卷前，另一個 AI 審查報告', 'V1 審查全過，實測只找到 3/8', 'V2 之前'],
  ['事後閱卷', '交卷後，閱卷 AI 照證據重查', '報告已經交出去，只能扣分', 'V3'],
];
const SCORES = [
  ['Fable 直接做', 12, '12 條', 'c1', '11 分鐘　$5.9'], ['Fable 指揮＋Opus 執行', 11, '11 條', 'c1', '52 分鐘　$23'], ['Fable＋Hooks＋自我檢查', 10, '10 條', 'c1', '約 $10'], ['Fable＋Hooks（閱卷不一致）', 8, '8 條', 'c1', '$7.1'],
  ['Opus＋Hooks＋自我檢查', 11, '11 條', 'c2', '約 $2.6'], ['Opus 直接做', 7, '6～8 條', 'c2', '約 $2'], ['V2 交付版（Opus，5 輪平均）', 6.6, '6.6 條', 'c2', ''], ['Opus＋Hooks', 6, '6 條', 'c2', '$2.8'],
  ['Haiku＋Hooks（10 次平均）', 3.4, '3.4 條', 'c3', '捏造 1 次'], ['Haiku 直接做（6 次平均）', 3.2, '3.2 條', 'c3', '捏造 6 次'],
];

const SLIDES = [
// ---------- 開場 ----------
{ t: '封面', dark: 1, n: '大家好，今天我要分享一個 SEO 競爭情報 Agent，以及我把它改了 6 個版本的過程。標題就是我的結論：模型決定找到多少，架構決定能不能相信。我一開始以為架構越完整越好，後來發現，沒有一把可信的尺，改什麼都說不準。接下來我會一版一版說明，我是怎麼走到這個結論的。', html: () => `<div class="cvx"><p class="cvx-k">SEO 競爭情報 Agent　·　6 個版本的迭代紀錄</p><h1>模型決定找到多少，<br>架構決定能不能相信</h1><p class="cvx-s">我一開始以為架構越完整越好。後來發現，沒有可信的尺，改什麼都說不準。</p></div>` },

{ t: '這個 Agent 要做什麼', n: '先說明任務。SEO 是讓網頁在 Google 搜尋排前面的做法。我做的 Agent，是會自己上網查資料、自己決定下一步的 AI 程式。給它一個競爭對手的網站，這次是 2030.tw，再加上作業指定的關鍵字，它要交出對方用了哪些 SEO 做法，每一條都要附證據。右邊是一條真實的輸出：對方為每個搜尋詞都開了一頁，網址就是那個詞，總共 2,503 頁。這樣做的目的是，有人在 Google 搜「3a娛樂城」時，剛好有一頁就叫這個名字。證據是網站給 Google 的頁面清單，也就是 sitemap，列了 2,503 個網址，目錄首頁也寫著「共 2502 篇」。這個數字待會在 V1 會再出現。', html: () => H('任務　·　SEO＝讓網頁在 Google 搜尋排前面的做法', '給 Agent 一個競爭對手的網站，交出對方的 SEO 做法，每條都要附證據') + `<div class="bd"><div class="task">
  <div class="tk"><p class="lbl">輸入</p><p class="tk-b">2030.tw</p><p>加上作業指定的關鍵字</p></div><i class="tn-ar"></i>
  <div class="tk"><p class="lbl">Agent</p><p class="tk-b">自己決定</p><p>要讀哪些頁、查哪些資料</p><p class="def">Agent＝會自己上網查資料、決定下一步的 AI 程式</p></div><i class="tn-ar"></i>
  <div class="tk out sg"><p class="lbl">輸出的一條（真實例子）</p>
    <div class="sg-r"><b>對方做了什麼</b><span>每個搜尋詞開一頁，網址就是那個詞，例如 /wordcup/3a娛樂城，共 2,503 頁</span></div>
    <div class="sg-r"><b>為什麼跟 SEO 有關</b><span>有人搜「3a娛樂城」時，剛好有一頁就叫這個名字（目的，效果沒有測）</span></div>
    <div class="sg-r"><b>證據</b><span>Sitemap（網站給 Google 的頁面清單）列了 2,503 個網址；目錄首頁寫「共 2502 篇」</span></div></div></div></div>` },

{ t: '先講結論', n: '我先講結論，6 個版本之後，我確定三件事。第一，找到多少主要看模型。這次用了三個模型：Fable 最強也最貴，Opus 在中間，Haiku 最小也最便宜。同一場考試，Fable 找到 12 條，Opus 6 到 8 條，Haiku 大約 3 條。這裡的 1 條，是一個 SEO 做法加上證據，而且要通過另一個 AI 的 5 題檢查才算。第二，Hooks 讓結果可信。Hooks 是 AI 每個動作前後，自動執行的檢查程式。加上 Hooks 之後，Haiku 的捏造從 6 次降到 1 次。捏造的意思是，AI 說它看到了，但照它給的證據查不到，等於亂編。第三，加功能和多 Agent 分工，都沒有證實有用。記憶、抽樣、自我檢查都沒有提高產出，分工還貴了 4 倍。這次最大的收穫是：先做一把可信的尺，量過才留下。', html: () => H('先講結論', '6 個版本之後，我確定三件事') + `<div class="bd"><div class="c3">
  <div class="cc"><p class="ci">1</p><h3>模型決定找到多少</h3><p>Fable 12 條<br>Opus 6～8 條<br>Haiku 約 3 條</p><p class="def">模型由強到弱、由貴到便宜：Fable ＞ Opus ＞ Haiku<br>1 條＝一個 SEO 做法＋證據，通過另一個 AI 的 5 題檢查</p></div>
  <div class="cc"><p class="ci">2</p><h3>Hooks 讓結果可信</h3><p>Haiku 捏造 6 次 → 1 次</p><p class="def">Hooks＝AI 每個動作前後，自動執行的檢查程式<br>捏造＝AI 說看到了，照它的證據卻查不到</p></div>
  <div class="cc"><p class="ci">3</p><h3>加功能、分工都沒證實</h3><p>記憶、抽樣、自我檢查都沒效<br>多 Agent 分工貴 4 倍</p></div></div>
  <div class="nxt"><b>最大的收穫 →</b><span>先做一把可信的尺，量過才留下</span></div></div>` },

{ t: '版本地圖', n: '這是 6 個版本的地圖，分成三段。交件前是 V1 和 V2。V1 我定好每一步，由程式照規則判斷，結果 8 個重點只找到 3 個。V2 改成一個 AI 自己研究，配上從三家 AI 學來的 Tools，再砍掉沒用的功能，這是我交給面試官的版本。做尺與驗證是 V3 和 V4。V3 不改 Agent，只多一個 AI 負責閱卷。V4 讓 Hooks 檢查 AI 的每個動作，再一個一個測功能。挑戰強模型是 V5 和 V6。V5 讓 Fable 當主管、Opus 當員工，結果差不多卻貴 4 倍。V6 讓 Fable 一個人做、配上 Hooks，三組分不出高下。這裡的編號是簡報用的：repo 裡的 V1、V2 在這裡合併成 V1，repo 的 V3 就是這裡的 V2。', html: () => H('版本地圖', '6 個版本，每一版改了什麼') + `<div class="bd"><table class="tb map"><thead><tr><th>版本</th><th>架構：誰負責什麼</th><th>跟上一版差在哪</th><th>結果</th></tr></thead><tbody>${MAP.map(([p, id, a, c, r], i) => `${i === 0 || MAP[i - 1][0] !== p ? `<tr class="grp"><td colspan="4">${PH[p]}</td></tr>` : ''}<tr><td>${pill(id)}</td><td>${a}</td><td>${c}</td><td>${r}</td></tr>`).join('')}</tbody></table>${def('編號為簡報用：repo 的 V1、V2 合併為這裡的 V1；repo 的 V3（面試交付版）是這裡的 V2')}</div>` },

// ---------- 交件前 ----------
{ t: 'V1 先設計再實作', n: '第一版的起點是：我不熟 SEO，也沒有現成的做法可以參考。所以我先和 ChatGPT 討論架構，寫成 6 個階段的流程，每個階段都設審查關卡。當時我以為，先把架構想清楚，就能做出好的 Agent。結果 6 道審查關卡全過，但實測時，8 個重點只找到 3 個，Opus 直接做找到 8 個。最明顯的例子就是第 2 頁那個目錄頁：V1 看成只有一頁，Opus 認出上面寫著「共 2502 篇」。要說明的是，V1 的判斷是規則程式，也就是照寫死的規則，不是 AI 在判斷，所以這不是同模型的比較。之後我照盲審的結果修了一次，但只跑了單元測試，還沒實跑就發現流程本身沒有可信的依據，所以放棄了，改成直接看強模型怎麼做。', html: () => H(eb('V1', 0, '先設計再實作'), '自己設計的流程，8 個重點只找到 3 個') + `<div class="bd vv">${chg('我不熟 SEO，也沒有現成做法可參考', '先和 ChatGPT 討論，寫成 6 階段流程，每階段都有審查關卡', '起點')}
  ${why('我以為先把架構想清楚，就能做出好 Agent', '當時的想法')}
  ${res([['6/6', '審查關卡全過'], ['3/8', '實測找到的重點'], ['8/8', 'Opus 直接做']], '第 2 頁那個目錄頁，V1 看成只有一頁，Opus 認出上面寫著「共 2502 篇」')}
  ${nxt('照盲審修了一次，只跑單元測試就放棄；改成直接看強模型怎麼做')}
  ${def('規則程式＝照寫死的規則判斷，不是 AI，所以不是同模型比較　·　盲審＝評審不知道哪份是誰做的　·　單元測試＝只測程式，沒真的跑網站')}</div>` },

{ t: 'V2 搭起來', n: 'V2 分成兩步，第一步是「搭起來」。我不再照自己的想像設計，而是讓 Opus、Gemini、Codex 三家 AI 各做一次同一題，再把它們的共同做法抽成 8 個 Tools 和 1 個 Skill。Tools 是程式寫好、讓 AI 呼叫的功能；Skill 是寫給 AI 的研究方法說明書。改這個的原因是，V1 證明我憑空設計抓不到重點，強模型反而知道該看哪裡。結果用 14 項評分，Opus 加上這套架構，從 5 分進步到 7 到 7.5 分，Tools 確實有幫助。但 Fable 什麼都不加，直接做就有 8 分。比較三家報告時我發現，每個重點都至少有一家找到，差別在於有的沒把網站看完整，有的沒回頭核對。接著，我想讓它越跑越好，又加了 4 個多輪功能，結果累計 27 對 25，在誤差範圍內，沒有效果。', html: () => H(eb('V2', 0, '第一步：搭起來'), '不自己猜，改學三家 AI 的共同做法') + `<div class="bd vv">${chg('照我自己的想像設計流程', '讓 Opus、Gemini、Codex 各做一次，把共同做法抽成 8 個 Tools＋1 個 Skill')}
  ${why('V1 證明我憑空設計抓不到重點，強模型反而知道該看哪裡')}
  ${res([['5 → 7.5', 'Opus 加上架構（7～7.5）'], ['8', 'Fable 直接做']], '三家報告裡，每個重點都至少有一家找到。差別是沒把網站看完整、沒回頭核對')}
  ${nxt('我又加了 4 個多輪功能想讓它越跑越好，累計 27 對 25，沒有效果', '接著')}
  ${def('Tools＝程式寫好、讓 AI 呼叫的功能　·　Skill＝寫給 AI 的研究方法說明書　·　Gemini、Codex＝其他公司的 AI　·　這頁用 14 項評分，滿分 14')}</div>` },

{ t: 'V2 瘦下來（面試交付）', n: 'V2 的第二步是「瘦下來」，也就是我交給面試官的版本。表上是我實際改的 4 件事。第一，4 個多輪功能整包撤回，因為累計 27 對 25，沒有效果。第二，修好 Tools 給的資料。例如讀 sitemap 的 Tool 還沒建好，就回答「都不在 sitemap」。我回頭查，6 筆說錯裡，有 2 筆其實是 Tools 造成的。第三，拿掉 Skill 裡規定研究順序的部分，改成多給事實，例如告訴 AI 哪些區塊還沒讀過。第四，評分方式從只對照 14 項已知答案，改成計算有證據撐得住的做法數，因為舊評分算不到新發現。結果 5 輪分數是 5、8、7、7、6，沒有越跑越好。我也發現，舊考題根本沒逼模型去查作業指定的關鍵字，兩個模型都沒查。考錯題目，分數再高也沒有意義，所以下一步我先做一把尺。', html: () => H(eb('V2', 0, '第二步：瘦下來，面試交付版'), '砍掉沒用的功能，先修 AI 拿到的資料') + `<div class="bd vv">${tbl(['改了什麼', '之前', '之後', '為什麼'], [
    ['<b>多輪功能</b>', '路線地圖、交卷前對帳等 4 個', '<b>整包撤回</b>', '累計 27 對 25，沒有效果'],
    ['<b>Tools 給的資料</b>', 'Sitemap 還沒建好就回答「都不在」', '<b>修好</b>', '6 筆說錯，2 筆是 Tools 造成'],
    ['<b>Skill 的規定</b>', '規定 AI 的研究順序', '<b>拿掉，改成多給事實</b>', '例如告訴它哪些區塊還沒讀'],
    ['<b>評分</b>', '14 項，只對已知答案', '<b>改算站得住的做法數</b>', '舊評分算不到新發現']], 'chg')}
  ${res([['5、8、7、7、6', '5 輪分數，沒有越跑越好']], '舊考題沒逼模型查作業指定的關鍵字，兩個模型都沒查', '我發現')}
  ${nxt('考錯題目，分數再高也沒有意義，所以先做一把尺')}</div>` },

// ---------- 做尺與驗證 ----------
{ t: 'V3 固定考試', n: 'V3 完全不改 Agent。原因是 V2 發現考錯題目，而且每一版的評分方式都不一樣。新的考試有 4 步。考題直接用作業原文，不教方法。AI 交出策略，每條附證據。另一個 AI 負責閱卷，每條問 5 題：照證據重查得出來嗎、證據夠不夠、是不是刻意做的、理由有沒有根據、和別條有沒有重複，全過才算 1 條。最後抽 20% 重判，兩次判定相同的比例叫一致率，低於 80%，這次分數就不採用。結果第一次閱卷，一致率只有 67%，所以我修了標準，全部重判。修好之後才有第一條基準線：Opus 是 8 條和 6 條，Haiku 平均 3.2 條。我也發現，Haiku 跑 6 次，有 3 次出現捏造。閱卷本身大約有 2 條的誤差，所以之後差 2 條以內，我都當作差不多。AI 會亂編，所以下一版先讓它沒辦法亂編。', html: () => H(eb('V3', 1, '固定考試'), '先不改 Agent，先做一把可信的尺') + `<div class="bd vv">${why('V2 發現考錯題目，而且每一版的評分方式都不同')}
  <div class="steps4">${[['考題', '作業原文，不教方法'], ['交卷', 'AI 交出策略，每條附證據'], ['閱卷', '另一個 AI 每條問 5 題，全過才算 1 條'], ['抽查重判', '抽 20% 重判，一致率低於 80% 不採用']].map(([k, d], i) => `${i ? '<i class="tn-ar"></i>' : ''}<div class="st4"><b>${k}</b><span>${d}</span></div>`).join('')}</div>
  ${res([['67%', '第一次一致率'], ['8、6', 'Opus 基準'], ['3.2', 'Haiku 平均']], 'Haiku 跑 6 次，有 3 次出現捏造：說看到了，閱卷 AI 照證據卻查不到')}
  ${nxt('AI 會亂編，下一版先讓它沒辦法亂編')}
  ${def('5 題：照證據重查得出來、證據夠、是刻意做的、理由有據、不重複　·　一致率＝兩次閱卷判定相同的比例　·　閱卷誤差約 2 條')}</div>` },

{ t: '倒三角：規則放在哪一層', alt: 1, n: '進入 V4 前，我先講 V4 的設計依據，來自 Lauren Tan 的演講：同一條規則，可以放在架構的不同位置，越上層越可靠。我用這個專案真的遇到的問題來說明：AI 說網頁上寫著某句話，但網頁其實沒寫，也就是亂編證據。從最下層看起。事後閱卷，是交卷後由閱卷 AI 照證據重查，但報告已經交出去了，只能扣分。另一個 AI 審查，是交卷前請另一個 AI 看報告，但 V1 的審查全部通過，實測卻只找到 3/8，審查的 AI 也會漏看。Prompt 提醒，是在 Prompt 和 Skill 裡寫「每條都要附證據」，但 Haiku 跑 6 次，還是有 3 次亂編。這三層都還是靠 AI 自己。再往上就交給程式。Tool 檢查結果：AI 要交卷時，Hook 會呼叫引用檢查這個 Tool，把引用的原文逐字拿去比對網頁，對不上就退回，它交不出去。最上層是 Hook 擋下動作：AI 每個動作之前，Hook 先檢查，它不能修改觀察紀錄，也不能繞過讀取工具自己上網，所以沒辦法回頭改紀錄來湊結論。V2 之前，我靠的是下面三層。V4 改用 Hook 和 Tool，在 AI 交出去之前就擋下。', html: () => H('進入 V4 前　·　Lauren Tan 的倒三角', '同一條規則，交給 Hook 擋最可靠') + `<div class="bd"><p class="tri3-q">真實問題：<b>AI 說網頁上寫著某句話，但網頁其實沒寫</b>，每一層會在什麼時候擋下它？</p><div class="tri3">
  <div class="tri3-h"><span>放在架構的哪裡（越上層越可靠）</span><span>這個專案怎麼做</span><span>AI 亂編時會怎樣</span></div>
  ${TRI.map(([t, a, ex, tag], i) => `<div class="tri3-r"><div class="tri-band" style="--w:${700 - i * 110}px;--o:${1 - i * 0.17}"><b>${i + 1}　${t}</b></div><p class="tri3-a">${a}</p><p class="tri3-e">${ex}<em class="${tag === 'V4' ? 'on' : ''}">${tag}</em></p></div>`).join('')}
  </div><p class="lead">下面三層都靠 AI 自己；V4 改用 <b>Hook 和 Tool</b>，在 AI 交出去之前就擋下。</p></div>` },

{ t: 'V4 加 Hooks', n: 'V4 也分兩步，第一步是加 Hooks。之前規則寫在 prompt 裡，靠 AI 自己記得。現在改由程式強制：Hooks 在 AI 每個動作前後自動檢查；Tools 負責三件事：開場先做網站普查，把所有頁面清點一遍；觀察紀錄存成只能新增的紀錄；最後做引用檢查，AI 說網頁上寫了什麼，程式就去確認真的有。結果 Haiku 的捏造從 6 次降到 1 次，但通過數只從 3.2 到 3.4。Hooks 讓結果可信，但沒有讓它找到更多。剩下的問題也很清楚：76 條證據不足裡，有 59 條是只看了 1 到 2 頁，就說全站都這樣。亂編擋住了，接著要找能提高產出的功能。', html: () => H(eb('V4', 1, '第一步：加 Hooks'), '規則改由程式擋，捏造少了，但找到的沒變多') + `<div class="bd vv">${chg('規則寫在 prompt 裡，靠 AI 自己記得', 'Hooks 檢查 AI 的每個動作；Tools 負責網站普查、只能新增的紀錄、引用檢查')}
  ${why('倒三角：越上層越可靠')}
  ${res([['6 → 1', 'Haiku 捏造'], ['3.2 → 3.4', 'Haiku 通過數']], '76 條證據不足裡，59 條是只看 1～2 頁，就說全站都這樣', '還剩的問題')}
  ${nxt('亂編擋住了，接著找能提高產出的功能', '接著')}
  ${def('Hooks＝AI 每個動作前後，自動執行的檢查程式　·　網站普查＝先把網站所有頁面清點一遍　·　引用檢查＝AI 說網頁上寫了 X，程式就去確認真的有 X')}</div>` },

{ t: 'V4 一次只測一個功能', n: 'V4 的第二步，是一次只測一個功能。加了 Hooks 之後亂編少了，但產出沒有變多。之前我常一次加一堆功能，結果分不出誰有用。所以這次一次只加一個，再和只差這一項的對照組比較。我測了三個功能：這三個功能都是針對同一個問題：AI 只看 1、2 頁，就說全站都這樣。第一是記憶，把上一輪的經驗留給下一輪。第二是抽樣，系統從 sitemap 隨機抽最多 20 頁，把每頁的標題、描述整理好交給 AI，讓它根據更多頁來下結論。第三是自我檢查，交卷前先讓另一個 AI 把每條判成通過或不通過，再由原本的 AI 自己決定要不要修改。結果三個都沒證實有用。記憶帶來的新通過是 0，抽樣前後都是 2.7，自我檢查是 3.5 對 3.4。抽樣最能說明問題：模型自己抽的 12 頁裡，網頁描述至少有 3 種句型，它還是寫成「同一句模板」。資料已經在它眼前了，它還是講太滿。多給資料也沒提高產出，所以我推測缺的是判斷力，下一步試最強的模型。', html: () => H(eb('V4', 1, '第二步：一次只測一個功能'), '記憶、抽樣、自我檢查，三個都沒證實有用') + `<div class="bd vv">${chg('一次加一堆功能，分不出誰有用', '一次只加一個，和只差這一項的對照組比')}
  ${why('加了 Hooks 之後亂編少了，但產出沒有變多')}
  ${res([['0', '記憶帶來的新通過'], ['2.7 → 2.7', '抽樣'], ['3.5 對 3.4', '自我檢查']], '抽樣：模型自己抽的 12 頁，網頁描述至少有 3 種句型，它還是寫成「同一句模板」')}
  ${nxt('多給資料也沒提高產出，我推測缺的是判斷力，所以試最強的模型')}
  ${def('記憶＝把上一輪經驗留給下一輪　·　抽樣＝系統隨機抽最多 20 頁，整理好交給 AI 比對　·　自我檢查＝交卷前另一個 AI 先判一次，AI 自己決定改不改　·　對照組＝只差這一個功能的版本')}</div>` },

// ---------- 挑戰強模型 ----------
{ t: 'V5 多 Agent 分工', n: '之前都是一個 AI 自己決策、自己上網。V5 改成多 Agent 分工：Fable 當主管，只負責判斷；Opus 當員工，負責上網和讀網頁，在技術上叫子 Agent。我還用 Hook 強制 Fable 每次派工前，都要先寫下決策。結果，分工版找到 11 條，Fable 自己做是 12 條，差不多。但花費是 23 美元對 5.9 美元，時間是 52 分鐘對 11 分鐘。沒加分的原因是，分工原本想省 Fable 的記憶空間，也就是 AI 一次能讀進的內容量，但實際只少了 14%，從 192k 降到 165k。這個任務太短，分工省不到什麼。不過 Hook 本身有效，這版擋下 9 次違規，實際違規是 0 次。分工不划算，所以下一版改回 Fable 自己做，配上 V4 的 Hooks。', html: () => H(eb('V5', 2, '多 Agent 分工'), '讓 Fable 只做決策，結果差不多，卻貴 4 倍') + `<div class="bd vv">${chg('一個 AI 自己決策、自己上網', 'Fable 當主管只做決策，Opus 子 Agent 當員工上網執行；Hook 強制派工前先寫決策')}
  ${why('想讓 Fable 只負責判斷，上網和讀網頁交給 Opus')}
  ${res([['11 對 12', '分工版 vs Fable 自己做'], ['$23 對 $5.9', '花費'], ['52 對 11', '分鐘']], '分工想省的是 Fable 的記憶空間，實際只少 14%（192k → 165k）', '為什麼沒加分')}
  ${nxt('分工不划算，改成 Fable 自己做、配上 V4 的 Hooks')}
  ${def('多 Agent＝好幾個 AI 分工合作　·　子 Agent＝被派去做事的 AI　·　記憶空間＝AI 一次能讀進的內容量　·　這版 Hook 擋下 9 次違規，實際違規 0 次')}</div>` },

{ t: 'V6 最強模型＋Hooks', n: 'V6 想回答：最強的模型加上最好的架構，會不會更好？Fable 不分工，我比了三組：直接做、加 Hooks、加 Hooks 再加自我檢查。原始分數是 12、8、10，看起來加了 Hooks 反而變差。但我發現三組的閱卷嚴格程度不一樣。閱卷 AI 驗證「每頁都有常見問題」這類說法時，會去翻網頁找反例。第一組它只翻了 5 頁，第二組 7 頁，第三組翻了 24 頁。翻得越多，越容易找到例外，所以分數低，可能只是被改得比較嚴。就像三個學生考試，老師改第一份只抽 5 題，改第三份抽 24 題，分數不能直接比。所以我改用同一批 24 頁，三組全部重判。', html: () => H(eb('V6', 2, '最強模型＋Hooks'), '三組閱卷時抽查的頁數不同，分數不能直接比') + `<div class="bd vv">${chg('Fable 指揮、Opus 執行', 'Fable 不分工，比三組：直接做、加 Hooks、加 Hooks＋自我檢查')}
  ${why('最強的模型加上最好的架構，會不會更好？', '想回答')}
  ${res([['12', '直接做'], ['8', '加 Hooks'], ['10', '加 Hooks＋自我檢查']], '閱卷 AI 會翻網頁找反例。第一組只翻 5 頁，第三組翻了 24 頁，翻越多越容易找到例外', '問題在閱卷')}
  ${nxt('用同一批 24 頁，三組全部重判', '所以')}</div>` },

{ t: 'V6 再驗證', n: '同一批 24 頁重判後，三組是 3、1、2 條，分不出高下。失敗原因幾乎都一樣：32 條不通過裡，有 26 條是證據撐不起主張。舉一個例子：Fable 說每個關鍵字頁的「常見問題」都固定 5 題。實際檢查 24 頁，只有 22 頁是 5 題，它卻寫成全部。另外 2 頁其實只有 3 題。核心事實是對的，但範圍說得比證據大，這就是講太滿。這頁有三個限制要說明：重判標準更嚴，不能和其他分數直接比；這批頁面來自第三組，對它略為有利；每組也只跑了 1 次。所以下一版我只打算加一個檢查，叫範圍檢查：只要說法用了「每個、全部、都」，程式就檢查它看過幾頁、這些頁裡有沒有反例。只看 1、2 頁或有反例，就退回，要它改成「抽查 24 頁中 22 頁是 5 題」。這和引用檢查是同一個思路，交給程式擋，不靠 AI 自己記得。之前自我檢查的實驗裡，有 2 條就是把「一律」改成「抽查的 7 頁都」之後才通過，所以這個方向有跡象可行。', html: () => H(eb('V6', 2, '再驗證'), '同一批頁面重判，分不出高下，共同問題是講太滿') + `<div class="bd vv">${tbl(['組別', '原本', '同一批 24 頁重判', '重判一致率'], [['Fable 直接做', '12', '<b>3</b>', '0.8'], ['Fable＋Hooks', '8', '<b>1</b>', '0.8'], ['Fable＋Hooks＋自我檢查', '10', '<b>2</b>', '1.0']], 'rc')}
  ${res([['26/32', '不通過是因為證據撐不起主張']], 'Fable 說每個關鍵字頁的「常見問題」都固定 5 題。檢查 24 頁，只有 22 頁是 5 題，它卻寫成全部', '講太滿的例子')}
  ${nxt('範圍檢查：寫了「每個、全部」，程式就查看過幾頁、有沒有反例；不符就退回，改成「24 頁中 22 頁」', '下一版')}
  ${def('講太滿＝核心事實對，但範圍寫得比證據大　·　重判標準更嚴，不能和其他分數比　·　這批頁面來自第三組　·　每組只跑 1 次')}</div>` },

// ---------- 總結 ----------
{ t: '全部成績', alt: 1, n: '這張把 V2 之後用同一場考試的成績放在一起。先看顏色就好。最深的是 Fable，大約 8 到 12 條。中間是 Opus，大多 6 到 11 條。最淺的是 Haiku，大約 3 條。整體來看，模型強弱造成的差距最大。個別組合會有例外，例如 Opus 加 Hooks 和自我檢查也有 11 條。差 2 條以內，我都當作差不多。', html: () => H('總結　·　V2 之後用同一場考試的成績', '模型強弱造成的差距最大') + `<div class="bd" style="gap:14px">${SCORES.map(([l, v, t, c, s]) => bar(l, v, 12, t, c, s)).join('')}<p class="mute">深＝Fable　·　中＝Opus　·　淺＝Haiku　·　差 2 條以內算差不多</p></div>` },

{ t: '架構和模型各贏什麼', alt: 1, n: '把結果整理成 4 個問題。找到多少，靠模型：Fable 12、Opus 6 到 8、Haiku 大約 3。說得準不準，靠 Hooks：Haiku 的捏造從 6 次降到 1 次。花不花得值，靠不分工：Fable 自己做 5.9 美元，分工要 23 美元。越跑越好，目前還沒解決，5 輪是 5、8、7、7、6。所以，模型決定找到多少，架構決定能不能相信。', html: () => H('總結', '模型決定找到多少，架構決定能不能相信') + `<div class="bd">${tbl(['問題', '靠什麼', '證據'], [['找到多少', '<b>模型</b>', 'Fable 12、Opus 6～8、Haiku 約 3'], ['說得準不準', '<b>Hooks</b>', 'Haiku 捏造 6 → 1'], ['花不花得值', '<b>不分工</b>', 'Fable 自己做 $5.9，分工 $23'], ['越跑越好', '<b>還沒解決</b>', '5 輪 5、8、7、7、6']], 'win')}</div>` },

{ t: '目前最好的架構', dark: 1, n: '我目前會保留的流程是：網站普查、用 Tools 讀網頁、只能新增的紀錄、引用檢查，最後由系統收尾。Hooks 和這些 Tools 會保留。記憶、抽樣、自我檢查和多 Agent，程式都還在，但不預設開啟，因為沒有證實有用。下一版只加一個東西：範圍檢查。AI 寫「每個、全部」時，程式檢查它看過幾頁、有沒有反例，不符就退回，「24 頁中 22 頁」不能寫成「每一頁」。', html: () => H('總結', '留下有證據的，拿掉沒證實的') + `<div class="bd"><div class="pl">${['網站普查', '用 Tools 讀網頁', '只能新增的紀錄', '引用檢查', '系統收尾'].map((x) => `<span>${x}</span>`).join('<i class="tn-ar"></i>')}<i class="tn-ar"></i><span class="next">範圍檢查（下一版）</span></div>
  <div class="g3 keep"><div class="box"><h4>${ok}　保留</h4><p>Hooks、網站普查、讀網頁的 Tools、引用檢查</p></div><div class="box"><h4>${no}　不預設開啟</h4><p>記憶、抽樣、自我檢查、多 Agent</p></div><div class="box hl"><h4>＋　下一版要加</h4><p>範圍檢查：寫「每個、全部」時，程式查看過幾頁、有沒有反例；不符就退回</p></div></div></div>` },

{ t: '我學到什麼', dark: 1, n: '回頭看，每一次轉向，都是因為實驗推翻了我原本的想法。V1 推翻了「先設計就好」，審查關卡全過，實測卻只有 3/8，所以我改成直接看強模型怎麼做。V2 推翻了「加功能就會變好」，加了 4 個功能，累計 27 對 25，所以我改成先做一把固定的尺。V3 推翻了「分數一定可信」，第一次一致率只有 67%，所以我修好閱卷標準，全部重判。V6 推翻了「原始分數可以直接比」，三組閱卷抽查的頁數是 5、7、24 頁，所以我改用同一批頁面重判。所以我現在的做法是：把「感覺有用」改成「量過才留下」。', html: () => H('總結', '先做尺，量過才留下') + `<div class="bd"><div class="lrn">${[['V1', '推翻「先設計就好」', '審查關卡全過，實測 3/8', '改成看強模型怎麼做'], ['V2', '推翻「加功能就會變好」', '4 個功能，累計 27 對 25', '改成先做一把固定的尺'], ['V3', '推翻「分數一定可信」', '第一次一致率 67%', '修好閱卷標準，全部重判'], ['V6', '推翻「原始分數可以直接比」', '閱卷抽查頁數 5、7、24 頁不同', '改用同一批 24 頁重判']].map(([id, t, e, to]) => `<div class="lr">${pill(id)}<b>${t}</b><span>${e}</span><span class="to">→ ${to}</span></div>`).join('')}</div>
  <p class="lead">每次轉向都是被實驗推翻，所以我把<b>「感覺有用」</b>改成<b>「量過才留下」</b>。</p></div>` },

{ t: '限制與下一步', dark: 1, n: '最後說明限制。我只測了 2030.tw 一個網站。多數設定只跑 1 到 10 次，閱卷誤差大約 2 條。我也沒有付費的 SEO 工具，所以站外證據有限。下一步有三件事。第一，加範圍檢查，「22/24 頁」不能寫成「全部」。第二，換 3 到 5 個沒看過的網站，確認這些結論還成不成立。第三，測試便宜的模型加上好的架構，能不能接近強模型。以上是我的分享，謝謝大家。', html: () => H('限制與下一步', '先解決講太滿，再換網站驗證') + `<div class="bd"><div class="row" style="flex:1;gap:48px"><div class="box grow"><h4>限制</h4><ul class="ul"><li>只測了 2030.tw 一個網站</li><li>多數設定只跑 1～10 次，閱卷誤差約 2 條</li><li>沒有付費 SEO 工具，站外證據有限</li></ul></div><div class="box grow acc2"><h4>下一步</h4><ul class="ul"><li>加範圍檢查：「22/24 頁」不能寫成「全部」</li><li>換 3～5 個沒看過的網站</li><li>測便宜的模型能不能接近強模型</li></ul></div></div></div>` },

// ---------- 附錄 ----------
{ t: '備用：多 Agent', n: '（被問到為什麼不一開始就做多 Agent 時再翻出來。）多 Agent 一開始就要回答三個問題：分成幾個？怎麼分？誰負責什麼？這是一個沒有邊界的設計問題。相比之下，單一流程至少能先做好，也量得出來。實際數據也支持這個順序：實驗版允許 Fable 自由派子 Agent，它 3 輪只派過 1 次。V5 我刻意測了分工，在這個任務上沒有加分，還貴 4 倍。我認為值得分工的時機，是任務長到單一 AI 的記憶空間放不下的時候。', html: () => H('備用頁　·　如果被問到多 Agent', '為什麼我最後才試分工') + `<div class="bd"><div class="row" style="gap:20px">${['分成幾個？', '怎麼分？', '誰負責什麼？'].map((x) => `<div class="box grow qbox"><h4>${x}</h4></div>`).join('')}</div><p class="lead">這是一個沒有邊界的設計問題；單一流程至少能先做好、量得出來</p><ul class="ul"><li>實驗版允許 Fable 自由派子 Agent，3 輪只派過 1 次</li><li>V5 實測分工，在這個任務上沒有加分，還貴 4 倍</li><li>值得分工的時機：任務長到單一 AI 的記憶空間放不下</li></ul></div>` },

{ t: '來源', n: '（被追問出處時再打開，平常不用講。）倒三角來自 Lauren Tan 的演講，Fable 指揮 Opus 的做法參考了 Flavio Copes 的文章。面試交付版的開發紀錄在 seo-task1 的 ai-dev-log，之後的實驗都記錄在 DECISIONS.md，每個版本都有 git 標籤可以回查。', html: () => H('附錄', '來源') + `<div class="bd"><ul class="src"><li><b>Lauren Tan 演講</b>　youtube.com/watch?v=NjoZoUm85x0</li><li><b>五層解讀</b>　redreamality.com/blog/lauren-tan-poteto-trust-before-parallel</li><li><b>Fable 指揮 Opus 的做法</b>　flaviocopes.com/fable-orchestrator</li><li><b>面試交付版開發紀錄</b>　seo-task1/docs/ai-dev-log.md</li><li><b>實驗紀錄</b>　seo-experiment/DECISIONS.md（每個版本都有 git 標籤）</li></ul></div>` },
];

// ---------- 引擎 ----------
const stage = document.getElementById('stage');
const N = SLIDES.length;
stage.innerHTML = SLIDES.map((s, i) => `<section class="slide ${s.dark ? 'dark' : s.alt ? 'alt' : ''}" data-i="${i}" aria-label="${s.t}">${s.html()}${s.ch !== undefined ? `<div class="ft">${RAIL.map((r, k) => `<span class="${k === s.ch ? 'on' : ''}">${r}</span>`).join('')}</div>` : ''}</section>`).join('');
const els = [...stage.children];
const rvs = els.map((e) => [...e.querySelectorAll('.rv')]);
const steps = els.map(() => 0);
let cur = 0;

const apply = () => {
  rvs[cur].forEach((e, k) => e.classList.toggle('on', k < steps[cur]));
  document.getElementById('progress').style.width = `${((cur + 1) / N) * 100}%`;
  document.getElementById('notes').textContent = SLIDES[cur].n || '';
  document.querySelectorAll('#toc li').forEach((li, k) => li.classList.toggle('cur', k === cur));
};
const show = (i, full) => {
  cur = Math.max(0, Math.min(N - 1, i));
  els.forEach((e, k) => e.classList.toggle('active', k === cur));
  steps[cur] = rvs[cur].length;
  apply();
  history.replaceState(null, '', `#${cur + 1}`);
  document.title = `${SLIDES[cur].t}　·　SEO Agent 六個版本`;
};
// 每頁一次完整顯示，按一下直接換頁
const next = () => { if (cur < N - 1) show(cur + 1, true); };
const prev = () => { if (cur > 0) show(cur - 1, true); };

const fit = () => { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `scale(${s})`; };
addEventListener('resize', fit); fit();

const drawer = document.getElementById('drawer');
document.getElementById('toc').innerHTML = SLIDES.map((s, i) => `<li><button data-go="${i}"><span>${i + 1}</span>${s.t}</button></li>`).join('');
const toggle = (o) => drawer.classList.toggle('open', o);
document.getElementById('menu-btn').addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
drawer.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) { show(+b.dataset.go, true); toggle(false); } e.stopPropagation(); });

document.getElementById('viewport').addEventListener('click', () => { if (drawer.classList.contains('open')) toggle(false); else next(); });
addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); next(); }
  else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
  else if (k === 'Home') show(0);
  else if (k === 'End') show(N - 1, true);
  else if (k === 'g' || k === 'G') toggle();
  else if (k === 'n' || k === 'N') document.getElementById('notes').classList.toggle('open');
  else if (k === 't' || k === 'T') setTheme(theme + 1, true);
  else if (k === 'Escape') toggle(false);
});
let tx = null;
addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
addEventListener('touchend', (e) => { if (tx === null) return; const d = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(d) > 50) (d < 0 ? next : prev)(); });

// 配色：T 鍵循環；?t=1~5 可指定；選擇會記在這個瀏覽器
const THEMES = ['黑橘', '石墨青', '黑白紅', '森林綠', '海軍藍'];
const THEME_CLASS = ['t5', 't1', 't2', 't3', 't4'];
let theme = 0;
const setTheme = (i, say) => {
  theme = ((i % THEMES.length) + THEMES.length) % THEMES.length;
  document.documentElement.className = THEME_CLASS[theme];
  try { localStorage.setItem('seo-story-theme-v2', String(theme)); } catch (e) { /* 無痕模式等情況略過 */ }
  if (say) { const hn = document.getElementById('hint'); hn.textContent = `配色：${THEMES[theme]}（按 T 換）`; hn.classList.remove('off'); clearTimeout(setTheme.t); setTheme.t = setTimeout(() => hn.classList.add('off'), 2000); }
};
{
  const q = parseInt(new URLSearchParams(location.search).get('t'), 10);
  let saved = NaN;
  try { saved = parseInt(localStorage.getItem('seo-story-theme-v2'), 10); } catch (e) { /* 略過 */ }
  setTheme(q >= 1 && q <= THEMES.length ? q - 1 : (saved >= 0 ? saved : 3), false);
}

const h = parseInt(location.hash.slice(1), 10);
show(h >= 1 && h <= N ? h - 1 : 0, true);
setTimeout(() => document.getElementById('hint').classList.add('off'), 5000);
})();
