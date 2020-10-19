##MANUAL TECNICO olc2proy2
### Configuraciones de jison
-  Agregar estas lineas al archivo package.json:
"browser": { "fs": false, "path": false, "os": false}

### Subir a github pages
- https://www.notion.so/Github-Pages-b7ee023c66654ad1961945fa0f51c4ef

### PARA INSTALAR EL EDITOR CODEMIRROR
- npm install codemirror
- npm install bootstrap
- https://www.npmjs.com/package/@ctrl/ngx-codemirror
- esto es para quitar un warning se agrega codemirror en allowedCommonJsDependencies:

			"options": {
            "allowedCommonJsDependencies": [
                "codemirror",
                "@ctrl/ngx-codemirror"
            ],
            "outputPath": "dist/aplicacion",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "aot": true,
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],  

### PARA AGREGAR JISON A ANGULAR
- https://stackoverflow.com/questions/53195072/how-to-include-jison-into-angular

### Para agregar graphiz
- npm i d3-graphviz
- component.ts
```javascript
import { graphviz }  from 'd3-graphviz';
import { wasmFolder } from "@hpcc-js/wasm";
graficarAST(){
		wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@0.3.13/dist');
		graphviz('span').renderDot('digraph {a -> b}');
}
	  ```
- html
```html
<!DOCTYPE html>
<div style="text-align:center">
	<h1>AST  </h1>
	<span class="ast" style="text-align:center">
	</span>
</div>
```


