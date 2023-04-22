const config = {
    name: document.querySelector("#name"),
    content: document.querySelector("#content"),
    tag: document.querySelector("#tag-selector"),
    list: document.querySelector("#todo-list"),
    theme: "light",
    themes: {
        light: {
            "color-accent": "#0099ff",
            "primary": "#ffffff",
            "secondary": "#ffffff",
            "shadow": "#00000033",
            "font": "#131313"
        },
        dark: {
            "color-accent": "#0099ff",
            "primary": "#444",
            "secondary": "#313131",
            "shadow": "#00000033",
            "font": "#ffffff"
        }
    }
};

var idb = new IDB("HimaTodoAPP");
idb.openStore("todos", "name");
idb.openStore("tags", "name");

var todoManager = new TodoManager(config, idb);
var tagManager = new TagManager({
    tag: document.querySelector("#tag"),
    selector: document.querySelector("#tag-selector"),
    list: document.querySelector("#tag-list"),
    todoManager
}, idb);

var themeManager = new ThemeManager(config);
themeManager.apply();

config.tag.onchange = () => {
    todoManager.render();
    idb.getStore("tags").then((store) => store.delete("current"));
    idb.getStore("tags").then((store) => store.add({
        name: "current",
        content: config.tag.value
    }));
};
switchView();

document.addEventListener("DOMContentLoaded", todoManager.getAll);
