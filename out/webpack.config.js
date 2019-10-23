const path = require('path');
              module.exports ={ entry:
   { main:
      '/Users/courtneykwong/Documents/Codesmith/Projects/soloproject/src/client/index.js' },
  mode: 'development',
  output:
   { filename: 'bundle.js',
     path:
      '/Users/courtneykwong/Documents/Codesmith/Projects/soloproject/dist' },
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