import esbuild from 'esbuild';
import postCssPlugin from 'esbuild-postcss';

const isProduction = process.env.NODE_ENV === 'production';

// 共通の設定オブジェクトを作成
const commonConfig = {
  bundle: true,
  sourcemap: true,
  loader: { '.png': 'file', '.svg': 'file' },
  plugins: [postCssPlugin()],
  target: ['es2015'],
  logLevel: 'info',
  define: { 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"' },
};

// JavaScriptのビルド設定
esbuild.build({
  ...commonConfig,
  entryPoints: ['app/javascript/packs/index.tsx'],
  outdir: 'assets/javascripts', // 出力ディレクトリ
  outbase: 'app/javascript/packs', // エントリーポイントからの共通パス
  entryNames: '[name]', // 出力ファイル名をエントリーポイントのファイル名にする
}).catch(() => process.exit(1));

// CSSのビルド設定
esbuild.build({
  ...commonConfig,
  entryPoints: ['app/javascript/packs/index.css'],
  outdir: 'assets/stylesheets',
  outbase: 'app/javascript/packs',
  entryNames: '[name]',
}).catch(() => process.exit(1));
