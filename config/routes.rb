resources :issues do
  resources :checklist_items, only: [:index, :create, :update]
end