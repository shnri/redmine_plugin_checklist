RedmineApp::Application.routes.draw do
  resources :issues do
    resources :checklist_items, only: [:index, :create, :update, :destroy] do
      collection do
        put 'bulk_update'  # 一括更新のカスタムアクション
      end
    end
  end
end