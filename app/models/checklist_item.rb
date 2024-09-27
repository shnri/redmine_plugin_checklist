class ChecklistItem < ActiveRecord::Base
  belongs_to :issue
  belongs_to :parent, class_name: 'ChecklistItem', optional: true
  has_many :children, class_name: 'ChecklistItem', foreign_key: 'parent_id'

  validates :description, presence: true
end
