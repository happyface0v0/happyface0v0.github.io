// 示例数据：使用你提供的格式
const hyakuninIsshuKanji = [
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
    { "first_half": "あきのたの　かりほのいほの　とまをあらみ", "second_half": "わがころもでは　つゆにぬれつつ" },
    { "first_half": "はるすぎて　なつきにけらし　しろたへの", "second_half": "ころもほすてふ　あまのかぐやま" },
    { "first_half": "あしびきの　やまどりのをの　しだりをの", "second_half": "ながながしよを　ひとりかもねむ" },
    { "first_half": "たごのうらに　うちいでてみれば　しろたへの", "second_half": "ふじのたかねに　ゆきはふりつつ" },
    { "first_half": "おくやまに　もみぢふみわけ　なくしかの", "second_half": "こゑきくときぞ　あきはかなしき" },
    { "first_half": "かささぎの　わたせるはしに　おくしもの", "second_half": "しろきをみれば　よぞふけにける" },
    { "first_half": "あまのはら　ふりさけみれば　かすがなる", "second_half": "みかさのやまに　いでしつきかも" },
    { "first_half": "わがいほは　みやこのたつみ　しかぞすむ", "second_half": "よをうぢやまと　ひとはいふなり" },
    { "first_half": "はなのいろは　うつりにけりな　いたづらに", "second_half": "わがみよにふる　ながめせしまに" },
    { "first_half": "これやこの　いくもかへるも　わかれては", "second_half": "しるもしらぬも　あふさかのせき" },
    { "first_half": "わたのはら　やそしまかけて　こぎいでぬと", "second_half": "ひとにはつげよ　あまのつりぶね" },
    { "first_half": "あまつかぜ　くものかよひぢ　ふきとぢよ", "second_half": "をとめのすがた　しばしとどめむ" },
    { "first_half": "つくばねの　みねよりおつる　みなのがは", "second_half": "こひぞつもりて　ふちとなりぬる" },
    { "first_half": "みちのくの　しのぶもぢずり　たれゆゑに", "second_half": "みだれそめにし　われならなくに" },
    { "first_half": "きみがため　はるののにいでて　わかなつむ", "second_half": "わがころもでに　ゆきはふりつつ" },
    { "first_half": "たちわかれ　いなばのやまの　みねにおふる", "second_half": "まつとしきかば　いまかへりこむ" },
    { "first_half": "ちはやぶる　かみよもきかず　たつたがは", "second_half": "からくれなゐに　みづくくるとは" },
    { "first_half": "すみのえの　きしによるなみ　よるさへや", "second_half": "ゆめのかよひぢ　ひとめよくらむ" },
    { "first_half": "なにはがた　みじかきあしの　ふしのまも", "second_half": "あはでこのよを　すぐしてよとや" },
    { "first_half": "わびぬれば　いまはたおなじ　なにはなる", "second_half": "みをつくしても　あはむとぞおもふ" },
    { "first_half": "いまこむと　いひしばかりに　ながつきの", "second_half": "ありあけのつきを　まちいでつるかな" },
    { "first_half": "ふくからに　あきのくさきの　しをるれば", "second_half": "むべやまかぜを　あらしといふらむ" },
    { "first_half": "つきみれば　ちぢにものこそ　かなしけれ", "second_half": "わがみひとつの　あきにはあらねど" },
    { "first_half": "このたびは　ぬさもとりあへず　たむけやま", "second_half": "もみぢのにしき　かみのまにまに" },
    { "first_half": "なにしおはば　あふさかやまの　さねかづら", "second_half": "ひとにしられで　くるよしもがな" },
    { "first_half": "をぐらやま　みねのもみぢば　こころあらば", "second_half": "いまひとたびの　みゆきまたなむ" },
    { "first_half": "みかのはら　わきてながるる　いづみがは", "second_half": "いつみきとてか　こひしかるらむ" },
    { "first_half": "やまざとは　ふゆぞさびしさ　まさりける", "second_half": "ひとめもくさも　かれぬとおもへば" },
    { "first_half": "こころあてに　をらばやをらむ　はつしもの", "second_half": "おきまどはせる　しらぎくのはな" },
    { "first_half": "ありあけの　つれなくみえし　わかれより", "second_half": "あかつきばかり　うきものはなし" },
    { "first_half": "あさぼらけ　ありあけのつきと　みるまでに", "second_half": "よしののさとに　ふれるしらゆき" },
    { "first_half": "やまがはに　かぜのかけたる　しがらみは", "second_half": "ながれもあへぬ　もみぢなりけり" },
    { "first_half": "ひさかたの　ひかりのどけき　はるのひに", "second_half": "しづごころなく　はなのちるらむ" },
    { "first_half": "たれをかも　しるひとにせむ　たかさごの", "second_half": "まつもむかしの　ともならなくに" },
    { "first_half": "ひとはいさ　こころもしらず　ふるさとは", "second_half": "はなぞむかしの　かににほひける" },
    { "first_half": "なつのよは　まだよひながら　あけぬるを", "second_half": "くものいづこに　つきやどるらむ" },
    { "first_half": "しらつゆに　かぜのふきしく　あきののは", "second_half": "つらぬきとめぬ　たまぞちりける" },
    { "first_half": "わすらるる　みをばおもはず　ちかひてし", "second_half": "ひとのいのちの　をしくもあるかな" },
    { "first_half": "あさぢふの　をののしのはら　しのぶれど", "second_half": "あまりてなどか　ひとのこひしき" },
    { "first_half": "しのぶれど　いろにいでにけり　わがこひは", "second_half": "ものやおもふと　ひとのとふまで" },
    { "first_half": "こひすてふ　わがなはまだき　たちにけり", "second_half": "ひとしれずこそ　おもひそめしか" },
    { "first_half": "ちぎりきな　かたみにそでを　しぼりつつ", "second_half": "すゑのまつやま　なみこさじとは" },
    { "first_half": "あひみての　のちのこころに　くらぶれば", "second_half": "むかしはものを　おもはざりけり" },
    { "first_half": "あふことの　たえてしなくは　なかなかに", "second_half": "ひとをもみをも　うらみざらまし" },
    { "first_half": "あはれとも　いふべきひとは　おもほえで", "second_half": "みのいたづらに　なりぬべきかな" },
    { "first_half": "ゆらのとを　わたるふなびと　かぢをたえ", "second_half": "ゆくへもしらぬ　こひのみちかな" },
    { "first_half": "やへむぐら　しげれるやどの　さびしきに", "second_half": "ひとこそみえね　あきはきにけり" },
    { "first_half": "かぜをいたみ　いはうつなみの　おのれのみ", "second_half": "くだけてものを　おもふころかな" },
    { "first_half": "みかきもり　ゑじのたくひの　よるはもえ", "second_half": "ひるはきえつつ　ものをこそおもへ" },
    { "first_half": "きみがため　をしからざりし　いのちさへ", "second_half": "ながくもがなと　おもひけるかな" },
    { "first_half": "かくとだに　えやはいぶきの　さしもぐさ", "second_half": "さしもしらじな　もゆるおもひを" },
    { "first_half": "あけぬれば　くるるものとは　しりながら", "second_half": "なほうらめしき　あさぼらけかな" },
    { "first_half": "なげきつつ　ひとりぬるよの　あくるまは", "second_half": "いかにひさしき　ものとかはしる" },
    { "first_half": "わすれじの　ゆくすゑまでは　かたければ", "second_half": "けふをかぎりの　いのちともがな" },
    { "first_half": "たきのおとは　たえてひさしく　なりぬれど", "second_half": "なこそながれて　なほきこえけれ" },
    { "first_half": "あらざらむ　このよのほかの　おもひでに", "second_half": "いまひとたびの　あふこともがな" },
    { "first_half": "めぐりあひて　みしやそれとも　わかぬまに", "second_half": "くもがくれにし　よはのつきかな" },
    { "first_half": "ありまやま　ゐなのささはら　かぜふけば", "second_half": "いでそよひとを　わすれやはする" },
    { "first_half": "やすらはで　ねなましものを　さよふけて", "second_half": "かたぶくまでの　つきをみしかな" },
    { "first_half": "おほえやま　いくののみちの　とほければ", "second_half": "まだふみもみず　あまのはしだて" },
    { "first_half": "いにしへの　ならのみやこの　やへざくら", "second_half": "けふここのへに　にほひぬるかな" },
    { "first_half": "よをこめて　とりのそらねは　はかるとも", "second_half": "よにあふさかの　せきはゆるさじ" },
    { "first_half": "いまはただ　おもひたえなむ　とばかりを", "second_half": "ひとづてならで　いふよしもがな" },
    { "first_half": "あさぼらけ　うぢのかはぎり　たえだえに", "second_half": "あらはれわたる　せぜのあじろぎ" },
    { "first_half": "うらみわび　ほさぬそでだに　あるものを", "second_half": "こひにくちなむ　なこそをしけれ" },
    { "first_half": "もろともに　あはれとおもへ　やまざくら", "second_half": "はなよりほかに　しるひともなし" },
    { "first_half": "はるのよの　ゆめばかりなる　たまくらに", "second_half": "かひなくたたむ　なこそをしけれ" },
    { "first_half": "こころにも　あらでうきよに　ながらへば", "second_half": "こひしかるべき　よはのつきかな" },
    { "first_half": "あらしふく　みむろのやまの　もみぢばは", "second_half": "たつたのかはの　にしきなりけり" },
    { "first_half": "さびしさに　やどをたちいでて　ながむれば", "second_half": "いづこもおなじ　あきのゆふぐれ" },
    { "first_half": "ゆふされば　かどたのいなば　おとづれて", "second_half": "あしのまろやに　あきかぜぞふく" },
    { "first_half": "おとにきく　たかしのはまの　あだなみは", "second_half": "かけじやそでの　ぬれもこそすれ" },
    { "first_half": "たかさごの　をのへのさくら　さきにけり", "second_half": "とやまのかすみ　たたずもあらなむ" },
    { "first_half": "うかりける　ひとをはつせの　やまおろしよ", "second_half": "はげしかれとは　いのらぬものを" },
    { "first_half": "ちぎりおきし　させもがつゆを　いのちにて", "second_half": "あはれことしの　あきもいぬめり" },
    { "first_half": "わたのはら　こぎいでてみれば　ひさかたの", "second_half": "くもゐにまがふ　おきつしらなみ" },
    { "first_half": "せをはやみ　いはにせかるる　たきがはの", "second_half": "われてもすゑに　あはむとぞおもふ" },
    { "first_half": "あはぢしま　かよふちどりの　なくこゑに", "second_half": "いくよねざめぬ　すまのせきもり" },
    { "first_half": "あきかぜに　たなびくくもの　たえまより", "second_half": "もれいづるつきの　かげのさやけさ" },
    { "first_half": "ながからむ　こころもしらず　くろかみの", "second_half": "みだれてけさは　ものをこそおもへ" },
    { "first_half": "ほととぎす　なきつるかたを　ながむれば", "second_half": "ただありあけの　つきぞのこれる" },
    { "first_half": "おもひわび　さてもいのちは　あるものを", "second_half": "うきにたへぬは　なみだなりけり" },
    { "first_half": "よのなかよ　みちこそなけれ　おもひいる", "second_half": "やまのおくにも　しかぞなくなる" },
    { "first_half": "ながらへば　またこのごろや　しのばれむ", "second_half": "うしとみしよぞ　いまはこひしき" },
    { "first_half": "よもすがら　ものおもふころは　あけやらで", "second_half": "ねやのひまさへ　つれなかりけり" },
    { "first_half": "なげけとて　つきやはものを　おもはする", "second_half": "かこちがほなる　わがなみだかな" },
    { "first_half": "むらさめの　つゆもまだひぬ　まきのはに", "second_half": "きりたちのぼる　あきのゆふぐれ" },
    { "first_half": "なにはえの　あしのかりねの　ひとよゆゑ", "second_half": "みをつくしてや　こひわたるべき" },
    { "first_half": "たまのをよ　たえなばたえね　ながらへば", "second_half": "しのぶることの　よわりもぞする" },
    { "first_half": "みせばやな　をじまのあまの　そでだにも", "second_half": "ぬれにぞぬれし　いろはかはらず" },
    { "first_half": "きりぎりす　なくやしもよの　さむしろに", "second_half": "ころもかたしき　ひとりかもねむ" },
    { "first_half": "わがそでは　しほひにみえぬ　おきのいしの", "second_half": "ひとこそしらね　かわくまもなし" },
    { "first_half": "よのなかは　つねにもがもな　なぎさこぐ", "second_half": "あまのをぶねの　つなでかなしも" },
    { "first_half": "みよしのの　やまのあきかぜ　さよふけて", "second_half": "ふるさとさむく　ころもうつなり" },
    { "first_half": "おほけなく　うきよのたみに　おほふかな", "second_half": "わがたつそまに　すみぞめのそで" },
    { "first_half": "はなさそふ　あらしのにはの　ゆきならで", "second_half": "ふりゆくものは　わがみなりけり" },
    { "first_half": "こぬひとを　まつほのうらの　ゆふなぎに", "second_half": "やくやもしほの　みもこがれつつ" },
    { "first_half": "かぜそよぐ　ならのをがはの　ゆふぐれは", "second_half": "みそぎぞなつの　しるしなりける" },
    { "first_half": "ひともをし　ひともうらめし　あぢきなく", "second_half": "よをおもふゆゑに　ものおもふみは" },
    { "first_half": "ももしきや　ふるきのきばの　しのぶにも", "second_half": "なほあまりある　むかしなりけり" }
];

