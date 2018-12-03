import * as vscode from 'vscode'
import { configKey } from './constant'

const install = () => {
    let config = vscode.workspace.getConfiguration(configKey)

    // if (!config || !config.enabled) {
    //     return
    // }

    let key = 'pt2rem'

    let bw = config.baseWidth || 375
    let aimRem = config.aimRem || 20;

    let types = Object.assign({
        pt2rem: `{num}*${aimRem}/${bw}`
    }, config.types);

    let ps = Object.keys(types)



    vscode.window.onDidChangeTextEditorSelection(e => {
        let sel = e.selections[0];
        if (!sel) return;
        let end = sel.end;
        if (end.character < key.length) {
            return;
        }

        let start = new vscode.Position(end.line, end.character - key.length)
        let r = new vscode.Range(start, end)
        let doc = e.textEditor.document
        let str = doc.getText(r)
        if (str == key)
            vscode.window.showQuickPick(ps).then(st => {
                if (!st) {
                    return
                }
                let cal = types[st];
                vscode.window.showInputBox({
                    placeHolder: '输入设计稿pt'
                }).then(v => {
                    if (!v) return;
                    let nv = eval(cal.replace('{num}', v));
                    nv = (+nv).toFixed(4)
                    e.textEditor.edit(eb => {
                        eb.replace(r, nv + 'rem')
                    })
                })
            })
    })
}

const watch = () => {
    install();
    return vscode.workspace.onDidChangeConfiguration(() => {
        // install()
    })
}

export {
    watch
}