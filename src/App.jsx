import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";

/* ================= 多言語（i18n） ================= */
const LANGS = [
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "en", label: "English" },
];

const T = {
  ja: {
    selectLang: "言語をえらぶ",
    tagline: "じぶんのプロフィールを\nかわいく きろくしよう",
    googleLogin: "Googleでログイン",
    guestUse: "ログインせずに使ってみる",
    guestNote: "※ ログインしない場合はこの端末内だけに保存され、\nアプリを削除するとデータも消えます",
    gAccountTitle: "アカウントの選択",
    gMoveTo: "「view me」に移動",
    gUserName: "view me ユーザー",
    gSubName: "サブアカウント",
    gOther: "別のアカウントを使用",
    gShare: "続行すると、Google はあなたの名前・メールアドレス・プロフィール写真を view me と共有します。",
    cancel: "キャンセル",
    demoNote: "※ これはデモ画面です（実際のGoogle認証ではありません）",
    step: "step 1 / 1",
    setupTitle: "プロフィールせってい",
    guestBanner: "ゲストモード：データはこの端末内のみに保存されます",
    pickIcon: "タップでアイコンをえらぶ",
    name: "name",
    id: "id",
    start: "はじめる ✧",
    posts: "投稿",
    followers: "フォロワー",
    following: "フォロー中",
    addBio: "＋ 自己紹介を追加",
    add: "＋ 追加",
    editProfile: "プロフィールを編集",
    addPhoto: "写真を追加",
    newHl: "新規",
    noPhotos: "まだ写真がありません",
    tapFirst: "タップして最初の1枚を追加しよう",
    hintNormal: "タイルを長押し（PCはクリック）でメニューを表示",
    hintReorder: "ドラッグで順番を入れ替え、終わったら「完了」",
    reorderBar: "ドラッグして並べ替え",
    done: "完了",
    profileName: "名前",
    username: "ユーザーネーム",
    bio: "自己紹介",
    musicTitle: "曲名",
    musicArtist: "アーティスト",
    changeIcon: "アイコンを変更",
    save: "保存",
    newHighlight: "新規ハイライト",
    editHighlight: "ハイライトを編集",
    pickCover: "タップでカバー画像を選択",
    hlName: "名前（絵文字もOK）",
    deleteHl: "このハイライトを削除",
    reorderDrag: "↕︎　並べ替え（ドラッグ）",
    changeImage: "画像を変更",
    del: "削除",
    cropDrag: "ドラッグで位置調整・ピンチ/スライダーで拡大",
    cropAvatar: "アイコンを切り抜き（1:1）",
    cropCover: "カバーを切り抜き（1:1）",
    crop34: "切り抜き（3:4）",
    about: "About",
    close: "閉じる",
    aboutApp: "about",
    thanks: "お使いいただきありがとうございます",
    feedback: "ご意見ご要望があれば教えてくださると\nほんとうにうれしいです",
    contact: "お問い合わせ",
    contactDesc: "不具合報告・ご意見ご要望をください",
    review: "★ レビューで応援する",
    reviewDesc: "よろしければ App Store のレビューを。励みになります",
    icloud: "☁︎ データを iCloud に同期",
    icloudOn: "同期がオンになっています",
    icloudOff: "別の端末でも同じデータを使えます",
    otherApps: "other apps",
    comingSoon: "（後々追加します）",
    createdBy: "created by",
  },
  ko: {
    selectLang: "언어 선택",
    tagline: "나만의 프로필을\n예쁘게 기록해요",
    googleLogin: "Google로 로그인",
    guestUse: "로그인 없이 사용해보기",
    guestNote: "※ 로그인하지 않으면 이 기기에만 저장되며,\n앱을 삭제하면 데이터도 사라집니다",
    gAccountTitle: "계정 선택",
    gMoveTo: "‘view me’(으)로 이동",
    gUserName: "view me 사용자",
    gSubName: "보조 계정",
    gOther: "다른 계정 사용",
    gShare: "계속하면 Google이 이름·이메일·프로필 사진을 view me와 공유합니다.",
    cancel: "취소",
    demoNote: "※ 데모 화면입니다 (실제 Google 인증 아님)",
    step: "step 1 / 1",
    setupTitle: "프로필 설정",
    guestBanner: "게스트 모드: 데이터는 이 기기에만 저장됩니다",
    pickIcon: "탭하여 아이콘 선택",
    name: "name",
    id: "id",
    start: "시작하기 ✧",
    posts: "게시물",
    followers: "팔로워",
    following: "팔로잉",
    addBio: "＋ 소개 추가",
    add: "＋ 추가",
    editProfile: "프로필 편집",
    addPhoto: "사진 추가",
    newHl: "신규",
    noPhotos: "아직 사진이 없어요",
    tapFirst: "탭하여 첫 사진을 추가해보세요",
    hintNormal: "타일을 길게 눌러(PC는 클릭) 메뉴 열기",
    hintReorder: "드래그로 순서 변경, 끝나면 ‘완료’",
    reorderBar: "드래그하여 순서 변경",
    done: "완료",
    profileName: "이름",
    username: "사용자 이름",
    bio: "소개",
    musicTitle: "곡명",
    musicArtist: "아티스트",
    changeIcon: "아이콘 변경",
    save: "저장",
    newHighlight: "새 하이라이트",
    editHighlight: "하이라이트 편집",
    pickCover: "탭하여 커버 이미지 선택",
    hlName: "이름 (이모지 가능)",
    deleteHl: "이 하이라이트 삭제",
    reorderDrag: "↕︎　순서 변경 (드래그)",
    changeImage: "이미지 변경",
    del: "삭제",
    cropDrag: "드래그로 위치 조정 · 핀치/슬라이더로 확대",
    cropAvatar: "아이콘 자르기 (1:1)",
    cropCover: "커버 자르기 (1:1)",
    crop34: "자르기 (3:4)",
    about: "About",
    close: "닫기",
    aboutApp: "about",
    thanks: "이용해 주셔서 감사합니다",
    feedback: "의견이나 요청이 있으면 알려주시면\n정말 기쁩니다",
    contact: "문의하기",
    contactDesc: "버그 신고·의견·요청을 보내주세요",
    review: "★ 리뷰로 응원하기",
    reviewDesc: "괜찮으시면 App Store 리뷰를. 큰 힘이 됩니다",
    icloud: "☁︎ 데이터를 iCloud에 동기화",
    icloudOn: "동기화가 켜져 있습니다",
    icloudOff: "다른 기기에서도 같은 데이터를 사용할 수 있어요",
    otherApps: "other apps",
    comingSoon: "(추후 추가 예정)",
    createdBy: "created by",
  },
  zh: {
    selectLang: "选择语言",
    tagline: "把自己的主页\n可爱地记录下来",
    googleLogin: "使用 Google 登录",
    guestUse: "不登录直接体验",
    guestNote: "※ 不登录时数据仅保存在本机，\n删除应用后数据也会消失",
    gAccountTitle: "选择账号",
    gMoveTo: "前往“view me”",
    gUserName: "view me 用户",
    gSubName: "子账号",
    gOther: "使用其他账号",
    gShare: "继续即表示 Google 会将你的姓名、邮箱和头像共享给 view me。",
    cancel: "取消",
    demoNote: "※ 这是演示画面（并非真实的 Google 认证）",
    step: "step 1 / 1",
    setupTitle: "个人资料设置",
    guestBanner: "访客模式：数据仅保存在本机",
    pickIcon: "点击选择头像",
    name: "name",
    id: "id",
    start: "开始 ✧",
    posts: "帖子",
    followers: "粉丝",
    following: "关注",
    addBio: "＋ 添加简介",
    add: "＋ 添加",
    editProfile: "编辑资料",
    addPhoto: "添加照片",
    newHl: "新建",
    noPhotos: "还没有照片",
    tapFirst: "点击添加第一张照片吧",
    hintNormal: "长按方块（电脑点击）显示菜单",
    hintReorder: "拖动调整顺序，完成后点“完成”",
    reorderBar: "拖动以排序",
    done: "完成",
    profileName: "名称",
    username: "用户名",
    bio: "简介",
    musicTitle: "歌曲名",
    musicArtist: "艺人",
    changeIcon: "更换头像",
    save: "保存",
    newHighlight: "新建精选",
    editHighlight: "编辑精选",
    pickCover: "点击选择封面图片",
    hlName: "名称（可用表情）",
    deleteHl: "删除此精选",
    reorderDrag: "↕︎　排序（拖动）",
    changeImage: "更换图片",
    del: "删除",
    cropDrag: "拖动调整位置 · 双指/滑块缩放",
    cropAvatar: "裁剪头像（1:1）",
    cropCover: "裁剪封面（1:1）",
    crop34: "裁剪（3:4）",
    about: "About",
    close: "关闭",
    aboutApp: "about",
    thanks: "感谢你的使用",
    feedback: "如果有任何意见或建议\n告诉我会非常开心",
    contact: "联系我们",
    contactDesc: "欢迎反馈 Bug、意见和建议",
    review: "★ 用评价来支持",
    reviewDesc: "方便的话请在 App Store 留个评价，是我的动力",
    icloud: "☁︎ 将数据同步到 iCloud",
    icloudOn: "同步已开启",
    icloudOff: "在其他设备上也能使用相同数据",
    otherApps: "other apps",
    comingSoon: "（之后会添加）",
    createdBy: "created by",
  },
  en: {
    selectLang: "Select language",
    tagline: "Keep your own profile\ncute and personal",
    googleLogin: "Sign in with Google",
    guestUse: "Try without signing in",
    guestNote: "※ Without signing in, data is saved only on this device\nand will be lost if the app is deleted",
    gAccountTitle: "Choose an account",
    gMoveTo: "to continue to “view me”",
    gUserName: "view me user",
    gSubName: "Secondary account",
    gOther: "Use another account",
    gShare: "To continue, Google will share your name, email address, and profile picture with view me.",
    cancel: "Cancel",
    demoNote: "※ This is a demo screen (not real Google auth)",
    step: "step 1 / 1",
    setupTitle: "Profile setup",
    guestBanner: "Guest mode: data is stored only on this device",
    pickIcon: "Tap to choose an icon",
    name: "name",
    id: "id",
    start: "Get started ✧",
    posts: "Posts",
    followers: "Followers",
    following: "Following",
    addBio: "＋ Add bio",
    add: "＋ Add",
    editProfile: "Edit profile",
    addPhoto: "Add photo",
    newHl: "New",
    noPhotos: "No photos yet",
    tapFirst: "Tap to add your first photo",
    hintNormal: "Long-press a tile (click on PC) for the menu",
    hintReorder: "Drag to reorder, then tap “Done”",
    reorderBar: "Drag to reorder",
    done: "Done",
    profileName: "Name",
    username: "Username",
    bio: "Bio",
    musicTitle: "Track",
    musicArtist: "Artist",
    changeIcon: "Change icon",
    save: "Save",
    newHighlight: "New highlight",
    editHighlight: "Edit highlight",
    pickCover: "Tap to choose a cover image",
    hlName: "Name (emoji OK)",
    deleteHl: "Delete this highlight",
    reorderDrag: "↕︎　Reorder (drag)",
    changeImage: "Change image",
    del: "Delete",
    cropDrag: "Drag to position · pinch/slider to zoom",
    cropAvatar: "Crop icon (1:1)",
    cropCover: "Crop cover (1:1)",
    crop34: "Crop (3:4)",
    about: "About",
    close: "Close",
    aboutApp: "about",
    thanks: "Thank you for using view me",
    feedback: "If you have any thoughts or requests,\nI'd be truly happy to hear them",
    contact: "Contact",
    contactDesc: "Send bug reports, thoughts and requests",
    review: "★ Support with a review",
    reviewDesc: "A review on the App Store would mean a lot",
    icloud: "☁︎ Sync data to iCloud",
    icloudOn: "Sync is on",
    icloudOff: "Use the same data on other devices",
    otherApps: "other apps",
    comingSoon: "(coming later)",
    createdBy: "created by",
  },
};

