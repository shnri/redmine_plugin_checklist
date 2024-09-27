class CreateChecklistItems < ActiveRecord::Migration[6.1]
  def change
    create_table :checklist_items do |t|
      t.integer :issue_id, null: false         # チケット(issue)との関連付け（integerに修正）
      t.string :description, null: false       # チェックリストの項目内容
      t.boolean :completed, default: false     # 完了済みかどうか
      t.boolean :is_layer_open, default: true  # 項目が展開されているか
      t.references :parent, foreign_key: { to_table: :checklist_items } # 親項目への参照
      t.timestamps                             # 作成日時と更新日時
    end

    add_foreign_key :checklist_items, :issues, column: :issue_id   # 外部キー制約を追加
  end
end
