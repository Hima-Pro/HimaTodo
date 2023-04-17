class IDB {
  constructor(name) {
    this.name = name;
    this.version = 1;
    this.db = null;
    this.openStore = (name, key) => {
      var req = window.indexedDB.open(this.name, this.version);
      this.version += 1;
      req.onupgradeneeded = (e) => {
        let db = e.target.result;
        console.log(db);
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: key });
        }
      };
      req.onsuccess = (e) => {
        this.db = e.target.result;
        this.db.onversionchange = () => {
          this.db.close();
          location.reload();
          console.log("Tell user to reload the page");
        };
      };
      return req;
    };
    this.deleteStore = (name) => {
      this.db.deleteObjectStore(name);
    };
    this.getStore = (name) => {
      return new Promise((resolve) => {
        if (this.db) {
          resolve(this.db.transaction([name], "readwrite").objectStore(name));
        } else {
          const interval = setInterval(() => {
            if (this.db) {
              clearInterval(interval);
              resolve(this.db.transaction([name], "readwrite").objectStore(name));
            }
          }, 100);
        }
      });
    };
    
  }
}
