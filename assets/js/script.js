const config = {
    name: document.querySelector("#name"),
    content: document.querySelector("#content"),
    tag: document.querySelector("#tag-selector"),
    list: document.querySelector("#todo-list"),
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
idb.openStore("tages", "name");
idb.openStore("tags", "name");

// var settings = new IDB("todo", { version: 2 });
// settings.open("settings", "key");

var todoManager = new TodoManager(config, idb);
var tagManager = new TagManager({
        tag: document.querySelector("#tag"),
        selector: document.querySelector("#tag-selector"),
        list: document.querySelector("#tag-list"),
        todoManager
    }, idb);
var themeManager = new ThemeManager(config.themes);
themeManager.apply();
config.tag.onchange = () => {
    todoManager.render();
};

document.querySelector("#manage").style.display = "none";    
document.addEventListener("DOMContentLoaded", todoManager.getAll);