const redPoems = [
    {"first_half": "なげけとて　つきやはものを　おもはする", "second_half": "かこちがほなる　わがなみだかな", "color": "r", "index": 1},
    {"first_half": "こぬひとを　まつほのうらの　ゆふなぎに", "second_half": "やくやもしほの　みもこがれつつ", "color": "r", "index": 2},
    {"first_half": "もろともに　あはれとおもへ　やまざくら", "second_half": "はなよりほかに　しるひともなし", "color": "r", "index": 3},
    {"first_half": "おとにきく　たかしのはまの　あだなみは", "second_half": "かけじやそでの　ぬれもこそすれ", "color": "r", "index": 4},
    {"first_half": "たかさごの　をのへのさくら　さきにけり", "second_half": "とやまのかすみ　たたずもあらなむ", "color": "r", "index": 5},
    {"first_half": "ながからむ　こころもしらず　くろかみの", "second_half": "みだれてけさは　ものをこそおもへ", "color": "r", "index": 6},
    {"first_half": "かくとだに　えやはいぶきの　さしもぐさ", "second_half": "さしもしらじな　もゆるおもひを", "color": "r", "index": 7},
    {"first_half": "ありまやま　ゐなのささはら　かぜふけば", "second_half": "いでそよひとを　わすれやはする", "color": "r", "index": 8},
    {"first_half": "うらみわび　ほさぬそでだに　あるものを", "second_half": "こひにくちなむ　なこそをしけれ", "color": "r", "index": 9},
    {"first_half": "たれをかも　しるひとにせむ　たかさごの", "second_half": "まつもむかしの　ともならなくに", "color": "r", "index": 10},
    {"first_half": "しのぶれど　いろにいでにけり　わがこひは", "second_half": "ものやおもふと　ひとのとふまで", "color": "r", "index": 11},
    {"first_half": "かぜをいたみ　いはうつなみの　おのれのみ", "second_half": "くだけてものを　おもふころかな", "color": "r", "index": 12},
    {"first_half": "たちわかれ　いなばのやまの　みねにおふる", "second_half": "まつとしきかば　いまかへりこむ", "color": "r", "index": 13},
    {"first_half": "ふくからに　あきのくさきの　しをるれば", "second_half": "むべやまかぜを　あらしといふらむ", "color": "r", "index": 14},
    {"first_half": "やまざとは　ふゆぞさびしさ　まさりける", "second_half": "ひとめもくさも　かれぬとおもへば", "color": "r", "index": 15},
    {"first_half": "あきのたの　かりほのいほの　とまをあらみ", "second_half": "わがころもでは　つゆにぬれつつ", "color": "r", "index": 16},
    {"first_half": "たごのうらに　うちいでてみれば　しろたへの", "second_half": "ふじのたかねに　ゆきはふりつつ", "color": "r", "index": 17},
    {"first_half": "つくばねの　みねよりおつる　みなのがは", "second_half": "こひぞつもりて　ふちとなりぬる", "color": "r", "index": 18},
    {"first_half": "よのなかよ　みちこそなけれ　おもひいる", "second_half": "やまのおくにも　しかぞなくなる", "color": "r", "index": 19},
    {"first_half": "ながらへば　またこのごろや　しのばれむ", "second_half": "うしとみしよぞ　いまはこひしき", "color": "r", "index": 20}
]