const LangContext = createContext("ja");
function useT() {
  const lang = useContext(LangContext);
  return (key) => (T[lang] && T[lang][key]) || T.ja[key] || key;
}

/* ================= アイコン ================= */
const I = {
  plus: (s = 26) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  chevron: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  threads: () => null,
  burger: (s = 26) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  play: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  ),
  addPerson: (s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="8" r="3.5" />
      <path d="M3.5 20c.7-3.2 3.4-5 6.5-5s5.8 1.8 6.5 5" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  ),
  grid: (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="3.5" width="4.6" height="4.6" rx="0.6" /><rect x="9.7" y="3.5" width="4.6" height="4.6" rx="0.6" /><rect x="15.9" y="3.5" width="4.6" height="4.6" rx="0.6" />
      <rect x="3.5" y="9.7" width="4.6" height="4.6" rx="0.6" /><rect x="9.7" y="9.7" width="4.6" height="4.6" rx="0.6" /><rect x="15.9" y="9.7" width="4.6" height="4.6" rx="0.6" />
      <rect x="3.5" y="15.9" width="4.6" height="4.6" rx="0.6" /><rect x="9.7" y="15.9" width="4.6" height="4.6" rx="0.6" /><rect x="15.9" y="15.9" width="4.6" height="4.6" rx="0.6" />
    </svg>
  ),
  reels: (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="M3.5 8.5h17M8 3.5l3 5M14 3.5l3 5" />
      <path d="M10.5 12.2l4.5 2.8-4.5 2.8v-5.6z" fill="currentColor" stroke="none" />
    </svg>
  ),
  repost: (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2.5l3.5 3.5L17 9.5" />
      <path d="M20.5 6H8.5C5.5 6 3.5 8 3.5 11" />
      <path d="M7 21.5L3.5 18 7 14.5" />
      <path d="M3.5 18h12c3 0 5-2 5-5" />
    </svg>
  ),
  tagged: (s = 24) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M4 21v-1.5C4 16 7 14 12 14s8 2 8 5.5V21" />
      <circle cx="12" cy="8" r="3.6" />
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" />
    </svg>
  ),
  camera: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7.5h2.5L8.5 5h7l2 2.5H20a1.5 1.5 0 011.5 1.5v10A1.5 1.5 0 0120 20.5H4A1.5 1.5 0 012.5 19V9A1.5 1.5 0 014 7.5z" />
      <circle cx="12" cy="13.5" r="3.6" />
    </svg>
  ),
};

/* ================= 初期状態（まっさら） ================= */
const initialProfile = {
  username: "",
  name: "",
  bio: "",
  musicTitle: "",
  musicArtist: "",
  avatar: null,
  followers: "0",
  following: "0",
};

/* ================= トリミングモーダル（アスペクト比指定可） ================= */
function CropModal({ src, aspect = 3 / 4, outW = 900, title = "切り抜き（3:4）", onCancel, onDone }) {
  const t = useT();
  const imgRef = useRef(null);
  const [frame, setFrame] = useState({ w: 300, h: 300 / aspect });
  const [nat, setNat] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map());
  const gesture = useRef(null);

  useEffect(() => {
    const w = Math.min(window.innerWidth - 48, 330);
    setFrame({ w, h: w / aspect });
  }, [aspect]);

  const minScale = nat ? Math.max(frame.w / nat.w, frame.h / nat.h) : 1;
  const scale = minScale * zoom;
  const dispW = nat ? nat.w * scale : 0;
  const dispH = nat ? nat.h * scale : 0;

  const clamp = useCallback(
    (x, y, z) => {
      if (!nat) return { x: 0, y: 0 };
      const s = minScale * z;
      const maxX = Math.max(0, (nat.w * s - frame.w) / 2);
      const maxY = Math.max(0, (nat.h * s - frame.h) / 2);
      return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
    },
    [nat, minScale, frame]
  );

  const onLoad = (e) => {
    setNat({ w: e.target.naturalWidth, h: e.target.naturalHeight });
    setZoom(1);
    setOff({ x: 0, y: 0 });
  };

  const down = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    if (pts.length === 1) {
      gesture.current = { mode: "pan", sx: e.clientX, sy: e.clientY, ox: off.x, oy: off.y };
    } else if (pts.length === 2) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      gesture.current = { mode: "pinch", d0: d, z0: zoom };
    }
  };
  const move = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    const pts = [...pointers.current.values()];
    if (g.mode === "pan" && pts.length === 1) {
      setOff(clamp(g.ox + (e.clientX - g.sx), g.oy + (e.clientY - g.sy), zoom));
    } else if (g.mode === "pinch" && pts.length === 2) {
      const d = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const z = Math.min(3, Math.max(1, (g.z0 * d) / g.d0));
      setZoom(z);
      setOff((o) => clamp(o.x, o.y, z));
    }
  };
  const up = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) gesture.current = null;
  };

  const changeZoom = (z) => {
    setZoom(z);
    setOff((o) => clamp(o.x, o.y, z));
  };

  const done = () => {
    if (!nat || !imgRef.current) return;
    const left = frame.w / 2 - dispW / 2 + off.x;
    const top = frame.h / 2 - dispH / 2 + off.y;
    const sx = -left / scale;
    const sy = -top / scale;
    const sw = frame.w / scale;
    const sh = frame.h / scale;
    const c = document.createElement("canvas");
    c.width = outW;
    c.height = Math.round(outW / aspect);
    c.getContext("2d").drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, c.width, c.height);
    onDone(c.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div className="crop-backdrop">
      <div className="crop-head">
        <button className="crop-btn" onClick={onCancel}>{t("cancel")}</button>
        <span className="crop-title">{title}</span>
        <button className="crop-btn done" onClick={done}>{t("done")}</button>
      </div>
      <div
        className={"crop-frame" + (aspect === 1 ? " round" : "")}
        style={{ width: frame.w, height: frame.h }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          onLoad={onLoad}
          style={{
            position: "absolute",
            width: dispW || "100%",
            height: dispH || undefined,
            left: frame.w / 2 - dispW / 2 + off.x,
            top: frame.h / 2 - dispH / 2 + off.y,
            maxWidth: "none",
            userSelect: "none",
            touchAction: "none",
          }}
        />
        <div className="crop-grid">
          <div /><div /><div /><div />
        </div>
      </div>
      <div className="crop-zoom">
        <span>－</span>
        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={zoom}
          onChange={(e) => changeZoom(parseFloat(e.target.value))}
        />
        <span>＋</span>
      </div>
      <p className="crop-hint">{t("cropDrag")}</p>
    </div>
  );
}

