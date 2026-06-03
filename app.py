from pathlib import Path
import base64
import html
import json
import re
import time

from PIL import Image, ImageOps
import streamlit as st

try:
    from streamlit_cropper import st_cropper
except ImportError:
    st_cropper = None


# ------------------------------------------------------------
# 基本設定
# ------------------------------------------------------------

# アップロードした画像を保存するフォルダです。
# app.py と同じ場所に images フォルダを作ります。
IMAGE_DIR = Path("images")

# ドラッグでトリミングした3:4画像を保存するフォルダです。
CROPPED_IMAGE_DIR = Path("cropped_images")

# プロフィール写真を保存するフォルダです。
PROFILE_IMAGE_DIR = Path("profile_images")

# プロフィール情報や、画像ごとのトリミング設定を保存するファイルです。
SETTINGS_FILE = Path("settings.json")

# Streamlit のアップローダーで受け付ける画像形式です。
ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"]

# アプリを初めて開いたときに使うプロフィール情報です。
DEFAULT_PROFILE = {
    "username": "thumbnail_gallery",
    "display_name": "Instagram Thumbnail Board",
    "bio": "アップロードした画像をInstagramプロフィール風のグリッドで確認できます。",
    "avatar": "📷",
    "profile_image": "",
}


# ------------------------------------------------------------
# 画像保存・読み込み用の関数
# ------------------------------------------------------------

def create_image_folder() -> None:
    """アプリで使う画像フォルダがなければ作成します。"""
    IMAGE_DIR.mkdir(exist_ok=True)
    CROPPED_IMAGE_DIR.mkdir(exist_ok=True)
    PROFILE_IMAGE_DIR.mkdir(exist_ok=True)


def load_settings() -> dict:
    """settings.json からプロフィールとトリミング設定を読み込みます。"""
    if not SETTINGS_FILE.exists():
        return {
            "profile": DEFAULT_PROFILE.copy(),
            "crops": {},
        }

    try:
        settings = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        # settings.json が壊れていた場合でもアプリが止まらないようにします。
        settings = {}

    # 必要な項目がなければ、初期値を入れておきます。
    settings.setdefault("profile", {})
    settings.setdefault("crops", {})

    profile = DEFAULT_PROFILE.copy()
    profile.update(settings["profile"])
    settings["profile"] = profile

    return settings