const yellowPoems = [
    {"first_half": "はるすぎて　なつきにけらし　しろたへの", "second_half": "ころもほすてふ　あまのかぐやま", "color": "y", "index": 1},
    {"first_half": "あまのはら　ふりさけみれば　かすがなる", "second_half": "みかさのやまに　いでしつきかも", "color": "y", "index": 2},
    {"first_half": "これやこの　いくもかへるも　わかれては", "second_half": "しるもしらぬも　あふさかのせき", "color": "y", "index": 3},
    {"first_half": "すみのえの　きしによるなみ　よるさへや", "second_half": "ゆめのかよひぢ　ひとめよくらむ", "color": "y", "index": 4},
    {"first_half": "やまがはに　かぜのかけたる　しがらみは", "second_half": "ながれもあへぬ　もみぢなりけり", "color": "y", "index": 5},
    {"first_half": "ひさかたの　ひかりのどけき　はるのひに", "second_half": "しづごころなく　はなのちるらむ", "color": "y", "index": 6},
    {"first_half": "しらつゆに　かぜのふきしく　あきののは", "second_half": "つらぬきとめぬ　たまぞちりける", "color": "y", "index": 7},
    {"first_half": "あさぢふの　をののしのはら　しのぶれど", "second_half": "あまりてなどか　ひとのこひしき", "color": "y", "index": 8},
    {"first_half": "ゆらのとを　わたるふなびと　かぢをたえ", "second_half": "ゆくへもしらぬ　こひのみちかな", "color": "y", "index": 9},
    {"first_half": "やへむぐら　しげれるやどの　さびしきに", "second_half": "ひとこそみえね　あきはきにけり", "color": "y", "index": 10},
    {"first_half": "たきのおとは　たえてひさしく　なりぬれど", "second_half": "なこそながれて　なほきこえけれ", "color": "y", "index": 11},
    {"first_half": "おほえやま　いくののみちの　とほければ", "second_half": "まだふみもみず　あまのはしだて", "color": "y", "index": 12},
    {"first_half": "あはぢしま　かよふちどりの　なくこゑに", "second_half": "いくよねざめぬ　すまのせきもり", "color": "y", "index": 13},
    {"first_half": "あきかぜに　たなびくくもの　たえまより", "second_half": "もれいづるつきの　かげのさやけさ", "color": "y", "index": 14},
    {"first_half": "ほととぎす　なきつるかたを　ながむれば", "second_half": "ただありあけの　つきぞのこれる", "color": "y", "index": 15},
    {"first_half": "むらさめの　つゆもまだひぬ　まきのはに", "second_half": "きりたちのぼる　あきのゆふぐれ", "color": "y", "index": 16},
    {"first_half": "みよしのの　やまのあきかぜ　さよふけて", "second_half": "ふるさとさむく　ころもうつなり", "color": "y", "index": 17},
    {"first_half": "はなさそふ　あらしのにはの　ゆきならで", "second_half": "ふりゆくものは　わがみなりけり", "color": "y", "index": 18},
    {"first_half": "よもすがら　ものおもふころは　あけやらで", "second_half": "ねやのひまさへ　つれなかりけり", "color": "y", "index": 19},
    {"first_half": "たまのをよ　たえなばたえね　ながらへば", "second_half": "しのぶることの　よわりもぞする", "color": "y", "index": 20}
];