/* ================= プロフィール編集モーダル ================= */
function EditProfileModal({ profile, onClose, onSave, onPickAvatar }) {
  const t = useT();
  const [form, setForm] = useState(profile);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setNum = (k) => (e) => setForm({ ...form, [k]: e.target.value.replace(/[^0-9]/g, "") });

  useEffect(() => {
    setForm((f) => ({ ...f, avatar: profile.avatar }));
  }, [profile.avatar]);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-head">
          <button className="edit-cancel" onClick={onClose}>{t("cancel")}</button>
          <span className="edit-title">{t("editProfile")}</span>
          <button className="edit-done" onClick={() => onSave(form)}>{t("done")}</button>
        </div>

        <div className="edit-body">
          <div className="edit-ava-block">
            <div className="edit-ava">
              {form.avatar ? <img src={form.avatar} alt="" /> : <span className="ava-ph">＋</span>}
            </div>
            <button className="edit-ava-change" onClick={onPickAvatar}>
              {t("changeIcon")}
            </button>
          </div>

          <label className="field">
            <span>{t("profileName")}</span>
            <input value={form.name} onChange={set("name")} placeholder={t("profileName")} />
          </label>
          <label className="field">
            <span>{t("username")}</span>
            <input value={form.username} onChange={set("username")} placeholder={t("id")} />
          </label>
          <label className="field">
            <span>{t("bio")}</span>
            <textarea rows={3} value={form.bio} onChange={set("bio")} placeholder={t("bio")} />
          </label>
          <div className="field-pair">
            <label className="field">
              <span>{t("followers")}</span>
              <input inputMode="numeric" value={form.followers} onChange={setNum("followers")} placeholder="0" />
            </label>
            <label className="field">
              <span>{t("following")}</span>
              <input inputMode="numeric" value={form.following} onChange={setNum("following")} placeholder="0" />
            </label>
          </div>
          <label className="field">
            <span>{t("musicTitle")}</span>
            <input value={form.musicTitle} onChange={set("musicTitle")} placeholder={t("musicTitle")} />
          </label>
          <label className="field">
            <span>{t("musicArtist")}</span>
            <input value={form.musicArtist} onChange={set("musicArtist")} placeholder={t("musicArtist")} />
          </label>
        </div>
      </div>
    </div>
  );
}

