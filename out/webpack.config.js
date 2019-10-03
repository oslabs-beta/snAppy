const path = require('path');
              module.exports ={ entry:
   { main:
      '/Users/jackie/Documents/Codesmith/production-project-sept-2019/soloproject/src/client/index.js' },
  mode: 'development',
  output:
   { filename: 'bundle.js',
     path:
      '/Users/jackie/Documents/Codesmith/production-project-sept-2019/soloproject/dist' },
  resolve: { extensions: [ '.jsx', '.js', '.ts', '.tsx', '.json' ] },
  module:
   { rules:
      [ { test: /\.css$/i, use: [ 'style-loader', 'css-loader' ] },
        { test: /\.(js|jsx)$/,
          use:
           [ { loader: 'babel-loader',
               options:
                { presets: [ '@babel/preset-env', '@babel/preset-react' ],
                  plugins: [ '@babel/plugin-proposal-class-properties' ] } } ],
          exclude: '/node_modules/' } ] } }