const greenPoems = [
    {"first_half": "わがいほは　みやこのたつみ　しかぞすむ", "second_half": "よをうぢやまと　ひとはいふなり", "color": "g", "index": 1},
    {"first_half": "はなのいろは　うつりにけりな　いたづらに", "second_half": "わがみよにふる　ながめせしまに", "color": "g", "index": 2},
    {"first_half": "わたのはら　やそしまかけて　こぎいでぬと", "second_half": "ひとにはつげよ　あまのつりぶね", "color": "g", "index": 3},
    {"first_half": "きみがため　はるののにいでて　わかなつむ", "second_half": "わがころもでに　ゆきはふりつつ", "color": "g", "index": 4},
    {"first_half": "ちはやぶる　かみよもきかず　たつたがは", "second_half": "からくれなゐに　みづくくるとは", "color": "g", "index": 5},
    {"first_half": "わびぬれば　いまはたおなじ　なにはなる", "second_half": "みをつくしても　あはむとぞおもふ", "color": "g", "index": 6},
    {"first_half": "つきみれば　ちぢにものこそ　かなしけれ", "second_half": "わがみひとつの　あきにはあらねど", "color": "g", "index": 7},
    {"first_half": "をぐらやま　みねのもみぢば　こころあらば", "second_half": "いまひとたびの　みゆきまたなむ", "color": "g", "index": 8},
    {"first_half": "こころあてに　をらばやをらむ　はつしもの", "second_half": "おきまどはせる　しらぎくのはな", "color": "g", "index": 9},
    {"first_half": "ひとはいさ　こころもしらず　ふるさとは", "second_half": "はなぞむかしの　かににほひける", "color": "g", "index": 10},
    {"first_half": "なつのよは　まだよひながら　あけぬるを", "second_half": "くものいづこに　つきやどるらむ", "color": "g", "index": 11},
    {"first_half": "わすらるる　みをばおもはず　ちかひてし", "second_half": "ひとのいのちの　をしくもあるかな", "color": "g", "index": 12},
    {"first_half": "こひすてふ　わがなはまだき　たちにけり", "second_half": "ひとしれずこそ　おもひそめしか", "color": "g", "index": 13},
    {"first_half": "ちぎりきな　かたみにそでを　しぼりつつ", "second_half": "すゑのまつやま　なみこさじとは", "color": "g", "index": 14},
    {"first_half": "わすれじの　ゆくすゑまでは　かたければ", "second_half": "けふをかぎりの　いのちともがな", "color": "g", "index": 15},
    {"first_half": "やすらはで　ねなましものを　さよふけて", "second_half": "かたぶくまでの　つきをみしかな", "color": "g", "index": 16},
    {"first_half": "こころにも　あらでうきよに　ながらへば", "second_half": "こひしかるべき　よはのつきかな", "color": "g", "index": 17},
    {"first_half": "ゆふされば　かどたのいなば　おとづれて", "second_half": "あしのまろやに　あきかぜぞふく", "color": "g", "index": 18},
    {"first_half": "わがそでは　しほひにみえぬ　おきのいしの", "second_half": "ひとこそしらね　かわくまもなし", "color": "g", "index": 19},
    {"first_half": "よのなかは　つねにもがもな　なぎさこぐ", "second_half": "あまのをぶねの　つなでかなしも", "color": "g", "index": 20}
];

