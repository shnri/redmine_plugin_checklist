module IssuePatch
  def self.included(base)
    base.class_eval do
      has_many :checklist_items
    end
  end
end

# Issue モデルにパッチを適用
Issue.include IssuePatch