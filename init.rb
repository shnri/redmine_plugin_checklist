Redmine::Plugin.register :check_list do
  name 'Check List plugin'
  author 'shinri'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'http://example.com/path/to/plugin'
  author_url 'http://example.com/about'
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