'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

//Método para la activación de la extensión, se requiere para cumplir con la interface Extension
//context es una instancia de ExtensionContext la cual es provista automaticamente por vscode al inicializar la extensión
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.gapline', () => {
		// The code you place here will be executed every time your command is executed
		
		//Se selecciona la ventana activa del editor de código abierto por el usuario
		var editor = vscode.window.activeTextEditor;
		//se valida que exista un editor abierto, en caso contrario termina la ejecución
        if (!editor) { return; }
		//Se obtiene la selección del contenido de la ventana del editor
        var selection = editor.selection;
		//Se obtiene el texto de la selección
        var text = editor.document.getText(selection);

		//Se muestra al usuario una caja de entrada de texto preguntando por un número de líneas
        vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => {
			//se incrementa el valor recibido como string para convertirlo en un valor de número
            let numberOfLines = +value;
			//Se inicializa un array que albergará las líneas de la selección del editor
            var textInChunks: Array<string> = [];

			//Se obtiene un array cuyos elementos son cada una de las líneas del texto y se recorren en un bucle pasando como argumentos a una función tanto el texto como el número de línea
            text.split('\n').forEach((currentLine: string, lineIndex) => {
				//se ingresa al arreglo la línea actual
                textInChunks.push(currentLine);
				//Si el número de línea ( +1 para hacerlo 'one based') es múltiplo del valor de líneas ingresado por el usuario, entonces se ingresa una cadena vacía al arreglo de lineas
                if ((lineIndex+1) % numberOfLines === 0) textInChunks.push('');
            });

			//Todas las líneas del array (las del texto original como las intercaladas) se concatenan en un solo texto utilizando el caracter de nueva línea como separador
            text = textInChunks.join('\n');

			//Se invoca a la función editar de la ventana del editor de texto actual...
            editor.edit((editBuilder) => {
				//seleccionando el rango total del texto original, desde la posición 0 de la línea inicial del rango hasta la última posición de la última línea del rango
                var range = new vscode.Range(
                    selection.start.line, 0, 
                    selection.end.line,
                    editor.document.lineAt(selection.end.line).text.length
                );
				//Se reemplaza el texto original por el texto con las líneas intercaladas
                editBuilder.replace(range, text);
            });
        })
    });
	//Se ingresa al array de subscriptions los elementos que pueden desecharse al no ser requeridos después de la inicialización
    context.subscriptions.push(disposable);
}

//función a ejecutar cuando la extensión se desactiva, no es requerida de manera forsoza por la interface Extension, pero se utiliza de manera regular para limpiar archivos temporales o caché antes de ser eliminada
//https://code.visualstudio.com/api/get-started/extension-anatomy
export function deactivate() { }
