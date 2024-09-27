class ChecklistItemsController < ApplicationController
  before_action :find_issue

  def index
    render json: @issue.checklist_items
  end

  def create
    @checklist_item = @issue.checklist_items.build(checklist_item_params)
    if @checklist_item.save
      render json: @checklist_item, status: :created
    else
      render json: { errors: @checklist_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @checklist_item = ChecklistItem.find(params[:id])
    if @checklist_item.update(checklist_item_params)
      render json: @checklist_item
    else
      render json: { errors: @checklist_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def checklist_item_params
    params.require(:checklist_item).permit(:description, :completed, :is_layer_open)
  end

  def find_issue
    @issue = Issue.find(params[:issue_id])
  end
end
