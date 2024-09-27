Redmine::Plugin.register :check_list do
  name 'Check List plugin'
  author 'shinri'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'https://github.com/shnri/redmine_plugin_checklist'
  author_url 'https://github.com/shnri'
end

# Railsの初期化後に実行されるようにする
Rails.configuration.to_prepare do
  if Rails.configuration.respond_to?(:assets)
    # アセットパスの追加
    Rails.application.config.assets.paths << File.expand_path("assets/javascripts", __dir__)
    Rails.application.config.assets.paths << File.expand_path("assets/stylesheets", __dir__)

    # プリコンパイル対象のファイルを指定
    Rails.application.config.assets.precompile += %w(index.js index.css)
  end
end

Redmine::Hook::ViewListener.instance_eval do
  render_on :view_issues_show_description_bottom, :partial => 'plugin_folder/react_mount'
end