const bluePoems = [
    {"first_half": "あしびきの　やまどりのをの　しだりをの", "second_half": "ながながしよを　ひとりかもねむ", "color": "b", "index": 1},
    {"first_half": "ありあけの　つれなくみえし　わかれより", "second_half": "あかつきばかり　うきものはなし", "color": "b", "index": 2},
    {"first_half": "あらしふく　みむろのやまの　もみぢばは", "second_half": "たつたのかはの　にしきなりけり", "color": "b", "index": 3},
    {"first_half": "おくやまに　もみぢふみわけ　なくしかの", "second_half": "こゑきくときぞ　あきはかなしき", "color": "b", "index": 4},
    {"first_half": "あさぼらけ　ありあけのつきと　みるまでに", "second_half": "よしののさとに　ふれるしらゆき", "color": "b", "index": 5},
    {"first_half": "さびしさに　やどをたちいでて　ながむれば", "second_half": "いづこもおなじ　あきのゆふぐれ", "color": "b", "index": 6},
    {"first_half": "かささぎの　わたせるはしに　おくしもの", "second_half": "しろきをみれば　よぞふけにける", "color": "b", "index": 7},
    {"first_half": "きみがため　をしからざりし　いのちさへ", "second_half": "ながくもがなと　おもひけるかな", "color": "b", "index": 8},
    {"first_half": "うかりける　ひとをはつせの　やまおろしよ", "second_half": "はげしかれとは　いのらぬものを", "color": "b", "index": 9},
    {"first_half": "あまつかぜ　くものかよひぢ　ふきとぢよ", "second_half": "をとめのすがた　しばしとどめむ", "color": "b", "index": 10},
    {"first_half": "めぐりあひて　みしやそれとも　わかぬまに", "second_half": "くもがくれにし　よはのつきかな", "color": "b", "index": 11},
    {"first_half": "わたのはら　こぎいでてみれば　ひさかたの", "second_half": "くもゐにまがふ　おきつしらなみ", "color": "b", "index": 12},
    {"first_half": "みちのくの　しのぶもぢずり　たれゆゑに", "second_half": "みだれそめにし　われならなくに", "color": "b", "index": 13},
    {"first_half": "いにしへの　ならのみやこの　やへざくら", "second_half": "けふここのへに　にほひぬるかな", "color": "b", "index": 14},
    {"first_half": "きりぎりす　なくやしもよの　さむしろに", "second_half": "ころもかたしき　ひとりかもねむ", "color": "b", "index": 15},
    {"first_half": "このたびは　ぬさもとりあへず　たむけやま", "second_half": "もみぢのにしき　かみのまにまに", "color": "b", "index": 16},
    {"first_half": "よをこめて　とりのそらねは　はかるとも", "second_half": "よにあふさかの　せきはゆるさじ", "color": "b", "index": 17},
    {"first_half": "ももしきや　ふるきのきばの　しのぶにも", "second_half": "なほあまりある　むかしなりけり", "color": "b", "index": 18},
    {"first_half": "ちぎりおきし　させもがつゆを　いのちにて", "second_half": "あはれことしの　あきもいぬめり", "color": "b", "index": 19},
    {"first_half": "おもひわび　さてもいのちは　あるものを", "second_half": "うきにたへぬは　なみだなりけり", "color": "b", "index": 20}
];

const orangePoems = [
    {"first_half": "あけぬれば　くるるものとは　しりながら", "second_half": "なほうらめしき　あさぼらけかな", "color": "o", "index": 1},
    {"first_half": "あさぼらけ　うぢのかはぎり　たえだえに", "second_half": "あらはれわたる　せぜのあじろぎ", "color": "o", "index": 2},
    {"first_half": "あはれとも　いふべきひとは　おもほえで", "second_half": "みのいたづらに　なりぬべきかな", "color": "o", "index": 3},
    {"first_half": "あひみての　のちのこころに　くらぶれば", "second_half": "むかしはものを　おもはざりけり", "color": "o", "index": 4},
    {"first_half": "あふことの　たえてしなくは　なかなかに", "second_half": "ひとをもみをも　うらみざらまし", "color": "o", "index": 5},
    {"first_half": "あらざらむ　このよのほかの　おもひでに", "second_half": "いまひとたびの　あふこともがな", "color": "o", "index": 6},
    {"first_half": "いまこむと　いひしばかりに　ながつきの", "second_half": "ありあけのつきを　まちいでつるかな", "color": "o", "index": 7},
    {"first_half": "いまはただ　おもひたえなむ　とばかりを", "second_half": "ひとづてならで　いふよしもがな", "color": "o", "index": 8},
    {"first_half": "せをはやみ　いはにせかるる　たきがはの", "second_half": "われてもすゑに　あはむとぞおもふ", "color": "o", "index": 9},
    {"first_half": "なげきつつ　ひとりぬるよの　あくるまは", "second_half": "いかにひさしき　ものとかはしる", "color": "o", "index": 10},
    {"first_half": "なにしおはば　あふさかやまの　さねかづら", "second_half": "ひとにしられで　くるよしもがな", "color": "o", "index": 11},
    {"first_half": "なにはえの　あしのかりねの　ひとよゆゑ", "second_half": "みをつくしてや　こひわたるべき", "color": "o", "index": 12},
    {"first_half": "なにはがた　みじかきあしの　ふしのまも", "second_half": "あはでこのよを　すぐしてよとや", "color": "o", "index": 13},
    {"first_half": "はるのよの　ゆめばかりなる　たまくらに", "second_half": "かひなくたたむ　なこそをしけれ", "color": "o", "index": 14},
    {"first_half": "ひともをし　ひともうらめし　あぢきなく", "second_half": "よをおもふゆゑに　ものおもふみは", "color": "o", "index": 15},
    {"first_half": "みかきもり　ゑじのたくひの　よるはもえ", "second_half": "ひるはきえつつ　ものをこそおもへ", "color": "o", "index": 16},
    {"first_half": "みかのはら　わきてながるる　いづみがは", "second_half": "いつみきとてか　こひしかるらむ", "color": "o", "index": 17},
    {"first_half": "みせばやな　をじまのあまの　そでだにも", "second_half": "ぬれにぞぬれし　いろはかはらず", "color": "o", "index": 18},
    {"first_half": "おほけなく　うきよのたみに　おほふかな", "second_half": "わがたつそまに　すみぞめのそで", "color": "o", "index": 19},
    {"first_half": "かぜそよぐ　ならのをがはの　ゆふぐれは", "second_half": "みそぎぞなつの　しるしなりける", "color": "o", "index": 20}
];
/**
 * 1. 数据准备与初始化
 */

// 建立假名 -> 标准索引(1-100) 的快速查找 Map
const kanaToStandardMap = new Map();
hyakuninIsshu.forEach((poem, idx) => {
    // 将假名去除空格作为 Key，存入标准歌番号 (索引+1)
    const key = (poem.first_half + poem.second_half).replace(/[\s　]/g, "");
    kanaToStandardMap.set(key, idx + 1);
});

