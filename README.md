# React Boilerplate Code

- Express 기반으로 React App을 개발할 경우 사용하는 보일러플레이트 코드입니다.
- Webpack, Babel을 통해 React 코드를 빌드하도록 설정되어 있습니다.

## 사전준비
- node v10.0+
- npm v6.0+
- yarn v1.13.0+

## Boilerplate Code 작성가이드

1. `create-react-app`을 통한 기본코드 생성
    ```bash
    $ npx create-react-app [project name]
    ```

2. 가장 기본적인 파일을 제외하고는 모두 제거합니다.
    ```bash
    $ cd [project name]
    $ rm public/favicon.ico public/manifest.json
    $ rm src/App.css src/App.test.js src/logo.svg src/serviceWorker.js index.css
    ```

3. 제외한 코드들을 import 하는 부분들도 제거해줍니다. 위의 내용처럼 파일들을 삭제한 후 남은 3개 파일을 아래와같이 수정해줍니다.
    - `public/index.html`
        ```html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>React App</title>
        </head>
        <body>
            <div id="root"></div>
        </body>
        </html>
        ```
    - `src/App.js`
        ```js
        import React, { Component } from 'react';

        class App extends Component {
            render() {
                return (
                <div>
                    Hello, React Boilerplate
                </div>
                );
            }
        }

        export default App;
        ```
    - `src/index.js`
        ```js
        import React from 'react';
        import ReactDOM from 'react-dom';
        import App from './App';

        ReactDOM.render(<App />, document.getElementById('root'));
        ```

4. `webpack`과 `webpack-cli`를 설치합니다.
    ```bash
    $ yarn add -D webpack webpack-cli
    ```

5. `package.json`의 빌드 스크립트를 수정합니다.
    ```json
    "scripts": {
        "build": "webpack --mode production"
    }
    ```

6. `babel`과 `babel`에서 사용할 `preset`들, 그리고 `babel-loader`를 설치합니다.
    ```bash
    $ yarn add -D @babel/core babel-loader @babel/preset-env @babel/preset-react
    ```

7. 설치한 두 `preset`을 `.babelrc`라는 설정파일을 생성하고 적어줍니다.
    - 프로젝트의 최상단에 `.babelrc` 파일을 생성합니다.
        ```bash
        $ touch .babelrc
        ```
    - 생성된 `.babelrc` 파일에 아래 내용을 작성합니다.
        ```json
        {
            "presets": [
                "@babel/preset-env",
                "@babel/preset-react"
            ]
        }
        ```

8. `webpack` 설정을 위해 root 디렉토리에 `webpack.config.js`를 생성하고 `babel-loader`를 비롯한 설정을 해 줍니다.
    - 경로에 대한 설정을 좀 더 깔끔하게 할 수 있도록 `path` 패키지를 설치합니다.
        ```bash
        $ yarn add path
        ```
    - 프로젝트의 최상단에 `webpack.config.js` 파일을 생성합니다.
        ```bash
        $ touch webpack.config.js
        ```
    - 생성된 `webpack.config.js` 파일에 아래 내용을 작성합니다.
        ```js
        const path = require('path');
        const webpack = require('webpack');

        module.exports = {
            entry: {        // 시작 위치
                app: './src/index.js'
            },
            output: {       // 결과가 출력될 위치, [name]은 entry에 설정된 key 값
                filename: '[name].bundle.js',
                path: path.resolve(__dirname, 'public')
            },
            module: {       // 사용할 모듈과 모듈을 사용할 파일, 여기서는 babel-loader로 js와 jsx를 로드
                rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                }]
            },
            devServer: {    // webpack-dev-server 사용시 사용될 contentBase 디렉토리
                contentBase: './public',
                hot: true
            },
            plugins: [      // webpack-dev-server 의 hot-reloading을 위한 플러그인 설정
                new webpack.HotModuleReplacementPlugin()
            ]
        };
        ```

9. `webpack.HotModuleReplacementPlugin()`이 적용되도록 `src/index.js`의 가장 밑에 아래 내용을 추가합니다.
    ```js
    module.hot.accept()
    ```

