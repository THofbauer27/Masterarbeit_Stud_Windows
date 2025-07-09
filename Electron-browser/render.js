let user_id = "UnknownUser";

// user_id asynchron laden
if (window.electronAPI?.getUserId) {
    window.electronAPI.getUserId().then(id => {
        user_id = id;
        console.log("👤 user_id geladen:", user_id);
    });
}

class TabManager {
    constructor() {
        this.tabs = [];
        this.activeTab = null;
        this.tabCounter = 0;
        this.init();
    }

    init() {
        document.getElementById("newTab").addEventListener("click", () => this.createTab());
        document.getElementById("urlBar").addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.navigateActiveTab(e.target.value);
        });
        document.getElementById("backBtn").addEventListener("click", () => this.goBack());
        document.getElementById("forwardBtn").addEventListener("click", () => this.goForward());

        this.createTab("https://www.google.com");

        // 🆕 IPC-Event: neue URL in neuem Tab öffnen
        if (window.electronAPI && window.electronAPI.receive) {
            window.electronAPI.receive("open-url-in-tab", (url) => {
                this.createTab(url);
            });
        }
    }

    goBack() {
        if (this.activeTab?.webview.canGoBack()) {
            this.activeTab.webview.goBack();
        }
    }

    goForward() {
        if (this.activeTab?.webview.canGoForward()) {
            this.activeTab.webview.goForward();
        }
    }

    createTab(url) {
        const tabId = `tab-${this.tabCounter++}`;
        const tab = {
            id: tabId,
            url: url || "https://www.google.com",
            title: "New Tab",
            webview: null,
            element: null,
            isActive: false,
            allowPopups: true,
        };

        const tabElement = document.createElement("div");
        tabElement.className = "flex items-center py-2 px-4 bg-white border border-gray-300 rounded-t mr-1 cursor-pointer max-w-[200px] min-w-[100px]";
        tabElement.innerHTML = `<span class="flex-1 truncate">${tab.title}</span><span class="ml-2 text-gray-500 px-1 hover:text-gray-700">×</span>`;

        tabElement.querySelector("span.ml-2").addEventListener("click", (e) => {
            e.stopPropagation();
            this.closeTab(tabId);
        });

        tabElement.addEventListener("click", () => this.switchTab(tabId));
        document.getElementById("tabBar").insertBefore(tabElement, document.getElementById("newTab"));

        const webview = document.createElement("webview");
        webview.setAttribute("partition", "persist:custom-browser");
        webview.setAttribute("allowpopups", "true");
        webview.setAttribute("webpreferences", "nativeWindowOpen=no");
        webview.setAttribute("preload", "preload.js");
        webview.id = `webview-${tabId}`;
        webview.className = "w-full h-full hidden";
        webview.src = tab.url;

        webview.addEventListener("dom-ready", () => {
            console.log("✅ Webview ist bereit!");
        });

        webview.addEventListener("new-window", (e) => {
            if (tab.allowPopups) {
                e.preventDefault();
                tabManager.createTab(e.url);
            } else {
                e.preventDefault();
            }
        });

        webview.addEventListener("did-navigate", (e) => {
            this.updateTabUrl(tabId, e.url);
            if (window.electronAPI?.writeCurrentURL) {
                window.electronAPI.writeCurrentURL(e.url);
            }
        });

        webview.addEventListener("page-title-updated", (e) => this.updateTabTitle(tabId, e.title));
        document.getElementById("webviewsContainer").appendChild(webview);

        tab.element = tabElement;
        tab.webview = webview;
        this.tabs.push(tab);
        this.switchTab(tabId);
        return tab;
    }

    switchTab(tabId) {
        this.tabs.forEach((tab) => {
            const isActive = tab.id === tabId;
            tab.isActive = isActive;
            if (isActive) {
                tab.element.classList.add("z-[1]", "border-b-white");
                tab.webview.classList.remove("hidden");
                tab.webview.classList.add("flex");

                if (window.electronAPI?.writeCurrentURL) {
                    window.electronAPI.writeCurrentURL(tab.url);
                }
            } else {
                tab.element.classList.remove("z-[1]", "border-b-white");
                tab.webview.classList.remove("flex");
                tab.webview.classList.add("hidden");
            }
        });
        this.activeTab = this.tabs.find((tab) => tab.id === tabId);
        document.getElementById("urlBar").value = this.activeTab.url;
    }

    closeTab(tabId) {
        const index = this.tabs.findIndex((tab) => tab.id === tabId);
        if (index === -1) return;

        const tab = this.tabs[index];
        tab.element.remove();
        tab.webview.remove();
        this.tabs.splice(index, 1);

        if (this.tabs.length === 0) {
            this.createTab();
        } else if (tab.isActive) {
            this.switchTab(this.tabs[Math.max(0, index - 1)].id);
        }
    }

    navigateActiveTab(url) {
        if (!this.activeTab) return;
        const fullUrl = url.startsWith("http") ? url : `https://${url}`;
        this.activeTab.webview.src = fullUrl;
        this.activeTab.url = fullUrl;
        document.getElementById("urlBar").value = fullUrl;
    }

    updateTabUrl(tabId, url) {
        const tab = this.tabs.find((t) => t.id === tabId);
        if (tab) {
            tab.url = url;
            if (tab.isActive) document.getElementById("urlBar").value = url;
        }
    }

    updateTabTitle(tabId, title) {
        const tab = this.tabs.find((t) => t.id === tabId);
        if (tab) {
            tab.title = title;
            tab.element.querySelector("span.flex-1").textContent = title;
        }
    }
}

const tabManager = new TabManager();
window.tabManager = tabManager;









