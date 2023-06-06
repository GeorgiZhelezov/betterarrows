import * as vscode from 'vscode';

let timeout: NodeJS.Timer | null = null;

function triggerUpdateDecorations(editor: vscode.TextEditor) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => updateDecorations(editor), 500);
}

async function updateDecorations(editor: vscode.TextEditor) {
    const languageId = editor.document.languageId;

    if (languageId === 'c' || languageId === 'cpp') {
        const regex = /\.\./g;

        const text = editor.document.getText();
        let match;
        const edits: vscode.TextEdit[] = [];
        while ((match = regex.exec(text))) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            if (!isWithinCodeBlock(editor.document, startPos)) {
                // Skip if not within a code block
                continue;
            }

            const edit = vscode.TextEdit.replace(range, '->');
            edits.push(edit);
        }

        if (edits.length > 0) {
            await editor.edit(editBuilder => {
                for (const edit of edits) {
                    editBuilder.replace(edit.range, edit.newText);
                }
            });
        }
    } else if (languageId === 'javascript' || languageId === 'typescript' || languageId === 'jsx' || languageId === 'tsx' || languageId === 'csharp') {
        const regex = /\.\./g;

        const text = editor.document.getText();
        let match;
        const edits: vscode.TextEdit[] = [];
        while ((match = regex.exec(text))) {
            const startPos = editor.document.positionAt(match.index);
            const endPos = editor.document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);

            if (!isWithinCodeBlock(editor.document, startPos)) {
                // Skip if not within a code block
                continue;
            }

            const edit = vscode.TextEdit.replace(range, '=>');
            edits.push(edit);
        }

        if (edits.length > 0) {
            await editor.edit(editBuilder => {
                for (const edit of edits) {
                    editBuilder.replace(edit.range, edit.newText);
                }
            });
        }
    }
}

async function isWithinCodeBlock(document: vscode.TextDocument, position: vscode.Position): Promise<boolean> {
    const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider',
        document.uri
    );

    if (symbols) {
        for (const symbol of symbols) {
            if (symbol.range && symbol.range.contains(position)) {
                return true;
            }
        }
    }

    return false;
}


export function activate(context: vscode.ExtensionContext) {
    let activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
        triggerUpdateDecorations(activeEditor);
    }

    vscode.window.onDidChangeActiveTextEditor(
        editor => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateDecorations(editor);
            }
        },
        null,
        context.subscriptions
    );

    vscode.workspace.onDidChangeTextDocument(
        event => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations(activeEditor);
            }
        },
        null,
        context.subscriptions
    );

    if (vscode.window.activeTextEditor) {
        triggerUpdateDecorations(vscode.window.activeTextEditor);
    }
}

export function deactivate() { }
