class TodoManager {
    constructor(config, db) {
        this.config = config;
        this.db = db;
        this.todos = [];
        this.add = () => {
            let data = {
                name: this.config.name.value,
                tag: this.config.tag.value,
                content: this.config.content.value,
            };
            this.todos.push(data);
            this.db.getStore("todos").then((store) => {
                store.add(data);
            });
            this.config.content.value = "";
            this.config.name.value = "";
            this.render();
        };
        this.del = (e) => {
            this.todos = this.todos.filter((obj) => obj.name != e);
            this.db.getStore("todos").then((store) => store.delete(e));
            this.render();
        };
        this.getAll = () => {
            this.db.getStore("todos").then((store) => {
                store.getAll().onsuccess = (e) => {
                    this.todos = e.target.result;
                    this.render();
                };
            });
        };
        this.render = (list = this.todos) => {
            let tag = this.config.tag.value;
            if (tag != "All") {
                list = list.filter((todo) => todo.tag == tag);
            }
            this.config.list.innerHTML = "";
            if(list.length == 0) {
                this.config.list.innerHTML = "<p>No todos yet !</p>";
            }
            list.forEach((todo) => {
                var details = document.createElement("details");
                var summary = document.createElement("summary");
                var button = document.createElement("button");
                var p = document.createElement("p");
                summary.innerHTML = todo.name + (todo.tag != "All" ? ` <kbd title="tag">#${todo.tag}</kbd>` : "");
                button.classList = "fa-solid fa-trash";
                button.onclick = () => this.del(todo.name);
                p.innerHTML = todo.content;
                summary.appendChild(button);
                details.appendChild(summary);
                details.appendChild(p);
                this.config.list.appendChild(details);
            });
        };
    }
}

class TagManager {
    constructor(config, db) {
        this.config = config;
        this.tags = [];
        this.db = db;
        this.db.getStore("tags").then((store) => {
            store.getAll().onsuccess = (e) => {
                var res = e.target.result[0];
                this.tags = res ? res.content : [];
                this.render(["All"].concat(this.tags));
            };
        });
        this.add = () => {
            let tag = this.config.tag.value;
            if (!this.tags.includes(tag)) {
                this.tags.push(tag);
                this.update();
            }
        };
        this.del = (tag) => {
            this.tags = this.tags.filter((t) => t != tag);
            this.update();
        };
        this.update = () => {
            this.db.getStore("tags").then((store) => store.delete("tags"));
            this.db.getStore("tags").then((store) => store.add({
                name: "tags",
                content: this.tags,
            }));
            this.render(["All"].concat(this.tags));
        };
        this.render = (tags = this.tags) => {
            this.config.list.innerHTML = "";
            this.config.selector.innerHTML = "";
            if(tags.length == 1) {
                this.config.list.innerHTML = "<p>No tags yet !</p>";
            }
            tags.forEach((tag) => {
                var option = document.createElement("option");
                var span = document.createElement("span");
                var button = document.createElement("button");
                option.innerHTML = tag;
                option.value = tag;
                button.classList = "fa-solid fa-trash";
                button.onclick = () => this.del(tag);
                span.innerHTML = tag;
                span.appendChild(button);
                this.config.selector.appendChild(option);
                if(tag != "All") this.config.list.appendChild(span);
            });
        }
    }
}

class ThemeManager {
    constructor(themes) {
        this.themes = themes;
        this.theme = localStorage.getItem("theme") || "light";
        this.switch = () => {
            if (this.theme == "light") {
                localStorage.setItem("theme", "dark");
                this.theme = "dark";
            } else {
                localStorage.setItem("theme", "light");
                this.theme = "light";
            }
            this.apply();
        }
        this.apply = () => {
            var properties = Object.keys(this.themes[this.theme]);
            properties.forEach((property) => {
                document.querySelector(":root").style.setProperty(`--${property}`, this.themes[this.theme][property]);
            });
            let root = document.head.querySelector("meta[name='theme-color']");
            setInterval(() => {
                let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                if (viewportWidth > 600) {
                    root.setAttribute("content", this.themes[this.theme]["primary"]);
                } else {
                    root.setAttribute("content", this.themes[this.theme]["secondary"]);
                }

            }, 100);

        }
    }
}

function switchView (switcher) {
    let main = document.querySelector("#main");
    let manage = document.querySelector("#manage");
    if (manage.style.display == "none") {
        switcher.innerHTML = '<i class="fas fa-home"></i>';
        switcher.title = "Main";
        main.style.display = "none";
        manage.style.display = "block";
    } else {
        switcher.innerHTML = '<i class="fas fa-tags"></i>';
        switcher.title = "Manage Tags";
        main.style.display = "block";
        manage.style.display = "none";
    }
}

// on CTRL + K focus config.name and on CTRL + L focus config.content
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        switch (e.key) {
            case "k":
                config.name.focus();
                break;
            case "l":
                config.content.focus();
                break;
        }
    }
});