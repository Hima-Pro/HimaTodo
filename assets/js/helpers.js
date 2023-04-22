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
            if (data.name == "") {
                alert('todo name can\'t be empty !');
            } else {
                this.todos.push(data);
                this.db.getStore("todos").then((store) => {
                    store.add(data);
                });
                this.config.content.value = "";
                this.config.name.value = "";
                this.render();
                switchView("home");
            }
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
                this.config.list.innerHTML = "<img class='empty' src='assets/images/empty.png'><p>No todos yet !</p>";
            }
            list.forEach((todo) => {
                var details = document.createElement("details");
                var summary = document.createElement("summary");
                var button = document.createElement("button");
                var p = document.createElement("pre");
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
            store.get("tags").onsuccess = (e) => {
                var res = e.target.result;
                this.tags = res ? res.content : [];
                this.render(["All"].concat(this.tags));
            };
            store.get("current").onsuccess = (e) => {
                var res = e.target.result;
                if(res) this.config.selector.value = this.tags.includes(res.content) ? res.content : "All";
                this.config.todoManager.render();
            };

        });
        this.add = () => {
            let tag = this.config.tag;
            if (tag.value == "") {
                alert('tag name can\'t be empty !');
            } else {
                if (!["All"].concat(this.tags).includes(tag.value)) {
                    this.tags.push(tag.value);
                    tag.value = "";
                    this.update();
                } else {
                    alert("tag already exists !");
                }
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
                this.config.list.innerHTML = "<img class='empty' src='assets/images/empty.png'><p>No tags yet !</p>";
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
    constructor(config) {
        this.themes = config.themes;
        this.theme = localStorage.getItem("theme") || config.theme;
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

function switchView (name="home") {
    let views = document.querySelectorAll("center.container > section");
    let targetView = document.querySelector("center.container > section." + name);
    let tabs = document.querySelectorAll("#nav > .tab");
    let targetTab = document.querySelector("#nav > .tab." + name);
    views.forEach((view) => {
        view.style.display = "none";
    });
    targetView.style.display = "block";
    tabs.forEach((tab) => {
        tab.classList.remove("active");
    });
    targetTab.classList.add("active");
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