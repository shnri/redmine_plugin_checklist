# Check List Plugin for Redmine

**Check List Plugin** は、Redmineの課題管理機能を拡張し、各チケットにチェックリスト項目を追加できるようにするプラグインです。

## 目次

- [特徴](#特徴)
- [インストール方法](#インストール方法)
  - [手順](#手順)
  - [動作確認バージョン](#動作確認バージョン)
- [スクリーンショット](#スクリーンショット)
- [ライセンス](#ライセンス)

## 特徴

- **チェックリストの追加**: 各課題に対して複数のチェックリスト項目を追加可能。
- **階層構造**: チェックリスト項目にサブタスクを作成し、階層的に管理。
- **並べ替え**: ドラッグアンドドロップでチェックリストの並べ替えが可能。

## インストール方法

### 手順

1. **プラグインのダウンロード**

   Redmineのプラグインディレクトリに移動し、GitHubからプラグインをクローンします。
   ```bash
   cd /path/to/redmine/plugins
   git clone https://github.com/shnri/redmine_plugin_checklist.git

2. **ビルド**
   
   プラグインのディレクトリに移動して、ビルドを実行します。
   ```bash
   cd /path/to/redmine/plugins/check_list
   npm run build

4. **アセットのプリコンパイル**
   
   Redmineのルートディレクトリに移動し、アセットをプリコンパイルします。
   ```bash
   cd /path/to/redmine/
   bundle exec rake redmine:plugins:assets RAILS_ENV=production

6. **データベースのマイグレーション**

   データベースのマイグレーションを実行します。
   ```bash
   bundle exec rake redmine:plugins:migrate RAILS_ENV=production

8. **Redmineの再起動**
   
   サーバーを再起動して変更を適用します。
   ```bash
   systemctl restart redmine

### 動作確認バージョン

- **Redmine バージョン**: `5.1.3`
- **Ruby バージョン**: `3.1.6`

## スクリーンショット

![Check List](https://github.com/shnri/redmine_plugin_checklist/blob/master/img/checklist.png)

## ライセンス
このプラグインは MITライセンス の下で公開されています。詳細については、LICENSE ファイルを参照してください。
