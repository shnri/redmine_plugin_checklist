class CreateChecklistItems < ActiveRecord::Migration[6.1]
  def change
    create_table :checklist_items, id: false do |t|
      t.string :task_id, null: false, primary_key: true      # UUIDを使ったタスクID
      t.integer :issue_id, null: false, index: true          # チケット(issue)との関連付け
      t.string :label, null: false                           # チェックリストの項目名
      t.boolean :checked, default: false                     # 完了済みかどうか
      t.boolean :is_layer_open, null: false                  # 項目が展開されているか
      t.string :parent_id, index: true                       # 親項目への参照 (taskIdで管理)
      t.integer :position, null: false, default: 0           # 順序を示すposition

      t.timestamps                                           # 作成日時と更新日時
    end

    # 外部キー制約の追加
    add_foreign_key :checklist_items, :issues, column: :issue_id
    add_foreign_key :checklist_items, :checklist_items, column: :parent_id, primary_key: :task_id
  end
end
