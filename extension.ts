import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        updateDecorations(activeEditor);
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            updateDecorations(editor);
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            updateDecorations(activeEditor);
        }
    }, null, context.subscriptions);
}

const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
        contentText: '->'
    }
});

function updateDecorations(editor: vscode.TextEditor) {
    const text = editor.document.getText();
    const decorations: vscode.DecorationOptions[] = [];

    const languageId = editor.document.languageId;

    if (languageId === 'c' || languageId === 'cpp') {
        const regex = /\.\./g;

        let match;
        while ((match = regex.exec(text))) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);
            const decoration = { range, hoverMessage: 'Replaced with ->' };
            decorations.push(decoration);

            const edit = vscode.TextEdit.replace(range, '->');
            editor.edit(editBuilder => {
                editBuilder.replace(range, '->');
            });
        }
    } else if (languageId === 'javascript' || languageId === 'typescript' || languageId === 'jsx' || languageId === 'tsx' || languageId === 'csharp') {
        const regex = /\.\./g;

        let match;
        while ((match = regex.exec(text))) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);
            const decoration = { range, hoverMessage: 'Replaced with =>' };
            decorations.push(decoration);

            const edit = vscode.TextEdit.replace(range, '=>');
            editor.edit(editBuilder => {
                editBuilder.replace(range, '=>');
            });
        }
    }

    editor.setDecorations(decorationType, decorations);
}






