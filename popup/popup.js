'use strict';

async function documentLoaded() {
    document.getElementById('settings-link').addEventListener('click', event => {
        browser.runtime.openOptionsPage();
        window.close();
        return false
    })


    const settings = await browser.storage.local.get(['toggles', 'general']);
    const toggles = settings.toggles;
    const type = settings.general.allowMultiple ? 'checkbox' : 'radio';
    let status = true;

    for (let i = 0; i < toggles.length; i++) {
        let state = toggles[i].state;
        if (state) status = false;
        if (!toggles[i].enabled) continue;
        addSelectRow(type, i + 1, toggles[i].name, state)
    }

    if (type == "radio") {
        addSelectRow(type, 'none', 'None', status)
    }
}

function addSelectRow(type, styleId, name, state) {
    let container = document.createElement('div');
    let selector = document.createElement('input');
    container.appendChild(selector);
    selector.type = type;
    selector.id = `select-${styleId}`;
    selector.name = 'style';
    selector.checked = state
    selector.addEventListener('change', event => {
        console.log('Changed', event.target.id);
        browser.extension.getBackgroundPage().userToggle(event.target.id, event.target.checked);
    });

    let label = document.createElement('label');
    container.appendChild(label);
    label.htmlFor = `select-${styleId}`;
    label.textContent = name;

    document.getElementById('content').appendChild(container);

}
document.addEventListener('DOMContentLoaded', documentLoaded);