10. `webpack.config.js`의 `output` 설정에 따라 `webpack`의 빌드 결과는 `public` 디렉토리에 `app.bundle.js`로 생성됩니다. 여기에 맞게 `public/index.html`에 해당 파일을 아래와 같이 import 해 줍니다.
    ```html
    <script src="./app.bundle.js"></script>
    ```

11. `webpack`을 통한 빌드나, `webpack-dev-server`에 대한 시작이 용이하도록 `package.json` 파일의 `scripts` 부분을 아래와 같이 수정합니다.
    ```json
    "scripts": {
        "start": "webpack-dev-server --open --mode development",
        "build": "webpack --mode production"
    }
    ```

12. 아래의 두 command를 통해 `webpack` 빌드 수행 여부와, `webpack-dev-server`의 실행 여부를 확인합니다.
    ```bash
    $ yarn build        # public 디렉토리 안에 app.bundle.js 가 생성되면 정상적으로 수행된 것입니다.
    $ yarn start        # 곧바로 브라우저가 열리고, App.js 의 내용 수정시 곧바로 반영되는지 확인됩니다. 
    ```

13. 서버 사이드를 `express`로 작성하기 위해 프로젝트의 최상단에 `server.js` 파일을 생성하고 내용을 작성합니다.
    - `express`에서 `html` 파일을 렌더링하기 위해서 `ejs` 패키지를 설치합니다.
        ```bash
        $ yarn add ejs
        ```
    - 프로젝트 최상단에 `server.js`를 생성합니다.
        ```bash
        $ touch server.js
        ```
    - `server.js` 파일에 아래 내용을 작성합니다.
        ```js
        const path = require('path');
        const express = require('express');
        const app = express();
        const port = 3000;

        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.set('views', path.resolve(__dirname, 'public'));
        app.set('view engine', 'ejs');
        app.engine('html', require('ejs').renderFile);

        app.use(express.static(path.resolve(__dirname, 'public')));

        app.get('/', (req, res, next) => {
            res.render('index.html');
        });

        app.listen(port, () => console.log(`Listen on port ${port}`));
        ```
    - 서비스 실행을 위해 아래 command를 실행합니다.
        ```bash
        $ node server.js
        ```
    - `server.js`가 `3000`번 포트로 listening 중이므로 브라우저에서 `localhost:3000`으로 접속하여 내용이 표시되는 것을 확인합니다.

14. 라우팅하는 파일들을 분리하고 싶을 경우 별도의 `routes` 디렉토리를 생성하고 아래쪽에 router 파일을 생성하고, `server.js`에 해당 라우터를 셋팅합니다.
    - `routes` 디렉토리와 `sample_router.js` 파일을 생성합니다.
        ```bash
        $ mkdir routes
        $ cd routes
        $ touch sample_router.js
        ```
    - `sample_router.js`에 아래 내용을 작성합니다.
        ```js
        const express = require('express');
        const router = express.Router();

        router.get('/', (req, res, next) => {
            res.send('Hello, I am sample router');
        });

        module.exports = router;
        ```
    - `sample_router.js` 사용을 위해, `server.js`에 아래 내용을 추가합니다.
        ```js
        app.use('/sample_router', require('./routes/sample_router'));
        ```
    - 서비스 실행을 위해 아래 command를 실행합니다.
        ```bash
        $ node server.js
        ```
    - 라우터가 제대로 적용되었는지 확인하기 위해, 브라우저를 통해 `localhost:3000/sample_router`에 접속하여 확인합니다.

15. 실제 서비스를 할 경우에는 `pm2`나 `forever` 등을 이용하는 것을 권장합니다.
    - `pm2` 설치
        ```bash
        $ yarn global add pm2
        ```
    - global로 `pm2`를 설치했음에도 불구하고 `pm2` 실행이 불가능할 경우, 환경변수 PATH에 `$HOME/.yarn/bin`을 추가해줍니다.
        ```bash
        $ export PATH=$PATH:$HOME/.yarn/bin
        ```
    - `pm2`로 서비스를 실행합니다
        ```bash
        $ pm2 start sever.js
        ```
    - 서비스 중지 및 삭제시에는 아래 command를 이용합니다.
        ```bash
        $ pm2 stop [App name]       # 서비스 중지
        $ pm2 delete [App name]     # 서비스 삭제
        ```
