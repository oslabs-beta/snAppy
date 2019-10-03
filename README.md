# snAppy

snAppy is a VS Code extension coupled with an interactive view to support your React front-end delivery. It automates dynamic and vendor code-splitting all within your workspace.  

### Features

snAppy includes Webpack configuration and bundling, automated dynamic/vendor code-splitting, and exporting of webpack.config.js and bundle report files. snAppy works on top of your code base, never deleting your code and you may choose to keep/delete any changes made. 

(gif/demo coming soon)

### Getting Started

#### Extension Settings

Pull down the Command Palette in your workspace/project and search: snAppy: Start on Current Workspace. Turn on auto-save to allow for rebundle of your application after optimizations have been made. You may still undo any changes afterwards. 

#### How to Use

As recommended by the Webpack documentation, please name your output folder as "dist" and include your index.html inside. The script source should be "bundle.js". For the entry path within the Webview, please supply the relative path from the workspace's root folder to index.js. Please see below: 

![Image of snAppy Entry](https://i.imgur.com/ziSu0DY.png)

### Contributing and Issues
We are always looking to improve. If there are any contributions or issues you have, please check out our documentation to submit. 

#### Release Notes
Created by: Courtney Kwong, Jackie Lin, Olga Naumova, Rachel Park
<br>0.5.0 | Initial release of snAppy. More to come! 

