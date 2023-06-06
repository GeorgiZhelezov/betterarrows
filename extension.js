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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
let timeout = null;
function triggerUpdateDecorations(editor) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => updateDecorations(editor), 500);
}
function updateDecorations(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        const languageId = editor.document.languageId;
        if (languageId === 'c' || languageId === 'cpp') {
            const regex = /\.\./g;
            const text = editor.document.getText();
            let match;
            const edits = [];
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
                yield editor.edit(editBuilder => {
                    for (const edit of edits) {
                        editBuilder.replace(edit.range, edit.newText);
                    }
                });
            }
        }
        else if (languageId === 'javascript' || languageId === 'typescript' || languageId === 'jsx' || languageId === 'tsx' || languageId === 'csharp') {
            const regex = /\.\./g;
            const text = editor.document.getText();
            let match;
            const edits = [];
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
                yield editor.edit(editBuilder => {
                    for (const edit of edits) {
                        editBuilder.replace(edit.range, edit.newText);
                    }
                });
            }
        }
    });
}
function isWithinCodeBlock(document, position) {
    return __awaiter(this, void 0, void 0, function* () {
        const symbols = yield vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
        if (symbols) {
            for (const symbol of symbols) {
                if (symbol.range && symbol.range.contains(position)) {
                    return true;
                }
            }
        }
        return false;
    });
}
function activate(context) {
    let activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        triggerUpdateDecorations(activeEditor);
    }
    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations(editor);
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations(activeEditor);
        }
    }, null, context.subscriptions);
    if (vscode.window.activeTextEditor) {
        triggerUpdateDecorations(vscode.window.activeTextEditor);
    }
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