def save_settings(settings: dict) -> None:
    """プロフィールとトリミング設定を settings.json に保存します。"""
    SETTINGS_FILE.write_text(
        json.dumps(settings, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def clean_filename(filename: str) -> str:
    """ファイル名を安全に保存できる形に整えます。"""
    # Path(...).name にすると、フォルダ名を含む危険な名前を取り除けます。
    name = Path(filename).name

    # 日本語ファイル名も使えますが、記号が多いと扱いづらいのでシンプルにします。
    name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)

    # 空っぽになった場合の保険です。
    return name or "uploaded_image"


def save_uploaded_image(uploaded_file) -> Path:
    """アップロードされた画像を images フォルダに保存します。"""
    original_name = clean_filename(uploaded_file.name)

    # 同じ名前の画像で上書きしないように、現在時刻をファイル名の先頭につけます。
    timestamp = int(time.time() * 1000)
    save_path = IMAGE_DIR / f"{timestamp}_{original_name}"

    # uploaded_file.getbuffer() で画像データを取り出して保存します。
    save_path.write_bytes(uploaded_file.getbuffer())
    return save_path


def save_profile_image(uploaded_file) -> Path:
    """アップロードされたプロフィール写真を profile_images フォルダに保存します。"""
    original_name = clean_filename(uploaded_file.name)
    timestamp = int(time.time() * 1000)
    save_path = PROFILE_IMAGE_DIR / f"{timestamp}_{original_name}"
    save_path.write_bytes(uploaded_file.getbuffer())
    return save_path


def open_image(image_path: Path) -> Image.Image:
    """画像ファイルを開き、スマホ写真の回転情報も反映します。"""
    image = Image.open(image_path)
    image = ImageOps.exif_transpose(image)
    return image.convert("RGB")


def cropped_image_path(image_path: Path) -> Path:
    """元画像に対応するトリミング済み画像の保存先を返します。"""
    return CROPPED_IMAGE_DIR / f"{image_path.stem}_3x4.png"


def thumbnail_display_path(image_path: Path) -> Path:
    """一覧に表示する画像を返します。トリミング済み画像があればそちらを使います。"""
    cropped_path = cropped_image_path(image_path)

    if cropped_path.exists():
        return cropped_path

    return image_path


def get_saved_images() -> list[Path]:
    """images フォルダに保存されている画像一覧を取得します。"""
    create_image_folder()

    image_paths = []
    for extension in ALLOWED_EXTENSIONS:
        image_paths.extend(IMAGE_DIR.glob(f"*.{extension}"))
        image_paths.extend(IMAGE_DIR.glob(f"*.{extension.upper()}"))

    # 新しく保存した画像が上に来るように、更新日時の新しい順に並べます。
    return sorted(image_paths, key=lambda path: path.stat().st_mtime, reverse=True)


def image_to_base64(image_path: Path) -> str:
    """HTML の img タグで表示できるように、画像を Base64 文字列に変換します。"""
    image_bytes = image_path.read_bytes()
    return base64.b64encode(image_bytes).decode("utf-8")


def image_mime_type(image_path: Path) -> str:
    """拡張子から画像の MIME タイプを返します。"""
    extension = image_path.suffix.lower()

    if extension in [".jpg", ".jpeg"]:
        return "image/jpeg"
    if extension == ".webp":
        return "image/webp"
    return "image/png"


def profile_avatar_html(profile: dict) -> str:
    """プロフィール写真、または文字アイコンを表示するHTMLを作ります。"""
    profile_image = profile.get("profile_image", "")

    if profile_image:
        image_path = Path(profile_image)

        if image_path.exists():
            base64_image = image_to_base64(image_path)
            mime_type = image_mime_type(image_path)
            return f'<img src="data:{mime_type};base64,{base64_image}" alt="profile photo" />'

    return html.escape(profile.get("avatar", DEFAULT_PROFILE["avatar"]))


def show_thumbnail(image_path: Path) -> None:
    """Instagram投稿の確認用として、3:4の縦長枠にトリミングして表示します。"""
    display_path = thumbnail_display_path(image_path)
    base64_image = image_to_base64(display_path)
    mime_type = image_mime_type(display_path)

    # aspect-ratio: 3 / 4 で、縦長投稿のサムネイル確認枠を作ります。
    # object-fit: cover にすると、枠いっぱいに表示されて余った部分が中央トリミングされます。
    # ドラッグ編集で保存した画像がある場合は、その保存済み3:4画像を表示します。
    st.markdown(
        f"""
        <div class="thumbnail-card">
            <div class="thumbnail-frame">
                <img
                    src="data:{mime_type};base64,{base64_image}"
                    alt="{image_path.name}"
                />
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ------------------------------------------------------------
# 画面デザイン
# ------------------------------------------------------------

st.set_page_config(
    page_title="Instagram Thumbnail Board",
    page_icon="📷",
    layout="wide",
)

st.markdown(
    """
    <style>
    /* Streamlit 標準の余白を少し整えます。 */
    .stApp {
        background: #fafafa;
        color: #262626;
    }

    .main .block-container {
        max-width: 980px;
        padding-top: 28px;
        padding-bottom: 48px;
    }

    /* Instagram の上部バー風の細いヘッダーです。 */
    .instagram-topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dbdbdb;
        background: #ffffff;
        padding: 14px 18px;
        margin: -28px -16px 28px;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .instagram-logo {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0;
    }

    .topbar-actions {
        display: flex;
        gap: 14px;
        color: #262626;
        font-size: 20px;
    }

    /* プロフィール画面のヘッダー部分です。 */
    .profile-header {
        display: grid;
        grid-template-columns: 170px minmax(0, 1fr);
        gap: 28px;
        align-items: center;
        border-bottom: 1px solid #dbdbdb;
        padding: 10px 0 32px;
        margin-bottom: 18px;
    }

    .avatar-ring {
        width: 130px;
        height: 130px;
        border-radius: 999px;
        background: conic-gradient(#feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75);
        padding: 4px;
        margin: 0 auto;
    }

    .avatar-inner {
        width: 100%;
        height: 100%;
        border-radius: 999px;
        border: 5px solid #fafafa;
        background:
            linear-gradient(135deg, rgba(255,255,255,.85), rgba(255,255,255,.2)),
            #efefef;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
        overflow: hidden;
    }

    .avatar-inner img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .profile-title-row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 18px;
    }

    .profile-name {
        font-size: 22px;
        line-height: 1.2;
        font-weight: 400;
    }

    .profile-button {
        border: 1px solid #dbdbdb;
        background: #ffffff;
        border-radius: 8px;
        padding: 7px 14px;
        font-size: 14px;
        font-weight: 600;
    }

    .editor-panel {
        border: 1px solid #dbdbdb;
        background: #ffffff;
        border-radius: 8px;
        padding: 18px;
        margin: 0 0 20px;
    }

    .editor-title {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 4px;
    }

    .editor-note {
        color: #737373;
        font-size: 13px;
        margin-bottom: 10px;
    }

    .profile-stats {
        display: flex;
        gap: 34px;
        margin-bottom: 18px;
        font-size: 16px;
    }

    .profile-stats strong {
        font-weight: 700;
    }

    .profile-bio {
        font-size: 15px;
        line-height: 1.55;
    }

    .profile-bio strong {
        display: block;
    }

    /* アップロード欄もInstagramの投稿作成エリアのように控えめに見せます。 */
    .upload-panel {
        border: 1px solid #dbdbdb;
        background: #ffffff;
        border-radius: 8px;
        padding: 18px;
        margin-bottom: 20px;
    }

    .upload-title {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 4px;
    }

    .upload-note {
        color: #737373;
        font-size: 13px;
        margin-bottom: 12px;
    }

    /* 投稿タブ風の見出しです。 */
    .profile-tabs {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 46px;
        border-top: 1px solid transparent;
        margin-bottom: 18px;
        color: #737373;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .08em;
    }

    .profile-tabs span:first-child {
        color: #262626;
        border-top: 1px solid #262626;
        padding-top: 14px;
    }

    /* サムネイルの3:4縦長枠です。 */
    .thumbnail-card {
        background: #ffffff;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
    }

    .thumbnail-frame {
        aspect-ratio: 3 / 4;
        width: 100%;
        background:
            linear-gradient(45deg, #f2f2f2 25%, transparent 25%),
            linear-gradient(-45deg, #f2f2f2 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f2f2f2 75%),
            linear-gradient(-45deg, transparent 75%, #f2f2f2 75%);
        background-size: 18px 18px;
        background-position: 0 0, 0 9px, 9px -9px, -9px 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .thumbnail-frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform-origin: center;
    }

    .crop-caption {
        color: #737373;
        font-size: 12px;
        line-height: 1.4;
        margin: 2px 0 6px;
        word-break: break-word;
    }

    .crop-note {
        color: #737373;
        font-size: 12px;
        line-height: 1.5;
        margin-bottom: 10px;
    }

    /* streamlit-cropper の iframe が高さ0になる環境があるため、明示的に高さを確保します。 */
    iframe[title="streamlit_cropper.st_cropper"] {
        min-height: 680px;
    }

    .empty-grid {
        border: 1px dashed #c7c7c7;
        background: #ffffff;
        border-radius: 8px;
        padding: 44px 20px;
        text-align: center;
        color: #737373;
    }

    .empty-grid strong {
        color: #262626;
        display: block;
        font-size: 18px;
        margin-bottom: 8px;
    }

    /* ボタンの見た目をInstagramらしい青に寄せます。 */
    div.stButton > button {
        width: 100%;
        border-radius: 8px;
        border: 1px solid #dbdbdb;
        font-weight: 700;
    }

    div.stButton > button[kind="primary"] {
        background: #0095f6;
        border-color: #0095f6;
    }

    @media (max-width: 700px) {
        .profile-header {
            grid-template-columns: 86px minmax(0, 1fr);
            gap: 16px;
            align-items: start;
        }

        .avatar-ring {
            width: 78px;
            height: 78px;
        }

        .avatar-inner {
            font-size: 26px;
            border-width: 4px;
        }

        .profile-stats {
            gap: 16px;
            font-size: 14px;
            flex-wrap: wrap;
        }

        .profile-tabs {
            gap: 24px;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
)


# ------------------------------------------------------------
# アプリ本体
# ------------------------------------------------------------

create_image_folder()
settings = load_settings()
profile = settings["profile"]
saved_images = get_saved_images()

# アップロード後に file_uploader を空にするための番号です。
# Streamlit では key が変わると、同じアップローダーでも新しい入力欄として扱われます。
if "uploader_key_number" not in st.session_state:
    st.session_state.uploader_key_number = 0

# 保存完了メッセージを再読み込み後にも表示するために使います。
if "save_message" not in st.session_state:
    st.session_state.save_message = ""

# プロフィール編集フォームの開閉状態です。
if "show_profile_editor" not in st.session_state:
    st.session_state.show_profile_editor = False

st.markdown(
    """
    <div class="instagram-topbar">
        <div class="instagram-logo">Instagram</div>
        <div class="topbar-actions">＋ ♡ ◯</div>
    </div>
    """,
    unsafe_allow_html=True,
)

profile_username = html.escape(profile["username"])
profile_display_name = html.escape(profile["display_name"])
profile_bio = html.escape(profile["bio"]).replace("\n", "<br>")
profile_avatar = profile_avatar_html(profile)

st.markdown(
    f"""
    <div class="profile-header">
        <div class="avatar-ring">
            <div class="avatar-inner">{profile_avatar}</div>
        </div>
        <div>
            <div class="profile-title-row">
                <div class="profile-name">{profile_username}</div>
            </div>
            <div class="profile-stats">
                <span><strong>{len(saved_images)}</strong> 投稿</span>
                <span><strong>3:4</strong> トリミング</span>
                <span><strong>local</strong> 保存</span>
            </div>
            <div class="profile-bio">
                <strong>{profile_display_name}</strong>
                {profile_bio}<br>
                画像は <code>images</code> フォルダに保存されます。
            </div>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

profile_action_columns = st.columns([1, 1, 3])

with profile_action_columns[0]:
    if st.button("プロフィールを編集"):
        st.session_state.show_profile_editor = not st.session_state.show_profile_editor

with profile_action_columns[1]:
    if st.button("編集を閉じる"):
        st.session_state.show_profile_editor = False

if st.session_state.show_profile_editor:
    st.markdown(
        """
        <div class="editor-panel">
            <div class="editor-title">プロフィール編集</div>
            <div class="editor-note">名前、表示名、自己紹介、プロフィール写真を変更できます。</div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # st.form を使うと、入力途中で毎回画面が再読み込みされず、保存ボタンでまとめて反映できます。
    with st.form("profile_editor"):
        edited_username = st.text_input("ユーザー名", value=profile["username"])
        edited_display_name = st.text_input("表示名", value=profile["display_name"])
        edited_bio = st.text_area("自己紹介", value=profile["bio"], height=90)
        edited_avatar = st.text_input("画像未設定時のアイコン", value=profile["avatar"], max_chars=4)
        uploaded_profile_image = st.file_uploader(
            "プロフィール写真",
            type=ALLOWED_EXTENSIONS,
            accept_multiple_files=False,
        )

        if st.form_submit_button("プロフィールを保存", type="primary"):
            profile_image_path = profile.get("profile_image", "")

            if uploaded_profile_image is not None:
                profile_image_path = str(save_profile_image(uploaded_profile_image))

            settings["profile"] = {
                "username": edited_username.strip() or DEFAULT_PROFILE["username"],
                "display_name": edited_display_name.strip() or DEFAULT_PROFILE["display_name"],
                "bio": edited_bio.strip() or DEFAULT_PROFILE["bio"],
                "avatar": edited_avatar.strip() or DEFAULT_PROFILE["avatar"],
                "profile_image": profile_image_path,
            }
            save_settings(settings)
            st.session_state.show_profile_editor = False
            st.success("プロフィールを保存しました。")
            st.rerun()

    if profile.get("profile_image"):
        if st.button("プロフィール写真を削除"):
            old_profile_image = Path(profile["profile_image"])

            if old_profile_image.exists():
                old_profile_image.unlink(missing_ok=True)

            settings["profile"]["profile_image"] = ""
            save_settings(settings)
            st.success("プロフィール写真を削除しました。")
            st.rerun()

st.markdown(
    """
    <div class="upload-panel">
        <div class="upload-title">新しい投稿画像を追加</div>
        <div class="upload-note">PNG / JPG / JPEG / WEBP に対応しています。</div>
    </div>
    """,
    unsafe_allow_html=True,
)

# 画像アップロード欄です。
# accept_multiple_files=True にすると、複数の画像をまとめて追加できます。
uploaded_files = st.file_uploader(
    "画像をアップロード",
    type=ALLOWED_EXTENSIONS,
    accept_multiple_files=True,
    key=f"image_uploader_{st.session_state.uploader_key_number}",
    label_visibility="collapsed",
)

if st.session_state.save_message:
    st.success(st.session_state.save_message)
    st.session_state.save_message = ""

if uploaded_files:
    for uploaded_file in uploaded_files:
        save_uploaded_image(uploaded_file)

    st.session_state.save_message = f"{len(uploaded_files)}件の画像を保存しました。"
    st.session_state.uploader_key_number += 1

    # 保存後すぐに一覧へ反映し、アップローダーの中身を空にするために再読み込みします。
    st.rerun()

st.markdown(
    """
    <div class="profile-tabs">
        <span>▦ POSTS</span>
        <span>□ REELS</span>
        <span>⌑ TAGGED</span>
    </div>
    """,
    unsafe_allow_html=True,
)

if not saved_images:
    st.markdown(
        """
        <div class="empty-grid">
            <strong>まだ画像がありません</strong>
            上のアップロード欄から画像を追加すると、ここに3:4の縦長トリミング済みサムネイルとして表示されます。
        </div>
        """,
        unsafe_allow_html=True,
    )
else:
    # Instagramのプロフィールグリッドに近い、3列レイアウトで表示します。
    columns = st.columns(3)

    for index, image_path in enumerate(saved_images):
        column = columns[index % 3]

        with column:
            show_thumbnail(image_path)

            st.markdown(
                f'<div class="crop-caption">{html.escape(image_path.name)}</div>',
                unsafe_allow_html=True,
            )

            # 画像ごとのトリミング調整欄です。
            # streamlit-cropper を使うと、画像上の枠をドラッグして位置とサイズを調整できます。
            with st.expander("3:4トリミングをドラッグで編集"):
                if st_cropper is None:
                    st.warning(
                        "ドラッグ編集を使うには streamlit-cropper が必要です。"
                        " `pip install -r requirements.txt` を実行してください。"
                    )
                else:
                    st.markdown(
                        """
                        <div class="crop-note">
                            画像上の3:4縦長枠をドラッグして位置を動かせます。角をドラッグすると範囲を広げたり狭めたりできます。
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )

                    original_image = open_image(image_path)
                    cropped_image = st_cropper(
                        original_image,
                        realtime_update=True,
                        box_color="#0095f6",
                        aspect_ratio=(3, 4),
                        key=f"drag_cropper_{image_path.name}",
                    )

                    if st.button("このトリミングで保存", key=f"save_crop_{image_path.name}"):
                        crop_path = cropped_image_path(image_path)
                        cropped_image.save(crop_path)
                        st.success("3:4トリミングを保存しました。")
                        st.rerun()

            # 各画像の下に削除ボタンを置きます。
            # key を指定すると、Streamlit がボタンを区別できます。
            if st.button("削除", key=f"delete_{image_path.name}"):
                image_path.unlink(missing_ok=True)
                cropped_image_path(image_path).unlink(missing_ok=True)
                settings["crops"].pop(image_path.name, None)
                save_settings(settings)
                st.success(f"{image_path.name} を削除しました。")
                st.rerun()
