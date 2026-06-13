# Instagram Thumbnail Board

Python と Streamlit で作った、Instagram投稿サムネイル確認用のローカルアプリです。

## Features

- 画像アップロード
- `images` フォルダへのローカル保存
- Instagramプロフィール風の一覧表示
- 3:4の縦長サムネイル確認
- ドラッグ操作による3:4トリミング編集
- プロフィール編集
- プロフィール写真アップロード
- 画像ごとの削除

## Setup

```bash
python3 -m pip install -r requirements.txt
```

## Run

React 版（貼り付けコードの実装）:

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000/` を開きます。

Streamlit 版:

```bash
python3 -m streamlit run app.py
```

ブラウザで `http://localhost:8501` を開きます。

## Notes

アップロード画像、トリミング済み画像、プロフィール画像、ローカル設定はGitHubには含めないように `.gitignore` で除外しています。
