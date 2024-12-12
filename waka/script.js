﻿// 示例数据：使用你提供的格式
const hyakuninIssh = [
    { "first_half": "秋の田の　かりほの庵の　苫をあらみ", "second_half": "わが衣手は　露にぬれつつ" },
    { "first_half": "春過ぎて　夏来にけらし　白妙の", "second_half": "衣干すてふ　天の香具山" },
    { "first_half": "あしびきの　山鳥の尾の　しだり尾の", "second_half": "ながながし夜を　ひとりかも寝む" },
    { "first_half": "田子の浦に　うち出でて見れば　白妙の", "second_half": "富士の高嶺に　雪は降りつつ" },
    { "first_half": "奥山に　紅葉踏み分け　鳴く鹿の", "second_half": "声聞く時ぞ　秋は悲しき" },
    { "first_half": "鵲の　渡せる橋に　置く霜の", "second_half": "白きを見れば　夜ぞ更けにける" },
    { "first_half": "天の原　ふりさけ見れば　春日なる", "second_half": "三笠の山に　出でし月かも" },
    { "first_half": "わが庵は　都の辰巳　しかぞ住む", "second_half": "世をうぢ山と　人はいふなり" },
    { "first_half": "花の色は　移りにけりな　いたづらに", "second_half": "わが身世にふる　ながめせしまに" },
    { "first_half": "これやこの　行くも帰るも別れては", "second_half": "知るも知らぬも　逢坂の関" },
    { "first_half": "わたの原　八十島かけて　漕ぎ出でぬと", "second_half": "人には告げよ　海人の釣船" },
    { "first_half": "天つ風　雲の通ひ路　吹き閉ぢよ", "second_half": "乙女の姿　しばしとどめむ" },
    { "first_half": "筑波嶺の　峰より落つる　男女川", "second_half": "恋ぞ積もりて　淵となりぬる" },
    { "first_half": "陸奥の　しのぶもぢずり　誰ゆゑに", "second_half": "乱れそめにし　われならなくに" },
    { "first_half": "君がため　春の野に出でて　若菜摘む", "second_half": "わが衣手に　雪は降りつつ" },
    { "first_half": "立ち別れ　いなばの山の　峰に生ふる", "second_half": "まつとし聞かば　今帰り来む" },
    { "first_half": "ちはやぶる　神代も聞かず　竜田川", "second_half": "からくれなゐに　水くくるとは" },
    { "first_half": "住の江の　岸に寄る波　よるさへや", "second_half": "夢の通ひ路　人目よくらむ" },
    { "first_half": "難波潟　短き蘆の　ふしの間も", "second_half": "逢はでこの世を　過ぐしてよとや" },
    { "first_half": "わびぬれば　今はたおなじ　難波なる", "second_half": "みをつくしても　逢はむとぞ思ふ" },
    { "first_half": "今来むと　言ひしばかりに　長月の", "second_half": "有明の月を　待ち出でつるかな" },
    { "first_half": "吹くからに　秋の草木の　しをるれば", "second_half": "むべ山風を　嵐といふらむ" },
    { "first_half": "月見れば　ちぢにものこそ　悲しけれ", "second_half": "わが身一つの　秋にはあらねど" },
    { "first_half": "このたびは　ぬさも取りあへず　手向山", "second_half": "紅葉の錦　神のまにまに" },
    { "first_half": "名にし負はば　逢坂山の　さねかづら", "second_half": "人に知られで　来るよしもがな" },
    { "first_half": "小倉山　峰のもみぢ葉　心あらば", "second_half": "今ひとたびの　みゆき待たなむ" },
    { "first_half": "みかの原　わきて流るる　泉川", "second_half": "いつ見きとてか　恋しかるらむ" },
    { "first_half": "山里は　冬ぞ寂しさ　まさりける", "second_half": "人目も草も　かれぬと思へば" },
    { "first_half": "心あてに　折らばや折らむ　初霜の", "second_half": "置きまどはせる　白菊の花" },
    { "first_half": "有明の　つれなく見えし　別れより", "second_half": "暁ばかり　憂きものはなし" },
    { "first_half": "朝ぼらけ　有明の月と　見るまでに", "second_half": "吉野の里に　降れる白雪" },
    { "first_half": "山川に　風のかけたる　しがらみは", "second_half": "流れもあへぬ　紅葉なりけり" },
    { "first_half": "ひさかたの　光のどけき　春の日に", "second_half": "静心なく　花の散るらむ" },
    { "first_half": "誰をかも　知る人にせむ　高砂の", "second_half": "松も昔の　友ならなくに" },
    { "first_half": "人はいさ　心も知らず　ふるさとは", "second_half": "花ぞ昔の　香に匂ひける" },
    { "first_half": "夏の夜は　まだ宵ながら　明けぬるを", "second_half": "雲のいづこに　月宿るらむ" },
    { "first_half": "白露に　風の吹きしく　秋の野は", "second_half": "つらぬきとめぬ　玉ぞ散りける" },
    { "first_half": "忘らるる　身をば思はず　誓ひてし", "second_half": "人の命の　惜しくもあるかな" },
    { "first_half": "浅茅生の　小野の篠原　しのぶれど", "second_half": "あまりてなどか　人の恋しき" },
    { "first_half": "しのぶれど　色に出でにけり　わが恋は", "second_half": "ものや思ふと　人の問ふまで" },
    { "first_half": "恋すてふ　わが名はまだき　立ちにけり", "second_half": "人知れずこそ　思ひそめしか" },
    { "first_half": "契りきな　かたみに袖を　しぼりつつ", "second_half": "末の松山　波越さじとは" },
    { "first_half": "逢ひ見ての　のちの心に　くらぶれば", "second_half": "昔はものを　思はざりけり" },
    { "first_half": "逢ふことの　絶えてしなくは　なかなかに", "second_half": "人をも身をも　恨みざらまし" },
    { "first_half": "あはれとも　いふべき人は　思ほえで", "second_half": "身のいたづらに　なりぬべきかな" },
    { "first_half": "由良の門を　渡る舟人　かぢを絶え", "second_half": "ゆくへも知らぬ　恋のみちかな" },
    { "first_half": "八重むぐら　しげれる宿の　さびしきに", "second_half": "人こそ見えね　秋は来にけり" },
    { "first_half": "風をいたみ　岩うつ波の　おのれのみ", "second_half": "くだけてものを　思ふころかな" },
    { "first_half": "御垣守　衛士のたく火の　夜は燃え", "second_half": "昼は消えつつ　ものをこそ思へ" },
    { "first_half": "君がため　惜しからざりし　命さへ", "second_half": "長くもがなと　思ひけるかな" },
    { "first_half": "かくとだに　えやは伊吹の　さしも草", "second_half": "さしも知らじな　燃ゆる思ひを" },
    { "first_half": "明けぬれば　暮るるものとは　知りながら", "second_half": "なほうらめしき　朝ぼらけかな" },
    { "first_half": "嘆きつつ　ひとり寝る夜の　明くる間は", "second_half": "いかに久しき　ものとかは知る" },
    { "first_half": "忘れじの　ゆく末までは　かたければ", "second_half": "今日を限りの　命ともがな" },
    { "first_half": "滝の音は　絶えて久しく　なりぬれど", "second_half": "名こそ流れて　なほ聞こえけれ" },
    { "first_half": "あらざらむ　この世のほかの　思ひ出に", "second_half": "いまひとたびの　逢ふこともがな" },
    { "first_half": "めぐり逢ひて　見しやそれとも　わかぬ間に", "second_half": "雲がくれにし　夜半の月かな" },
    { "first_half": "有馬山　猪名の笹原　風吹けば", "second_half": "いでそよ人を　忘れやはする" },
    { "first_half": "やすらはで　寝なましものを　さ夜更けて", "second_half": "傾くまでの　月を見しかな" },
    { "first_half": "大江山　いく野の道の　遠ければ", "second_half": "まだふみも見ず　天の橋立" },
    { "first_half": "いにしへの　奈良の都の　八重桜", "second_half": "けふ九重に　にほひぬるかな" },
    { "first_half": "夜をこめて　鳥の空音は　謀るとも", "second_half": "よに逢坂の　関はゆるさじ" },
    { "first_half": "今はただ　思ひ絶えなむ　とばかりを", "second_half": "人づてならで　いふよしもがな" },
    { "first_half": "朝ぼらけ　宇治の川霧　たえだえに", "second_half": "あらはれわたる　瀬々の網代木" },
    { "first_half": "恨みわび　ほさぬ袖だに　あるものを", "second_half": "恋に朽ちなむ　名こそ惜しけれ" },
    { "first_half": "もろともに　あはれと思へ　山桜", "second_half": "花よりほかに　知る人もなし" },
    { "first_half": "春の夜の　夢ばかりなる　手枕に", "second_half": "かひなく立たむ　名こそをしけれ" },
    { "first_half": "心にも　あらで憂き夜に　長らへば", "second_half": "恋しかるべき　夜半の月かな" },
    { "first_half": "嵐吹く　三室の山の　もみぢ葉は", "second_half": "竜田の川の　錦なりけり" },
    { "first_half": "寂しさに　宿を立ち出でて　ながむれば", "second_half": "いづこも同じ　秋の夕暮れ" },
    { "first_half": "夕されば　門田の稲葉　訪れて", "second_half": "蘆のまろ屋に　秋風ぞ吹く" },
    { "first_half": "音に聞く　高師の浜の　あだ波は", "second_half": "かけじや袖の　ぬれもこそすれ" },
    { "first_half": "高砂の　尾の上の桜　咲きにけり", "second_half": "外山の霞　立たずもあらなむ" },
    { "first_half": "憂かりける　人を初瀬の　山おろしよ", "second_half": "激しかれとは　祈らぬものを" },
    { "first_half": "契りおきし　させもが露を　命にて", "second_half": "あはれ今年の　秋もいぬめり" },
    { "first_half": "わたの原　漕ぎ出でて見れば　ひさかたの", "second_half": "雲居にまがふ　沖つ白波" },
    { "first_half": "瀬をはやみ　岩にせかるる　滝川の", "second_half": "われても末に　逢はむとぞ思ふ" },
    { "first_half": "淡路島　通ふ千鳥の　鳴く声に", "second_half": "幾夜寝覚めぬ　須磨の関守" },
    { "first_half": "秋風に　たなびく雲の　絶え間より", "second_half": "漏れ出づる月の　影のさやけさ" },
    { "first_half": "長からむ　心も知らず　黒髪の", "second_half": "乱れて今朝は　物をこそ思へ" },
    { "first_half": "ほととぎす　鳴きつる方を　ながむれば", "second_half": "ただ有明の　月ぞ残れる" },
    { "first_half": "思ひわび　さても命は　あるものを", "second_half": "憂きに堪へぬは　涙なりけり" },
    { "first_half": "世の中よ　道こそなけれ　思ひ入る", "second_half": "山の奥にも　鹿ぞ鳴くなる" },
    { "first_half": "長らへば　またこのごろや　しのばれむ", "second_half": "憂しと見し世ぞ　今は恋しき" },
    { "first_half": "夜もすがら　物思ふころは　明けやらで", "second_half": "閨のひまさへ　つれなかりけり" },
    { "first_half": "嘆けとて　月やは物を　思はする", "second_half": "かこち顔なる　わが涙かな" },
    { "first_half": "村雨の　露もまだ干ぬ　真木の葉に", "second_half": "霧立ちのぼる　秋の夕暮れ" },
    { "first_half": "難波江の　蘆のかりねの　ひとよゆゑ", "second_half": "身を尽くしてや　恋ひわたるべき" },
    { "first_half": "玉の緒よ　絶えなば絶えね　ながらへば", "second_half": "忍ぶることの　弱りもぞする" },
    { "first_half": "見せばやな　雄島の海人の　袖だにも", "second_half": "濡れにぞ濡れし　色は変はらず" },
    { "first_half": "きりぎりす　鳴くや霜夜の　さむしろに", "second_half": "衣かたしき　ひとりかも寝む" },
    { "first_half": "わが袖は　潮干に見えぬ　沖の石の", "second_half": "人こそ知らね　かわく間もなし" },
    { "first_half": "世の中は　常にもがもな　渚漕ぐ", "second_half": "海人の小舟の　綱手かなしも" },
    { "first_half": "み吉野の　山の秋風　さよ更けて", "second_half": "ふるさと寒く　衣打つなり" },
    { "first_half": "おほけなく　憂き世の民に　おほふかな", "second_half": "わが立つ杣に　墨染の袖" },
    { "first_half": "花さそふ　嵐の庭の　雪ならで", "second_half": "ふりゆくものは　わが身なりけり" },
    { "first_half": "来ぬ人を　松帆の浦の　夕なぎに", "second_half": "焼くや藻塩の　身もこがれつつ" },
    { "first_half": "風そよぐ　楢の小川の　夕暮は", "second_half": "御禊ぞ夏の　しるしなりける" },
    { "first_half": "人も惜し　人も恨めし　あぢきなく", "second_half": "世を思ふゆゑに　物思ふ身は" },
    { "first_half": "百敷や　古き軒端の　しのぶにも", "second_half": "なほ余りある　昔なりけり" }
];

const hyakuninIsshu = [
    { "first_half": "更新の停止", "second_half": "（；_；）" }
]

// 获取要插入诗歌的容器
const poemListContainer = document.querySelector('.poem-list');

// 遍历每一首诗歌，并创建相应的 HTML 元素
hyakuninIsshu.forEach(poem => {
  // 创建一个诗歌项的容器
  const poemItem = document.createElement('div');
  poemItem.classList.add('poem-item');

  // 创建并设置上半句和下半句的元素
  const topLine = document.createElement('div');
  topLine.classList.add('half-line', 'left');
  topLine.textContent = poem.first_half;

  const bottomLine = document.createElement('div');
  bottomLine.classList.add('half-line', 'right');
  bottomLine.textContent = poem.second_half;

  // 将上半句和下半句加入诗歌项容器
  poemItem.appendChild(topLine);
  poemItem.appendChild(bottomLine);

  // 将诗歌项加入到列表容器中
  poemListContainer.appendChild(poemItem);
});