/* ================= ハイライト編集モーダル ================= */
function HighlightEditModal({ value, isNew, onChange, onPickImage, onSave, onDelete, onClose }) {
  const t = useT();
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="edit-modal hl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-head">
          <button className="edit-cancel" onClick={onClose}>{t("cancel")}</button>
          <span className="edit-title">{isNew ? t("newHighlight") : t("editHighlight")}</span>
          <button className="edit-done" onClick={onSave}>{t("save")}</button>
        </div>
        <div className="edit-body hl-edit-body">
          <button className="hl-edit-circle" onClick={onPickImage}>
            {value.img ? <img src={value.img} alt="" /> : <span className="hl-edit-empty">＋</span>}
            <span className="hl-edit-cam">📷</span>
          </button>
          <p className="hl-edit-note">{t("pickCover")}</p>
          <label className="field">
            <span>{t("hlName")}</span>
            <input
              value={value.label}
              onChange={(e) => onChange({ ...value, label: e.target.value })}
              placeholder={t("profileName")}
              maxLength={12}
            />
          </label>
          {!isNew && (
            <button className="hl-delete" onClick={onDelete}>{t("deleteHl")}</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= About モーダル ================= */
function AboutModal({ appName, onClose }) {
  const t = useT();
  const [synced, setSynced] = useState(false);
  const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="edit-modal about-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-head">
          <span className="edit-cancel" style={{ visibility: "hidden" }}>{t("close")}</span>
          <span className="edit-title">{t("about")}</span>
          <button className="edit-done" onClick={onClose}>{t("close")}</button>
        </div>

        <div className="edit-body about-body">
          <Ribbon />
          <h2 className="about-app">{t("aboutApp")} {appName}</h2>

          <p className="about-thanks">{t("thanks")}</p>
          <p className="about-sub">
            {t("feedback").split("\n").map((s, i) => <React.Fragment key={i}>{i > 0 && <br />}{s}</React.Fragment>)}
          </p>

          <button className="about-row" onClick={() => open("mailto:inuteddy12@example.com?subject=" + encodeURIComponent(appName + " " + t("contact")))}>
            <span className="ar-main">{t("contact")}</span>
            <span className="ar-desc">{t("contactDesc")}</span>
          </button>

          <button className="about-row" onClick={() => open("https://apps.apple.com/")}>
            <span className="ar-main">{t("review")}</span>
            <span className="ar-desc">{t("reviewDesc")}</span>
          </button>

          <button className={"about-row toggle" + (synced ? " on" : "")} onClick={() => setSynced((s) => !s)}>
            <span className="ar-main">{t("icloud")}</span>
            <span className="ar-desc">{synced ? t("icloudOn") : t("icloudOff")}</span>
            <span className="ar-switch"><i /></span>
          </button>

          <div className="about-section">
            <div className="about-section-title">{t("otherApps")}</div>
            <div className="other-empty">{t("comingSoon")}</div>
          </div>

          <button className="about-credit" onClick={() => open("https://x.com/inuteddy12")}>
            {t("createdBy")} <b>inu teddy</b> <span className="x-mark">𝕏</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= 背景の浮遊グラデーションブロブ ================= */
function Blobs() {
  return (
    <>
      <span className="blob b1" /><span className="blob b2" /><span className="blob b3" />
      <span className="blob b4" /><span className="blob b5" />
    </>
  );
}

/* ================= リボン（アスキーアート） ================= */
const RIBBON_ART = `⠀⠀⢠⣿⣿⣷⣶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣧⠀⠀⠀
⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣧⠀⠀
⠀⠈⠛⠿⠿⣿⣿⣿⣿⣿⣿⣧⣤⣤⣴⣿⣿⣿⣿⣿⣿⠿⠟⠋⠀⠀
⠀⠀⠀⠀⠀⣀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣀⠀⠀⠀⠀⠀
⠀⣀⣤⣶⣾⣿⣿⣿⣿⣿⣿⠟⠋⠀⠻⣿⣿⣿⣿⣿⣿⣿⣶⣦⣄⡀
⠘⠻⣿⣿⣿⣿⣿⡿⠟⠋⠀⠀⠀⠀⠀⠀⠙⠛⠿⢿⣿⣿⣿⣿⣿⡏
⠀⠀⠀⠙⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠿⣿⠃`;

function Ribbon() {
  return <pre className="ribbon" aria-label="ribbon">{RIBBON_ART}</pre>;
}

/* ================= 言語選択画面（最初の画面） ================= */
function LanguageScreen({ onPick }) {
  return (
    <div className="welcome">
      <Blobs />
      <div className="wl-card">
        <Ribbon />
        <h1 className="wl-logo">view me</h1>
        <p className="lang-title">Select language</p>
        <div className="lang-list">
          {LANGS.map((l) => (
            <button key={l.code} className="lang-btn" onClick={() => onPick(l.code)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= ログイン画面（最初の画面） ================= */
function LoginScreen({ onGoogle, onGuest }) {
  const t = useT();
  return (
    <div className="welcome">
      <Blobs />
      <div className="wl-card">
        <Ribbon />
        <h1 className="wl-logo">view me</h1>
        <p className="wl-sub">{t("tagline").split("\n").map((s, i) => <React.Fragment key={i}>{i > 0 && <br />}{s}</React.Fragment>)}</p>
        <div className="wl-dots"><span /><span /><span /></div>

        <button className="g-btn" onClick={onGoogle}>
          <span className="g-ico">{GoogleG}</span>
          <span>{t("googleLogin")}</span>
        </button>

        <button className="guest-btn" onClick={onGuest}>
          {t("guestUse")}
        </button>
        <p className="guest-note">
          {t("guestNote").split("\n").map((s, i) => <React.Fragment key={i}>{i > 0 && <br />}{s}</React.Fragment>)}
        </p>
      </div>
    </div>
  );
}

/* Google "G" ロゴ */
const GoogleG = (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1z" />
    <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.4 46 24 46z" />
    <path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5C3 17.1 2.2 20.4 2.2 24s.8 6.9 2.3 9.9l7.3-5.7z" />
    <path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.4 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z" />
  </svg>
);

/* ================= Googleアカウント選択（デモ） ================= */
function GoogleAuthScreen({ onPick, onBack }) {
  const t = useT();
  const accounts = [
    { name: t("gUserName"), email: "viewme.user@gmail.com", color: "#7aa7d9" },
    { name: t("gSubName"), email: "sub.account@gmail.com", color: "#9bb0c4" },
  ];
  return (
    <div className="gauth">
      <Blobs />
      <div className="gauth-card">
        <div className="gauth-top">
          <div className="gauth-g">{GoogleG}</div>
          <div className="gauth-title">{t("gAccountTitle")}</div>
          <div className="gauth-app">{t("gMoveTo")}</div>
        </div>
        <div className="gauth-list">
          {accounts.map((a) => (
            <button key={a.email} className="gauth-acc" onClick={() => onPick(a)}>
              <span className="gauth-ava" style={{ background: a.color }}>{a.name[0]}</span>
              <span className="gauth-info">
                <b>{a.name}</b>
                <em>{a.email}</em>
              </span>
            </button>
          ))}
          <button className="gauth-acc other" onClick={() => onPick({ name: "", email: "" })}>
            <span className="gauth-ava plus">＋</span>
            <span className="gauth-info"><b>{t("gOther")}</b></span>
          </button>
        </div>
        <p className="gauth-foot">{t("gShare")}</p>
        <button className="gauth-back" onClick={onBack}>{t("cancel")}</button>
      </div>
      <p className="gauth-demo">{t("demoNote")}</p>
    </div>
  );
}

/* ================= 初期設定画面（名前・アイコン・ID） ================= */
function SetupScreen({ profile, authMode, onPickAvatar, onComplete }) {
  const t = useT();
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  return (
    <div className="welcome setup">
      <Blobs />
      <div className="wl-card">
        <div className="wl-badge">{t("step")}</div>
        <h2 className="su-title">{t("setupTitle")}</h2>
        {authMode === "guest" && (
          <div className="guest-banner">
            {t("guestBanner")}
          </div>
        )}

        <button className="su-ava" onClick={onPickAvatar}>
          {profile.avatar ? <img src={profile.avatar} alt="" /> : <span className="su-ava-ph">＋</span>}
          <span className="su-ava-cam">📷</span>
        </button>
        <p className="su-ava-note">{t("pickIcon")}</p>

        <label className="su-field">
          <span>{t("name")}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("name")} />
        </label>
        <label className="su-field">
          <span>{t("id")}</span>
          <div className="su-id">
            <em>@</em>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("id")} />
          </div>
        </label>

        <button
          className="wl-start"
          onClick={() => onComplete(name.trim(), username.trim())}
        >
          {t("start")}
        </button>
      </div>
    </div>
  );
}

/* ================= タイル操作シート（並べ替え/変更/削除） ================= */
function TileActionSheet({ onReorder, onReplace, onDelete, onClose }) {
  const t = useT();
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="action-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="as-btn" onClick={onReorder}>{t("reorderDrag")}</button>
        <button className="as-btn" onClick={onReplace}>{t("changeImage")}</button>
        <button className="as-btn danger" onClick={onDelete}>{t("del")}</button>
        <button className="as-btn cancel" onClick={onClose}>{t("cancel")}</button>
      </div>
    </div>
  );
}

/* ================= メイン ================= */
export default function App() {
  const [items, setItems] = useState([]); // 投稿はまっさらスタート
  const [profile, setProfile] = useState(initialProfile);
  const [screen, setScreen] = useState("language"); // 'language' | 'login' | 'gauth' | 'setup' | 'main'
  const [lang, setLang] = useState("ja");
  const t = (key) => (T[lang] && T[lang][key]) || T.ja[key] || key;
  const [authMode, setAuthMode] = useState(null); // 'google' | 'guest'
  const [highlights, setHighlights] = useState([]); // ハイライトもまっさら
  const [editingHl, setEditingHl] = useState(null);
  const hlCounter = useRef(0);
  const [editing, setEditing] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [crop, setCrop] = useState(null); // {src, mode:'new'|'replace'|'avatar'|'highlight', id?}
  const fileRef = useRef(null);
  const filePurpose = useRef({ mode: "new" });
  const gridRef = useRef(null);

  /* --- ドラッグ並べ替え --- */
  const [drag, setDrag] = useState(null);
  const dragRef = useRef(null);
  const pending = useRef(null);
  const idCounter = useRef(0);
  const downPos = useRef(null);
  const reorderRef = useRef(false);
  useEffect(() => { reorderRef.current = reorderMode; }, [reorderMode]);
  useEffect(() => { dragRef.current = drag; }, [drag]);

  const reorderTo = useCallback((clientX, clientY) => {
    const d = dragRef.current;
    if (!d || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const gap = 2;
    const cellW = (rect.width - gap * 2) / 3;
    const cellH = (cellW * 4) / 3 + gap;
    const col = Math.min(2, Math.max(0, Math.floor((clientX - rect.left) / (cellW + gap))));
    const row = Math.max(0, Math.floor((clientY - rect.top) / cellH));
    setItems((arr) => {
      const from = arr.findIndex((it) => it.id === d.id);
      let to = Math.min(arr.length - 1, row * 3 + col);
      if (from === -1 || to === from) return arr;
      const next = [...arr];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const startDrag = useCallback((e, id, el) => {
    const r = el.getBoundingClientRect();
    setDrag({ id, w: r.width, h: r.height, dx: e.clientX - r.left, dy: e.clientY - r.top, x: e.clientX, y: e.clientY });
  }, []);

  const tileDown = (e, id) => {
    const el = e.currentTarget;
    downPos.current = { x: e.clientX, y: e.clientY, t: Date.now(), id };

    if (reorderRef.current) {
      if (e.pointerType !== "touch") e.preventDefault();
      startDrag(e, id, el);
      if (navigator.vibrate) navigator.vibrate(8);
      return;
    }

    const sx = e.clientX, sy = e.clientY;
    const timer = setTimeout(() => {
      pending.current = null;
      if (navigator.vibrate) navigator.vibrate(12);
      setMenuId(id);
    }, 350);
    pending.current = { timer, sx, sy };
  };

  const tileUp = (e, id) => {
    const d = downPos.current;
    downPos.current = null;
    if (pending.current) { clearTimeout(pending.current.timer); pending.current = null; }
    if (reorderRef.current) return;
    if (!d || d.id !== id) return;
    if (e.pointerType === "mouse") {
      const moved = Math.hypot(e.clientX - d.x, e.clientY - d.y);
      if (moved < 8 && Date.now() - d.t < 350) setMenuId(id);
    }
  };

  useEffect(() => {
    const pm = (e) => {
      const p = e.touches ? e.touches[0] : e;
      if (pending.current) {
        if (Math.hypot(p.clientX - pending.current.sx, p.clientY - pending.current.sy) > 10) {
          clearTimeout(pending.current.timer);
          pending.current = null;
        }
      }
      if (dragRef.current) {
        if (e.cancelable) e.preventDefault();
        setDrag((d) => (d ? { ...d, x: p.clientX, y: p.clientY } : d));
        reorderTo(p.clientX, p.clientY);
      }
    };
    const pu = () => {
      if (pending.current) { clearTimeout(pending.current.timer); pending.current = null; }
      setDrag(null);
    };
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    window.addEventListener("pointercancel", pu);
    document.addEventListener("touchmove", pm, { passive: false });
    return () => {
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      window.removeEventListener("pointercancel", pu);
      document.removeEventListener("touchmove", pm);
    };
  }, [reorderTo]);

  /* --- 画像選択 → トリミング --- */
  const pickFile = (purpose) => {
    filePurpose.current = purpose;
    fileRef.current?.click();
  };
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setCrop({ src: reader.result, ...filePurpose.current });
    reader.readAsDataURL(f);
    e.target.value = "";
  };
  const onCropped = (dataUrl) => {
    if (crop.mode === "new") {
      idCounter.current += 1;
      setItems((arr) => [{ id: "u" + idCounter.current, type: "photo", src: dataUrl }, ...arr]);
    } else if (crop.mode === "replace") {
      setItems((arr) => arr.map((it) => (it.id === crop.id ? { ...it, src: dataUrl } : it)));
    } else if (crop.mode === "avatar") {
      setProfile((p) => ({ ...p, avatar: dataUrl }));
    } else if (crop.mode === "highlight") {
      setEditingHl((h) => (h ? { ...h, img: dataUrl } : h));
    }
    setCrop(null);
  };

  /* --- ハイライト保存/削除 --- */
  const saveHighlight = () => {
    const hl = editingHl;
    setHighlights((arr) => {
      if (hl.id) {
        return arr.map((h) => (h.id === hl.id ? { ...h, label: hl.label || "✨", img: hl.img } : h));
      }
      hlCounter.current += 1;
      return [...arr, { id: "h" + hlCounter.current, label: hl.label || "✨", img: hl.img }];
    });
    setEditingHl(null);
  };
  const deleteHighlight = () => {
    setHighlights((arr) => arr.filter((h) => h.id !== editingHl.id));
    setEditingHl(null);
  };

  /* --- タイルメニュー操作 --- */
  const startReorder = () => {
    setMenuId(null);
    setReorderMode(true);
  };
  const replaceTile = () => {
    const id = menuId;
    setMenuId(null);
    pickFile({ mode: "replace", id });
  };
  const deleteTile = () => {
    setItems((arr) => arr.filter((it) => it.id !== menuId));
    setMenuId(null);
  };

  const draggedItem = drag ? items.find((it) => it.id === drag.id) : null;
  const bioLines = profile.bio ? profile.bio.split("\n") : [];
  const hasMusic = profile.musicTitle || profile.musicArtist;

  /* --- 言語選択画面（最初） --- */
  if (screen === "language") {
    return (
      <LangContext.Provider value={lang}>
        <div className="app">
          <style>{CSS}</style>
          <LanguageScreen onPick={(code) => { setLang(code); setScreen("login"); }} />
        </div>
      </LangContext.Provider>
    );
  }

  /* --- ログイン画面 --- */
  if (screen === "login") {
    return (
      <LangContext.Provider value={lang}>
        <div className="app">
          <style>{CSS}</style>
          <LoginScreen
            onGoogle={() => { setAuthMode("google"); setScreen("gauth"); }}
            onGuest={() => { setAuthMode("guest"); setScreen("setup"); }}
          />
        </div>
      </LangContext.Provider>
    );
  }

  /* --- Googleアカウント選択（デモ） --- */
  if (screen === "gauth") {
    return (
      <LangContext.Provider value={lang}>
        <div className="app">
          <style>{CSS}</style>
          <GoogleAuthScreen
            onBack={() => setScreen("login")}
            onPick={(acc) => {
              setProfile((p) => ({
                ...p,
                name: acc.name || p.name,
                username: acc.email ? acc.email.split("@")[0] : p.username,
              }));
              setScreen("setup");
            }}
          />
        </div>
      </LangContext.Provider>
    );
  }

  /* --- 初期設定画面 --- */
  if (screen === "setup") {
    return (
      <LangContext.Provider value={lang}>
        <div className="app">
          <style>{CSS}</style>
          <SetupScreen
            profile={profile}
            authMode={authMode}
            onPickAvatar={() => pickFile({ mode: "avatar" })}
            onComplete={(name, username) => {
              setProfile((p) => ({ ...p, name, username }));
              setScreen("main");
            }}
          />
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          {crop && (
            <CropModal
              src={crop.src}
              aspect={1}
              outW={600}
              title={t("cropAvatar")}
              onCancel={() => setCrop(null)}
              onDone={onCropped}
            />
          )}
        </div>
      </LangContext.Provider>
    );
  }

  return (
    <LangContext.Provider value={lang}>
    <div className="app">
      <style>{CSS}</style>

      {/* ヘッダー */}
      <header className="top">
        <button className="icon-btn">{I.plus()}</button>
        <div className="uname">
          {profile.username || "user"} <span className="chev">{I.chevron()}</span><span className="reddot" />
        </div>
        <div className="top-right">
          <button className="icon-btn about-btn" onClick={() => setAboutOpen(true)} aria-label="about">
            {I.burger()}<span className="about-tag">about</span>
          </button>
        </div>
      </header>

      {/* プロフィール */}
      <section className="profile">
        <div className="ava-wrap">
          <div className="avatar" onClick={() => pickFile({ mode: "avatar" })}>
            {profile.avatar ? <img src={profile.avatar} alt="" /> : <span className="ava-ph">＋</span>}
          </div>
          <div className="ava-plus">＋</div>
        </div>
        <div className="stats">
          <div className="stat"><b>{items.length}</b><span>{t("posts")}</span></div>
          <div className="stat"><b>{profile.followers || "0"}</b><span>{t("followers")}</span></div>
          <div className="stat"><b>{profile.following || "0"}</b><span>{t("following")}</span></div>
        </div>
      </section>

      <section className="bio">
        {profile.name && <div className="bio-name">{profile.name}</div>}
        {bioLines.map((l, i) => <div key={i}>{l || "\u00A0"}</div>)}
        {!profile.name && bioLines.length === 0 && (
          <div className="bio-empty" onClick={() => setEditing(true)}>{t("addBio")}</div>
        )}
      </section>

      <section className="music-row">
        {hasMusic ? (
          <div className="music-pill" onClick={() => setEditing(true)}>
            {I.play()}<b>{profile.musicTitle}</b>&nbsp;{profile.musicArtist}
          </div>
        ) : null}
        <div className="add-pill" onClick={() => setEditing(true)}>{t("add")}</div>
      </section>

      {/* ボタン行 */}
      <section className="btn-row">
        <button className="gray-btn" onClick={() => setEditing(true)}>{t("editProfile")}</button>
        <button className="gray-btn" onClick={() => pickFile({ mode: "new" })}>{I.camera()}　{t("addPhoto")}</button>
        <button className="gray-btn sq">{I.addPerson()}</button>
      </section>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />

      {/* ハイライト */}
      <section className="highlights">
        <div className="hl" onClick={() => setEditingHl({ id: null, label: "", img: null })}>
          <div className="hl-circle new">＋</div>
          <span>{t("newHl")}</span>
        </div>
        {highlights.map((h) => (
          <div key={h.id} className="hl" onClick={() => setEditingHl({ ...h })}>
            <div className="hl-circle">
              {h.img ? <img src={h.img} alt="" /> : <span className="hl-ph">○</span>}
            </div>
            <span>{h.label}</span>
          </div>
        ))}
      </section>

      {/* タブ */}
      <nav className="tabs">
        <div className="tab active">{I.grid()}</div>
        <div className="tab">{I.reels()}</div>
        <div className="tab">{I.repost()}</div>
        <div className="tab">{I.tagged()}</div>
      </nav>

      {/* 並べ替えモードバー */}
      {reorderMode && (
        <div className="reorder-bar">
          <span>{t("reorderBar")}</span>
          <button onClick={() => setReorderMode(false)}>{t("done")}</button>
        </div>
      )}

      {/* グリッド */}
      {items.length === 0 ? (
        <div className="grid-empty" onClick={() => pickFile({ mode: "new" })}>
          <div className="ge-circle">{I.camera(30)}</div>
          <p>{t("noPhotos")}</p>
          <span>{t("tapFirst")}</span>
        </div>
      ) : (
        <>
          <div className={"grid" + (reorderMode ? " reordering" : "")} ref={gridRef}>
            {items.map((it) => (
              <div
                key={it.id}
                className={"tile" + (drag?.id === it.id ? " lifting" : "") + (reorderMode ? " wiggle" : "")}
                onPointerDown={(e) => tileDown(e, it.id)}
                onPointerUp={(e) => tileUp(e, it.id)}
              >
                <img className="tile-img" src={it.src} alt="" draggable={false} />
              </div>
            ))}
          </div>
          <p className="grid-hint">
            {reorderMode ? t("hintReorder") : t("hintNormal")}
          </p>
        </>
      )}

      {/* ドラッグ中のゴースト */}
      {drag && draggedItem && (
        <div
          className="ghost"
          style={{ width: drag.w, height: drag.h, left: drag.x - drag.dx, top: drag.y - drag.dy }}
        >
          <img className="tile-img" src={draggedItem.src} alt="" />
        </div>
      )}

      {/* プロフィール編集 */}
      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(f) => { setProfile(f); setEditing(false); }}
          onPickAvatar={() => pickFile({ mode: "avatar" })}
        />
      )}

      {/* 長押しメニュー */}
      {menuId && (
        <TileActionSheet
          onReorder={startReorder}
          onReplace={replaceTile}
          onDelete={deleteTile}
          onClose={() => setMenuId(null)}
        />
      )}

      {/* ハイライト編集 */}
      {editingHl && (
        <HighlightEditModal
          value={editingHl}
          isNew={!editingHl.id}
          onChange={setEditingHl}
          onPickImage={() => pickFile({ mode: "highlight" })}
          onSave={saveHighlight}
          onDelete={deleteHighlight}
          onClose={() => setEditingHl(null)}
        />
      )}

      {/* About */}
      {aboutOpen && (
        <AboutModal appName="view me" onClose={() => setAboutOpen(false)} />
      )}

      {/* トリミング */}
      {crop && (
        <CropModal
          src={crop.src}
          aspect={crop.mode === "avatar" || crop.mode === "highlight" ? 1 : 3 / 4}
          outW={crop.mode === "avatar" || crop.mode === "highlight" ? 600 : 900}
          title={
            crop.mode === "avatar"
              ? t("cropAvatar")
              : crop.mode === "highlight"
              ? t("cropCover")
              : t("crop34")
          }
          onCancel={() => setCrop(null)}
          onDone={onCropped}
        />
      )}
    </div>
    </LangContext.Provider>
  );
}

/* ================= CSS ================= */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; background: #fff; }
.app {
  max-width: 430px; margin: 0 auto; background: #fff; min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  color: #000; padding-bottom: 40px;
}
.icon-btn { background: none; border: none; padding: 4px; color: #000; display: flex; align-items: center; cursor: pointer; }

.top { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px 6px; }
.uname { font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
.chev { display: flex; align-items: center; margin-top: 3px; }
.reddot { width: 8px; height: 8px; border-radius: 50%; background: #ff3040; margin-left: 2px; margin-top: -8px; }
.top-right { display: flex; gap: 14px; }
.about-btn { flex-direction: column; gap: 1px; }
.about-tag { font-size: 8.5px; font-weight: 700; color: #8a929a; letter-spacing: .5px; line-height: 1; }

.profile { display: flex; align-items: center; padding: 14px 16px 6px; gap: 8px; }
.ava-wrap { position: relative; flex-shrink: 0; }
.avatar {
  width: 86px; height: 86px; border-radius: 50%;
  background: #f2f2f2;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e3e3e3; overflow: hidden; cursor: pointer;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.ava-ph { font-size: 30px; color: #bdbdbd; }
.ava-plus {
  position: absolute; right: 0; bottom: 2px; width: 26px; height: 26px; border-radius: 50%;
  background: #1c1c1e; color: #fff; font-size: 17px; display: flex; align-items: center;
  justify-content: center; border: 2.5px solid #fff; pointer-events: none;
}
.stats { display: flex; flex: 1; justify-content: space-around; margin-left: 6px; }
.stat { text-align: center; }
.stat b { display: block; font-size: 20px; font-weight: 700; }
.stat span { font-size: 13.5px; color: #000; }

.bio { padding: 6px 16px 2px; font-size: 14.5px; line-height: 1.5; }
.bio-name { font-weight: 600; }
.bio-empty { color: #0095f6; font-size: 14px; cursor: pointer; }

.music-row { display: flex; gap: 8px; padding: 10px 16px 4px; align-items: center; }
.music-pill {
  display: flex; align-items: center; gap: 6px; border: 1px solid #dbdbdb; border-radius: 22px;
  padding: 9px 16px; font-size: 14.5px; max-width: 75%; overflow: hidden; white-space: nowrap;
  cursor: pointer;
}
.music-pill b { font-weight: 600; }
.add-pill { border: 1px solid #dbdbdb; border-radius: 22px; padding: 9px 16px; font-size: 14.5px; color: #000; cursor: pointer; }

.btn-row { display: flex; gap: 6px; padding: 12px 16px 4px; }
.gray-btn {
  flex: 1; background: #efefef; border: none; border-radius: 10px; padding: 9px 4px;
  font-size: 14.5px; font-weight: 600; color: #000; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-family: inherit;
}
.gray-btn:active { background: #e2e2e2; }
.gray-btn.sq { flex: 0 0 44px; }

.highlights { display: flex; gap: 22px; padding: 16px 16px 6px; overflow-x: auto; }
.hl { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 12.5px; cursor: pointer; flex-shrink: 0; }
.hl-circle {
  width: 64px; height: 64px; border-radius: 50%; border: 1px solid #dbdbdb;
  display: flex; align-items: center; justify-content: center; font-size: 26px; color: #262626;
  background: #fff; overflow: hidden;
}
.hl-circle img { width: 88%; height: 88%; object-fit: cover; border-radius: 50%; }
.hl-ph { color: #d6d6d6; }
.hl span { max-width: 70px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.tabs { display: flex; margin-top: 8px; border-bottom: 1px solid #efefef; }
.tab { flex: 1; display: flex; justify-content: center; padding: 11px 0 9px; color: #9b9b9b; border-bottom: 1.5px solid transparent; }
.tab.active { color: #000; border-bottom-color: #000; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 2px; }
.tile {
  position: relative; aspect-ratio: 3 / 4; background: #f3f3f3; overflow: hidden;
  cursor: grab; touch-action: pan-y; user-select: none; -webkit-user-select: none;
}
.tile.lifting { opacity: .35; }
.grid.reordering .tile { touch-action: none; cursor: grabbing; }
.tile.wiggle { animation: wiggle .35s ease-in-out infinite alternate; }
.tile.wiggle:nth-child(2n) { animation-delay: .12s; }
.tile.wiggle:nth-child(3n) { animation-delay: .22s; }
.tile.lifting.wiggle { animation: none; }
@keyframes wiggle {
  from { transform: rotate(-0.7deg) scale(.985); }
  to { transform: rotate(0.7deg) scale(.985); }
}
@media (prefers-reduced-motion: reduce) { .tile.wiggle { animation: none; } }

.reorder-bar {
  position: sticky; top: 0; z-index: 500;
  display: flex; align-items: center; justify-content: space-between;
  background: #1c1c1e; color: #fff; padding: 10px 16px; font-size: 14px;
  margin-top: 2px;
}
.reorder-bar button {
  background: #fff; color: #000; border: none; border-radius: 16px;
  padding: 6px 18px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit;
}
.tile-img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }

.grid-empty {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 56px 20px; color: #8e8e8e; cursor: pointer; text-align: center;
}
.ge-circle {
  width: 70px; height: 70px; border-radius: 50%; border: 1.6px solid #bdbdbd;
  display: flex; align-items: center; justify-content: center; color: #8e8e8e; margin-bottom: 6px;
}
.grid-empty p { margin: 0; font-size: 16px; font-weight: 700; color: #262626; }
.grid-empty span { font-size: 13px; }

.ghost {
  position: fixed; z-index: 1000; pointer-events: none; overflow: hidden;
  border-radius: 4px; box-shadow: 0 10px 28px rgba(0,0,0,.35); transform: scale(1.06);
}
.grid-hint { text-align: center; font-size: 11.5px; color: #9b9b9b; margin: 10px 0 0; }

/* --- トリミング --- */
.crop-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.92); z-index: 2000;
  display: flex; flex-direction: column; align-items: center;
}
.crop-head { width: 100%; max-width: 430px; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; }
.crop-title { color: #fff; font-size: 15px; font-weight: 600; }
.crop-btn { background: none; border: none; color: #d9d9d9; font-size: 15px; cursor: pointer; font-family: inherit; padding: 6px; }
.crop-btn.done { color: #4aa8ff; font-weight: 700; }
.crop-frame {
  position: relative; overflow: hidden; background: #111; margin-top: 8px;
  touch-action: none; border-radius: 4px; cursor: grab;
}
.crop-frame.round { border-radius: 50%; }
.crop-grid { position: absolute; inset: 0; pointer-events: none; }
.crop-grid div { position: absolute; background: rgba(255,255,255,.35); }
.crop-grid div:nth-child(1) { left: 33.33%; top: 0; bottom: 0; width: 1px; }
.crop-grid div:nth-child(2) { left: 66.66%; top: 0; bottom: 0; width: 1px; }
.crop-grid div:nth-child(3) { top: 33.33%; left: 0; right: 0; height: 1px; }
.crop-grid div:nth-child(4) { top: 66.66%; left: 0; right: 0; height: 1px; }
.crop-zoom { display: flex; align-items: center; gap: 12px; color: #fff; margin-top: 18px; width: 80%; max-width: 320px; }
.crop-zoom input { flex: 1; accent-color: #fff; }
.crop-hint { color: #8e8e8e; font-size: 12px; margin-top: 10px; }

/* --- モーダル共通 --- */
.sheet-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 1500;
  display: flex; flex-direction: column; justify-content: flex-end; align-items: center;
}

/* --- プロフィール編集 --- */
.edit-modal {
  width: 100%; max-width: 430px; background: #fff; border-radius: 18px 18px 0 0;
  max-height: 88vh; overflow-y: auto; animation: slideUp .22s ease;
}
@keyframes slideUp { from { transform: translateY(40px); opacity: .5; } to { transform: none; opacity: 1; } }
.edit-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid #efefef;
  position: sticky; top: 0; background: #fff; z-index: 1;
}
.edit-title { font-size: 16px; font-weight: 700; }
.edit-cancel { background: none; border: none; font-size: 14.5px; color: #000; cursor: pointer; font-family: inherit; }
.edit-done { background: none; border: none; font-size: 14.5px; color: #0095f6; font-weight: 700; cursor: pointer; font-family: inherit; }
.edit-body { padding: 18px 20px 30px; }
.edit-ava-block { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 18px; }
.edit-ava {
  width: 88px; height: 88px; border-radius: 50%; overflow: hidden;
  background: #f2f2f2;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e3e3e3;
}
.edit-ava img { width: 100%; height: 100%; object-fit: cover; }
.edit-ava-change { background: none; border: none; color: #0095f6; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; }
.field { display: block; margin-bottom: 14px; }
.field span { display: block; font-size: 12px; color: #8e8e8e; margin-bottom: 4px; }
.field input, .field textarea {
  width: 100%; border: none; border-bottom: 1px solid #dbdbdb; font-size: 15px;
  padding: 6px 0; font-family: inherit; outline: none; resize: none; background: none;
}
.field input:focus, .field textarea:focus { border-bottom-color: #0095f6; }
.field-pair { display: flex; gap: 18px; }
.field-pair .field { flex: 1; }

/* --- アクションシート --- */
.action-sheet {
  width: calc(100% - 24px); max-width: 406px; margin-bottom: 18px;
  display: flex; flex-direction: column; gap: 8px; animation: slideUp .18s ease;
}
.as-btn {
  background: rgba(255,255,255,.96); border: none; border-radius: 14px;
  padding: 16px; font-size: 17px; color: #0095f6; cursor: pointer; font-family: inherit;
  backdrop-filter: blur(8px);
}
.as-btn.danger { color: #ff3040; font-weight: 600; }
.as-btn.cancel { color: #000; font-weight: 700; margin-top: 2px; }
.as-btn:active { background: #e9e9e9; }

/* --- ハイライト編集モーダル --- */
.hl-edit-body { display: flex; flex-direction: column; align-items: center; }
.hl-edit-circle {
  position: relative; width: 110px; height: 110px; border-radius: 50%;
  border: 2px dashed #d9b8c4; background: #fff7fa; cursor: pointer;
  display: flex; align-items: center; justify-content: center; overflow: visible;
  padding: 0;
}
.hl-edit-circle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.hl-edit-empty { font-size: 34px; color: #d9a4b8; }
.hl-edit-cam {
  position: absolute; right: -2px; bottom: -2px; width: 34px; height: 34px;
  background: #fff; border-radius: 50%; box-shadow: 0 1px 5px rgba(0,0,0,.18);
  display: flex; align-items: center; justify-content: center; font-size: 16px;
}
.hl-edit-note { font-size: 12px; color: #b08ea0; margin: 10px 0 16px; }
.hl-modal .field { width: 100%; }
.hl-delete {
  background: none; border: none; color: #ff3040; font-size: 14px;
  margin-top: 8px; cursor: pointer; font-family: inherit; padding: 8px;
}

/* --- ようこそ / 初期設定 / ログイン（白黒グレー＋薄い水色・韓国女子風） --- */
.welcome, .gauth {
  min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; overflow: hidden; padding: 24px;
  background: linear-gradient(165deg, #ffffff 0%, #f6f7f8 30%, #eef1f3 58%, #f1f3f5 82%, #fafbfc 100%);
  background-size: 280% 280%;
  animation: bgShift 12s ease-in-out infinite alternate;
  font-family: "Hiragino Maru Gothic ProN", "BIZ UDGothic", -apple-system, sans-serif;
}
@keyframes bgShift {
  0% { background-position: 0% 0%; }
  50% { background-position: 60% 100%; }
  100% { background-position: 100% 35%; }
}
/* やわらかい光の濃淡がゆっくり呼吸するレイヤー（水色はごく薄く差し色程度） */
.welcome::before {
  content: ""; position: absolute; inset: -30%;
  background:
    radial-gradient(circle at 28% 22%, rgba(255,255,255,.9), transparent 42%),
    radial-gradient(circle at 78% 74%, rgba(176,206,232,.28), transparent 50%);
  animation: breathe 7s ease-in-out infinite alternate;
  pointer-events: none;
}
.welcome::after {
  content: ""; position: absolute; inset: -30%;
  background: radial-gradient(circle at 60% 32%, rgba(214,222,228,.5), transparent 46%);
  animation: breathe 9s ease-in-out infinite alternate-reverse;
  pointer-events: none;
}
@keyframes breathe {
  from { opacity: .3; transform: scale(1); }
  to { opacity: .9; transform: scale(1.12); }
}
@media (prefers-reduced-motion: reduce) {
  .welcome, .welcome::before, .welcome::after { animation: none; }
}

/* 水色・ピンクのグラデーションが随所に現れては消える浮遊ブロブ */
.welcome .blob, .gauth .blob {
  position: absolute; border-radius: 50%; pointer-events: none; z-index: 0;
  filter: blur(34px); mix-blend-mode: multiply; opacity: 0;
}
.blob.b1 {
  width: 230px; height: 230px; top: 6%; left: -8%;
  background: radial-gradient(circle, rgba(150,196,236,.55), transparent 70%);
  animation: blobPulse 9s ease-in-out infinite; animation-delay: 0s;
}
.blob.b2 {
  width: 200px; height: 200px; top: 18%; right: -6%;
  background: radial-gradient(circle, rgba(244,184,212,.5), transparent 70%);
  animation: blobPulse 11s ease-in-out infinite; animation-delay: 2.4s;
}
.blob.b3 {
  width: 260px; height: 260px; bottom: 4%; left: 16%;
  background: radial-gradient(circle, rgba(168,206,236,.5), transparent 70%);
  animation: blobPulse 10s ease-in-out infinite; animation-delay: 4.2s;
}
.blob.b4 {
  width: 180px; height: 180px; bottom: 16%; right: 4%;
  background: radial-gradient(circle, rgba(248,196,220,.5), transparent 70%);
  animation: blobPulse 13s ease-in-out infinite; animation-delay: 1.2s;
}
.blob.b5 {
  width: 150px; height: 150px; top: 44%; left: 40%;
  background: radial-gradient(circle, rgba(190,210,240,.45), transparent 70%);
  animation: blobPulse 12s ease-in-out infinite; animation-delay: 6s;
}
@keyframes blobPulse {
  0%   { opacity: 0; transform: scale(.7) translate(0, 0); }
  35%  { opacity: .85; }
  55%  { opacity: .85; transform: scale(1.15) translate(14px, -12px); }
  100% { opacity: 0; transform: scale(.8) translate(-10px, 14px); }
}
@media (prefers-reduced-motion: reduce) { .blob { display: none; } }

.wl-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 330px; background: none;
  border: none; border-radius: 28px; padding: 34px 26px 28px;
  box-shadow: none;
  text-align: center;
}
.wl-badge {
  display: inline-block; font-size: 11.5px; letter-spacing: 2px; color: #8a929a;
  background: #f3f5f6; border: 1px dashed #d8dce0; border-radius: 14px;
  padding: 4px 14px; margin-bottom: 14px;
}
.ribbon {
  margin: 0 auto 12px; display: block; text-align: center;
  font-family: "Courier New", "Menlo", "DejaVu Sans Mono", monospace;
  white-space: pre; font-size: 11px; line-height: 1; letter-spacing: -1px;
  color: #2b3138; user-select: none;
  text-shadow: 0 1px 2px rgba(120,150,180,.18);
}
.wl-logo {
  margin: 0; font-size: 37px; font-weight: 700; letter-spacing: .5px;
  font-family: 'Libre Baskerville', Georgia, serif; font-style: italic;
  color: #2b3138;
}
.wl-sub { font-size: 13.5px; color: #969ca2; line-height: 1.9; margin: 12px 0 6px; }
.wl-dots { display: flex; justify-content: center; gap: 7px; margin: 14px 0 22px; }
.wl-dots span { width: 6px; height: 6px; border-radius: 50%; background: #d4d8dc; }
.wl-dots span:nth-child(2) { background: #9fb9cf; }
.wl-dots span:nth-child(3) { background: #d4d8dc; }
.wl-start {
  width: 100%; border: none; border-radius: 22px; padding: 15px;
  font-size: 16px; font-weight: 700; color: #fff; cursor: pointer; font-family: inherit;
  background: #2b3138;
  box-shadow: 0 6px 16px rgba(43,49,56,.22), inset 0 -3px 0 rgba(0,0,0,.1);
  transition: transform .12s ease;
}
.wl-start:active { transform: scale(.97); }
.wl-foot { font-size: 11px; color: #aeb4ba; margin: 14px 0 0; letter-spacing: 1px; }

/* 言語選択 */
.lang-title { font-size: 13px; color: #8a929a; letter-spacing: 2px; margin: 10px 0 18px; }
.lang-list { display: flex; flex-direction: column; gap: 10px; }
.lang-btn {
  width: 100%; border: 1.5px solid #e2e5e8; border-radius: 18px; padding: 15px;
  font-size: 16px; font-weight: 700; color: #2b3138; background: rgba(255,255,255,.75);
  cursor: pointer; font-family: inherit; transition: all .14s ease; backdrop-filter: blur(4px);
}
.lang-btn:active { transform: scale(.97); background: #fff; border-color: #7aa7d9; }

/* ログインボタン */
.g-btn {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
  background: #fff; border: 1.5px solid #dadfe4; border-radius: 22px; padding: 14px;
  font-size: 15px; font-weight: 700; color: #3c4650; cursor: pointer; font-family: inherit;
  box-shadow: 0 3px 10px rgba(120,150,180,.14); transition: transform .12s ease;
}
.g-btn:active { transform: scale(.97); }
.g-ico { display: flex; }
.guest-btn {
  width: 100%; margin-top: 12px; background: none; border: none; cursor: pointer;
  font-family: inherit; font-size: 14px; font-weight: 700; color: #7a838b;
  text-decoration: underline; text-underline-offset: 3px; padding: 6px;
}
.guest-note { font-size: 10.5px; color: #aeb4ba; line-height: 1.7; margin: 12px 0 0; }

/* Googleアカウント選択（デモ） */
.gauth { justify-content: flex-start; padding-top: 40px; }
.gauth-card {
  position: relative; z-index: 1; width: 100%; max-width: 360px;
  background: #fff; border: 1px solid #e4e7eb; border-radius: 18px;
  padding: 24px 22px 18px; box-shadow: 0 14px 38px rgba(120,150,180,.18);
}
.gauth-top { text-align: center; margin-bottom: 16px; }
.gauth-g { display: flex; justify-content: center; margin-bottom: 12px; }
.gauth-title { font-size: 20px; color: #202124; font-weight: 500; }
.gauth-app { font-size: 13px; color: #5f6368; margin-top: 4px; }
.gauth-list { display: flex; flex-direction: column; }
.gauth-acc {
  display: flex; align-items: center; gap: 14px; width: 100%; text-align: left;
  background: none; border: none; border-top: 1px solid #eceef0; padding: 13px 4px;
  cursor: pointer; font-family: inherit;
}
.gauth-acc:active { background: #f5f7f9; }
.gauth-acc.other { border-bottom: 1px solid #eceef0; }
.gauth-ava {
  width: 38px; height: 38px; border-radius: 50%; color: #fff; font-weight: 700;
  display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0;
}
.gauth-ava.plus { background: #eef1f4; color: #5f6368; }
.gauth-info { display: flex; flex-direction: column; }
.gauth-info b { font-size: 14px; color: #202124; font-weight: 500; }
.gauth-info em { font-style: normal; font-size: 12.5px; color: #5f6368; }
.gauth-foot { font-size: 11px; color: #5f6368; line-height: 1.6; margin: 16px 0 10px; }
.gauth-back { background: none; border: none; color: #1a73e8; font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; padding: 6px; }
.gauth-demo { position: relative; z-index: 1; font-size: 11px; color: #9aa4ad; margin-top: 18px; text-align: center; }

.su-title { margin: 0 0 18px; font-size: 20px; color: #3a4148; font-weight: 800; }
.su-ava {
  position: relative; width: 104px; height: 104px; border-radius: 50%;
  border: 2.5px dashed #d4d8dc; background: #fff; cursor: pointer; padding: 0;
  display: inline-flex; align-items: center; justify-content: center;
  overflow: visible;
}
.su-ava img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.su-ava-ph { font-size: 36px; color: #c2c8ce; }
.su-ava-cam {
  position: absolute; right: -4px; bottom: -2px; width: 34px; height: 34px;
  background: #fff; border-radius: 50%; box-shadow: 0 1px 6px rgba(0,0,0,.16);
  display: flex; align-items: center; justify-content: center; font-size: 16px;
}
.su-ava-note { font-size: 11.5px; color: #a8aeb4; margin: 10px 0 18px; }
.su-field { display: block; text-align: left; margin-bottom: 14px; }
.su-field > span {
  display: block; font-size: 11px; letter-spacing: 2px; color: #8a929a;
  margin-bottom: 5px; font-weight: 700;
}
.su-field input {
  width: 100%; border: 1.5px solid #e0e3e6; border-radius: 16px;
  background: #fafbfc; padding: 12px 16px; font-size: 15px; outline: none;
  font-family: inherit; color: #44494f;
}
.su-field input:focus { border-color: #7aa7d9; box-shadow: 0 0 0 3px rgba(122,167,217,.15); }
.su-id { display: flex; align-items: center; gap: 6px; }
.su-id em { font-style: normal; color: #9aa2aa; font-weight: 800; font-size: 16px; }
.su-id input { flex: 1; }
.setup .wl-start { margin-top: 8px; }
.guest-banner {
  background: #f3f5f6; border: 1px solid #e0e3e6; border-radius: 12px;
  font-size: 11px; color: #7a838b; padding: 8px 12px; margin-bottom: 16px; line-height: 1.6;
}

/* --- About モーダル --- */
.about-body { padding: 8px 20px 30px; }
.about-body .ribbon { margin-top: 18px; }
.about-app {
  text-align: center; font-family: 'Libre Baskerville', Georgia, serif; font-style: italic;
  font-size: 24px; font-weight: 700; color: #2b3138; margin: 8px 0 18px;
}
.about-thanks { text-align: center; font-size: 15px; font-weight: 700; color: #3a4148; margin: 0 0 8px; }
.about-sub { text-align: center; font-size: 12.5px; color: #969ca2; line-height: 1.8; margin: 0 0 22px; }

.about-row {
  position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 3px;
  width: 100%; text-align: left; background: #f6f7f8; border: 1px solid #e8eaec;
  border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; cursor: pointer;
  font-family: inherit;
}
.about-row:active { background: #eef0f2; }
.ar-main { font-size: 15px; font-weight: 700; color: #2b3138; }
.ar-desc { font-size: 11px; color: #9aa1a8; line-height: 1.5; }

.about-row.toggle { padding-right: 64px; }
.ar-switch {
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  width: 40px; height: 24px; border-radius: 14px; background: #d4d8dc; transition: background .2s;
}
.ar-switch i {
  position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: left .2s;
}
.about-row.toggle.on .ar-switch { background: #7aa7d9; }
.about-row.toggle.on .ar-switch i { left: 18px; }

.about-section {
  border: 1px dashed #dce0e4; border-radius: 14px; padding: 14px 16px; margin: 4px 0 18px;
}
.about-section-title { font-size: 11px; letter-spacing: 1.5px; color: #8a929a; font-weight: 700; margin-bottom: 8px; }
.other-empty { font-size: 13px; color: #b0b6bc; }

.about-credit {
  display: block; width: 100%; text-align: center; background: none; border: none;
  font-family: inherit; font-size: 13px; color: #8a929a; cursor: pointer; padding: 10px;
}
.about-credit b { color: #3a4148; }
.x-mark {
  display: inline-block; margin-left: 2px; font-size: 13px; color: #2b3138; font-weight: 700;
}
`;