// 合并五组数据：保留原始组内 index，注入标准歌番号 standardNumber
const mainData = [
    ...redPoems.map(p => ({...p, color: 'red'})),
    ...yellowPoems.map(p => ({...p, color: 'yellow'})),
    ...greenPoems.map(p => ({...p, color: 'green'})),
    ...bluePoems.map(p => ({...p, color: 'blue'})),
    ...orangePoems.map(p => ({...p, color: 'orange'}))
].map(poem => {
    const searchKey = (poem.first_half + poem.second_half).replace(/[\s　]/g, "");
    // 获取标准歌番号，如果没搜到则默认为 999
    const stdNum = kanaToStandardMap.get(searchKey) || 999;
    if (stdNum == 999) {
        console.log("lmao dumbass")
        console.log(searchKey)
    }

    return {
        ...poem,
        index: poem.index,       // 保留原始各组内的 No.1-20
        standardNumber: stdNum   // 新增：标准歌番号 1-100
    };
});

// 五色对应的日语组名映射
const colorNamesJP = {
    'red': '赤グループ',
    'blue': '青グループ',
    'yellow': '黄グループ',
    'green': '緑グループ',
    'orange': '橙グループ'
};
    
/**
 * 竞技百人一首标准标准化函数 (历史假名遣听感化)
 */
const normalizeTopHalf = (str) => {
    if (!str) return "";

    // 1. 基础替换：将“を”统一为“お”
    let n = str.replace(/を/g, "お");

    // 2. 特殊映射：处理 No.44「あふ」以及其他可能产生的长音/音变冲突
    // 将“あふ”映射为“おお”，确保在前两个音节与“お”系产生硬冲突
    if (n.startsWith("あふ")) {
        n = "おお" + n.substring(2);
    }

    // 3. 处理历史假名遣中的“ハ行转呼” (词中词尾音变)
    // 规则：从第2位开始，は→わ、ひ→い、ふ→う、へ→え、ほ→お
    if (n.length > 1) {
        let chars = n.split('');
        for (let i = 1; i < chars.length; i++) {
            switch (chars[i]) {
                case 'は': chars[i] = 'わ'; break;
                case 'ひ': chars[i] = 'い'; break;
                case 'ふ': chars[i] = 'う'; break;
                case 'へ': chars[i] = 'え'; break;
                case 'ほ': chars[i] = 'お'; break;
                // 补充：ゐ(Wi) -> い(I), ゑ(We) -> え(E)
                case 'ゐ': chars[i] = 'い'; break;
                case 'ゑ': chars[i] = 'え'; break;
            }
        }
        n = chars.join('');
    }

    // 4. 处理听感上的“长音化” (可选，根据竞技严谨度决定)
    // 比如“あき(Aki)”与“あぎ(Agi)”在极速下也可能产生判定延迟
    // 但百人一首主要解决的是假名遣冲突。
    
    return n;
};

/**
 * 修改后的计算决定字算法
 * 上半句：将 を/お 视为一致进行唯一性判定
 * 下半句：保持精确匹配，不进行字符转换
 */
function calculateKimariji(poems) {
    const map = new Map();

    // 预计算所有诗句的标准化版本，避免在循环中重复计算，提升性能
    const normalizedList = poems.map(p => ({
        original: p,
        normFirst: normalizeTopHalf(p.first_half),
        fullKey: p.first_half + p.second_half
    }));

    normalizedList.forEach(item => {
        let kimarijiFirst = "";
        const targetNorm = item.normFirst;

        // --- 上句决定字计算 ---
        for (let i = 1; i <= item.original.first_half.length; i++) {
            // 关键：决定字字数是基于“标准化的听感长度”
            const prefix = targetNorm.substring(0, i);

            const isUnique = normalizedList.every(other => {
                if (other === item) return true;
                return !other.normFirst.startsWith(prefix);
            });

            if (isUnique) {
                // 注意：这里存储的还是原始字符的截取，但长度由标准化的 i 决定
                // 比如 あふこ (3字)
                kimarijiFirst = item.original.first_half.substring(0, i);
                map.set(item.fullKey, { kimarijiFirstHalf: kimarijiFirst });
                break;
            }
        }

        // --- 下句决定字计算 (保持精确匹配) ---
        // ... 原有逻辑无误 ...
        let uniquePrefixSecond = "";
        for (let i = 1; i <= item.original.second_half.length; i++) {
            uniquePrefixSecond = item.original.second_half.substring(0, i);
            const isUnique = poems.every(p => {
                if (p.first_half + p.second_half === item.fullKey) return true;
                return !p.second_half.startsWith(uniquePrefixSecond);
            });
            if (isUnique) {
                const existing = map.get(item.fullKey) || {};
                map.set(item.fullKey, { ...existing, kimarijiSecondHalf: uniquePrefixSecond });
                break;
            }
        }
    });
    return map;
}

const kimarijiMap = calculateKimariji(mainData);
const poemListContainer = document.querySelector('.poem-list');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const searchCount = document.getElementById('searchCount');

/**
 * 2. UI 生成与高亮
 */
function highlightKimariji(text, kimariji, additionalClass = '') {
    if (!kimariji) return text;
    const prefix = kimariji.slice(0, -1);
    const lastChar = kimariji.slice(-1);
    return text.replace(kimariji,
        `<span class="kimariji-highlight ${additionalClass}" data-kimariji="${kimariji}">${prefix}<span class="last-char">${lastChar}</span></span>`
    );
}

function createPoemElement(poem, focusTopHalf, isSource = false) {
    const poemItem = document.createElement('div');
    const colorClass = poem.color || 'default';
    poemItem.className = `poem-item color-${colorClass} ${isSource ? 'source-item' : ''}`;

    // 只有在主列表中才需要 ID 用于跳转定位
    if (!isSource && focusTopHalf === null) {
        poemItem.id = `poem-${poem.color}-${poem.index}`;
    }

    poemItem.dataset.poemJson = JSON.stringify(poem);
    const kData = kimarijiMap.get(poem.first_half + poem.second_half);

    poemItem.innerHTML = `
        <div class="poem-meta" style="cursor: pointer;">${poem.index}</div>
        <div class="poem-content">
            <div class="half-line left ${focusTopHalf === true ? 'focus-half' : ''}">
                ${highlightKimariji(poem.first_half, kData?.kimarijiFirstHalf, "left")}
            </div>
            <div class="half-line right ${focusTopHalf === false ? 'focus-half' : ''}">
                ${highlightKimariji(poem.second_half, kData?.kimarijiSecondHalf, "right")}
            </div>
        </div>
    `;
    return poemItem;
}

