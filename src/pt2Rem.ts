import * as vscode from 'vscode'
import { configKey } from './constant'

const install = () => {
    let config = vscode.workspace.getConfiguration(configKey)

    if (!config || ('enabled' in config&&!config.enabled)) {
        return
    }

    let key = 'pt2rem'
    let types = Object.assign({
        pt2rem: {
            cal: `{num}*20/375`,
            after: 'rem',
            before: ''
        }
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
                let cal = types[st].cal || types[st];
                vscode.window.showInputBox({
                    placeHolder: '输入设计稿pt'
                }).then(v => {
                    if (!v) return;
                    let nv = eval(cal.replace('{num}', v));
                    nv = (+nv).toFixed(4)
                    e.textEditor.edit(eb => {
                        eb.replace(r, (types[st].before || '') + nv + (types[st].after || ''))
                    })
                })
            })
    })
}

const watch = () => {
    install();
    return vscode.workspace.onDidChangeConfiguration(() => {
        install()
    })
}

export {
    watch
}