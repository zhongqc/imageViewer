HTMLElement.prototype.hasClass = function (className: String) {
    return this.classList.contains(className);
};

HTMLElement.prototype.addClass = function (className: String) {
    if (this.hasClass(className)) {
        return;
    }
    this.classList.add(className);
};

HTMLElement.prototype.removeClass = function (className: String) {
    if (!this.hasClass(className)) {
        return;
    }
    this.classList.remove(className);
};