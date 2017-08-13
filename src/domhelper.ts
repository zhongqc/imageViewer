HTMLElement.prototype.hasClass = function (className: String) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(this.className);
};

HTMLElement.prototype.addClass = function (className: String) {
    if (this.hasClass(className)) {
        return;
    }
    let classArr = this.className.split(' ');
    classArr.push(className);
    this.className = classArr.join(' ');
};

HTMLElement.prototype.removeClass = function (className: String) {
    if (!this.hasClass(className)) {
        return;
    }
    let classArr = this.className.split(' ');
    classArr = classArr.filter(function (item) {
        return item !== className;
    });
    this.className = classArr.join(' ');
};