/**
 * 3. 渲染、排序与搜索
 */
function renderPoems(poems) {
    if (!poemListContainer) return;
    poemListContainer.innerHTML = '';
    poems.forEach(p => poemListContainer.appendChild(createPoemElement(p, null)));
}

function getSortedPoems(sortType) {
    const poems = [...mainData];
    switch (sortType) {
        case 'fiveColors': return mainData; // 保持合并时的五色顺序
        case 'kanaFirst': return poems.sort((a, b) => a.first_half.localeCompare(b.first_half, 'ja'));
        case 'kanaSecond': return poems.sort((a, b) => a.second_half.localeCompare(b.second_half, 'ja'));
        case 'default': 
            // 标准排序：利用我们建立的 kanaToIndexMap 找到它在 100 首里的原始索引
            return poems.sort((a, b) => {
                const idxA = kanaToIndexMap.get((a.first_half + a.second_half).replace(/[\s　]/g, ""));
                const idxB = kanaToIndexMap.get((b.first_half + b.second_half).replace(/[\s　]/g, ""));
                return idxA - idxB;
            });
        case 'kimarijiFirst': return sortByKimariji(poems, 'first');
        case 'kimarijiSecond': return sortByKimariji(poems, 'second');
        default: return poems;
    }
}

function sortByKimariji(poems, half) {
    return poems.sort((a, b) => {
        const kA = kimarijiMap.get(a.first_half + a.second_half);
        const kB = kimarijiMap.get(b.first_half + b.second_half);
        const lenA = (half === 'first' ? kA?.kimarijiFirstHalf : kA?.kimarijiSecondHalf)?.length || 99;
        const lenB = (half === 'first' ? kB?.kimarijiFirstHalf : kB?.kimarijiSecondHalf)?.length || 99;
        if (lenA !== lenB) return lenA - lenB;
        return (half === 'first' ? a.first_half : a.second_half).localeCompare((half === 'first' ? b.first_half : b.second_half), 'ja');
    });
}

function executeSearch(term) {
    const results = [];
    const lowerTerm = term.toLowerCase();

    mainData.forEach(poem => {
        const kData = kimarijiMap.get(poem.first_half + poem.second_half);
        let score = 0;
        let matchPart = null; // 用于记录匹配位置，增强 UI 反馈

        // 1. 优先级最高：上半句决定字匹配 (Score: 1000)
        if (kData?.kimarijiFirstHalf?.startsWith(lowerTerm)) {
            score = 1000;
            matchPart = 'top';
        } 
        // 2. 优先级第二：下半句决定字匹配 (Score: 500)
        else if (kData?.kimarijiSecondHalf?.startsWith(lowerTerm)) {
            score = 500;
            matchPart = 'bottom';
        }
        // 3. 优先级第三：普通开头匹配 (Score: 100)
        else if (poem.first_half.startsWith(lowerTerm)) {
            score = 100;
            matchPart = 'top';
        }
        else if (poem.second_half.startsWith(lowerTerm)) {
            score = 100;
            matchPart = 'bottom';
        }
        // 4. 优先级最低：包含匹配或编号匹配 (Score: 10)
        else if (poem.first_half.includes(lowerTerm) || 
                 poem.second_half.includes(lowerTerm) || 
                 String(poem.index) === lowerTerm) {
            score = 10;
        }

        if (score > 0) {
            results.push({ 
                ...poem, 
                searchScore: score, 
                suggestedFocus: matchPart 
            });
        }
    });

    // 排序：分数高的在前；分数相同时按编号排
    results.sort((a, b) => {
        if (b.searchScore !== a.searchScore) return b.searchScore - a.searchScore;
        return a.index - b.index;
    });

    renderSearchFiltered(results);
    searchCount.textContent = `${results.length} 首が一致`;
}

function renderSearchFiltered(poems) {
    if (!poemListContainer) return;
    poemListContainer.innerHTML = '';
    
    poems.forEach(p => {
        // 根据匹配位置动态设置 focusTopHalf
        // 如果是 top 匹配，传入 true；bottom 匹配，传入 false；否则 null
        const focus = p.suggestedFocus === 'top' ? true : (p.suggestedFocus === 'bottom' ? false : null);
        poemListContainer.appendChild(createPoemElement(p, focus));
    });
}

/**
 * 4. 弹窗显示逻辑 (汉字卡片 & 相似词)
 */

// 显示汉字卡片
function showKanjiCardPopup(poem) {
    const popup = document.getElementById('kimarijiPopup');
    const kanjiContainer = document.getElementById('kanjiCardContent');
    const similarContainer = document.getElementById('similarListContent');

    // 直接从 poem 对象中读取已经注入好的 standardNumber
    const standardNumber = poem.standardNumber || '??';
    
    // 既然 standardNumber 是 1-100，索引就是 -1
    const standardIdx = (typeof standardNumber === 'number' && standardNumber !== 999) 
                        ? standardNumber - 1 
                        : undefined;

    let kanjiData = { first_half: '---', second_half: '---' };
    if (standardIdx !== undefined && typeof hyakuninIsshuKanji !== 'undefined') {
        kanjiData = hyakuninIsshuKanji[standardIdx];
    }

    const kData = kimarijiMap.get(poem.first_half + poem.second_half);
    const groupName = colorNamesJP[poem.color] || '';

    kanjiContainer.style.display = 'block';
    similarContainer.style.display = 'none';

    // D. 渲染界面：显示双番号
    kanjiContainer.innerHTML = `
        <div class="kanji-display-card">
            <div class="kanji-card-header">
                <div class="badge-row">
                    <span class="group-badge color-${poem.color}">${groupName} No.${poem.index}</span>
                    <span class="standard-badge">歌番号 ${standardNumber}</span>
                </div>
            </div>
            <div class="kanji-card-body">
                <div class="kanji-row">
                    <span class="part-label">【上の句】</span>
                    <p class="kana-text">${highlightKimariji(poem.first_half, kData?.kimarijiFirstHalf, "left")}</p>
                    <h2 class="kanji-text">${kanjiData.first_half}</h2>
                </div>
                
                <div class="kanji-divider-line"></div>
                
                <div class="kanji-row">
                    <span class="part-label">【下の句】</span>
                    <p class="kana-text">${highlightKimariji(poem.second_half, kData?.kimarijiSecondHalf, "right")}</p>
                    <h2 class="kanji-text">${kanjiData.second_half}</h2>
                </div>
            </div>
        </div>
    `;

    popup.classList.add('show');
    popup.style.display = 'flex';
    document.body.classList.add('modal-open');
}

