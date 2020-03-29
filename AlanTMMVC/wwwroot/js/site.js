function hasClass(el, className) {
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}

function addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
}

function getAjax(url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
}

function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    return xhr;
}

function loadModule(ele, call) {
    if (ele !== undefined && call !== undefined && call != '') {
        if (call.toLowerCase() == 'bio') {
            loadBio(ele);
        }
    }
}

function initLazyLoad() {
    window.lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy",
        callback_enter: (function (el) {
            if (el.hasAttribute('data-cb')) {
                var param1 = el.getAttribute('data-param1');
                var param2 = el.getAttribute('data-param2');
                if (param1 === 'this') {
                    param1 = el;
                }
                else {
                    param1 = '' + param1 + '';
                }
                if (param2 === 'this') {
                    param2 = el;
                }
                else {
                    param2 = '' + param2 + '';
                }
                if (typeof el.getAttribute('data-cb') !== 'undefined' && typeof param1 !== 'undefined' && param1 !== '' && typeof param2 !== 'undefined' && param2 !== '') {
                    result = new Function("param1", "param2", ((el.getAttribute('data-cb') + '(param1,param2)'))).call(this, param1, param2);
                }
                else if (typeof el.getAttribute('data-cb') !== 'undefined' && typeof param1 !== 'undefined' && param1 !== '') {
                    result = new Function("param1", (el.getAttribute('data-cb') + '(param1)')).call(this, param1);
                }
                else if (typeof el.getAttribute('data-cb') !== 'undefined') {
                    eval(el.getAttribute('data-cb'))();
                }
                el.setAttribute('data-cb',null)
            }
        }),
        callback_loaded: (function (el) {
        })
        // ... more custom settings?
    });
    window.lazyLoadInstance.update();
    // Listen to the initialization event and get the instance of LazyLoad
    window.addEventListener(
        "LazyLoad::Initialized",
        function (event) {
            window.lazyLoadInstance = event.detail.instance;
        },
    );
        false
}

function loadBio(ele) {
    getAjax('/home/bio', function (data) {
        ele.innerHTML = data;
    });
}

(function () {
    initLazyLoad();
    //loadBio();
    setTimeout(function () {
        window.lazyLoadInstance.update();
    }, 1000);
})();