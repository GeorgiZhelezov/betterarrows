"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
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
exports.activate = activate;
const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
        contentText: '->'
    }
});
function updateDecorations(editor) {
    const text = editor.document.getText();
    const decorations = [];
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
    }
    else if (languageId === 'javascript' || languageId === 'typescript' || languageId === 'jsx' || languageId === 'tsx' || languageId === 'csharp') {
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