// 显示相似列表
function showKimarijiPopup(similarPoems, isTopHalf, sourcePoem) {
    const popup = document.getElementById('kimarijiPopup');
    const kanjiContainer = document.getElementById('kanjiCardContent');
    const similarContainer = document.getElementById('similarListContent');
    const list = document.getElementById('kimarijiPoemsList');

    kanjiContainer.style.display = 'none';
    similarContainer.style.display = 'block';

    list.innerHTML = '<h3>検索の起点:</h3>';
    list.appendChild(createPoemElement(sourcePoem, isTopHalf, true));
    list.innerHTML += '<hr><h3>類似の歌:</h3>';

    if (similarPoems.length === 0) {
        list.innerHTML += `<div class="no-poems-message">類似の歌は見つかりませんでした。</div>`;
    } else {
        similarPoems.forEach(p => list.appendChild(createPoemElement(p, isTopHalf, false)));
    }

    popup.classList.add('show');
    popup.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function closePopup() {
    const popup = document.getElementById('kimarijiPopup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => { popup.style.display = 'none'; }, 300);
        document.body.classList.remove('modal-open');
    }
}

/**
 * 5. 全局事件监听
 */
document.addEventListener('click', (event) => {
    // 逻辑 A: 点击决定字高亮 (查相似)
    const highlightSpan = event.target.closest('.kimariji-highlight');
    if (highlightSpan) {
        const clickedKimariji = highlightSpan.dataset.kimariji;
        const isTopHalf = highlightSpan.classList.contains('left'); // 判断是否点击的上半句
        const parent = highlightSpan.closest('.poem-item');
        const source = JSON.parse(parent.dataset.poemJson);
        
        const similar = mainData.filter(p => {
            // 排除掉自身
            if (p.first_half === source.first_half && p.second_half === source.second_half) return false;
            
            const pData = kimarijiMap.get(p.first_half + p.second_half);
            const targetRaw = isTopHalf ? pData?.kimarijiFirstHalf : pData?.kimarijiSecondHalf;
            if (!targetRaw) return false;

            if (isTopHalf) {
                // --- 上半句：应用 を/お 等价逻辑 ---
                const normClicked = normalizeTopHalf(clickedKimariji);
                const normPrefix = normClicked.slice(0, -1);
                const normTarget = normalizeTopHalf(targetRaw);

                if (normPrefix === "") { // 处理一字决情况
                    return normTarget.length === 1 && normTarget === normClicked;
                }
                return normTarget.startsWith(normPrefix);
            } else {
                // --- 下半句：保留原始精确匹配逻辑 ---
                const prefix = clickedKimariji.slice(0, -1);
                if (prefix === "") {
                    return targetRaw.length === 1 && targetRaw === clickedKimariji;
                }
                return targetRaw.startsWith(prefix);
            }
        });

        showKimarijiPopup(similar, isTopHalf, source);
        return;
    }

    // 逻辑 B: 点击编号 (区分位置)
    const metaElement = event.target.closest('.poem-meta');
    if (metaElement) {
        const parentItem = metaElement.closest('.poem-item');
        const poemData = JSON.parse(parentItem.dataset.poemJson);
        const isInPopup = metaElement.closest('#kimarijiPopup');

        if (isInPopup) {
            handleJumpToMain(poemData); // 弹窗内点数字：回主页
        } else {
            showKanjiCardPopup(poemData); // 主页点数字：看汉字
        }
    }

    // 逻辑 C: 点击遮罩层关闭
    if (event.target.id === 'kimarijiPopup') closePopup();
});

// 跳转与动画逻辑
function handleJumpToMain(poemData) {
    if (searchInput.value !== "") {
        searchInput.value = "";
        searchCount.textContent = "";
        renderPoems(getSortedPoems(sortSelect.value));
    }
    const targetId = `poem-${poemData.color}-${poemData.index}`;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        closePopup();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        playRefinedAnimation(targetElement);
    }
}

function playRefinedAnimation(el) {
    el.style.transition = "none";
    el.style.zIndex = "9999";
    void el.offsetWidth;
    el.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    el.style.outline = "6px solid #f1c40f";
    el.style.outlineOffset = "12px";
    el.style.boxShadow = "0 0 40px rgba(241, 196, 15, 0.8)";
    el.style.transform = "scale(1.03)";
    setTimeout(() => {
        el.style.transition = "all 0.8s ease-out";
        el.style.outline = "0px solid transparent";
        el.style.boxShadow = "none";
        el.style.transform = "scale(1)";
        setTimeout(() => { el.style.zIndex = ""; }, 800);
    }, 700);
}

/**
 * 6. 初始绑定
 */
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => renderPoems(getSortedPoems(e.target.value)));
}
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        if (term === "") {
            renderPoems(getSortedPoems(sortSelect.value));
            searchCount.textContent = "";
        } else {
            executeSearch(term);
        }
    });
}
const popupClose = document.getElementById('kimarijiClose');
if (popupClose) popupClose.onclick = closePopup;

const closeGuideBtn = document.getElementById('closeGuide');
if (closeGuideBtn) {
    closeGuideBtn.onclick = () => { document.getElementById('guidePanel').style.display = 'none'; };
}

renderPoems(mainData);