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
        if (call.toLowerCase() == 'projects') {
            loadProjects(ele);
        }
    }
}

function initLazyLoad() {
    window.lazyLoadInstance = new LazyLoad({
        elements_selector: ".lazy",
        load_delay: 300,
        callback_enter: (function (el) {
            console.log(el);
            if (el.hasAttribute('data-cb') && el.getAttribute('data-cb') != 'null') {
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
            //console.log(el)
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

function loadProjects(ele) {
    getAjax('/home/projects', function (data) {
        ele.innerHTML = data;
    });
}

var cardIndexCounter = 0;
var projectCardArr = ['Lefrak-Template', 'Lefrak-Template'];
function loadProjectCards(ele) {
    postAjax('/home/projectcards',
        {
            cardName:  projectCardArr[0].toLowerCase()
        },
        function (data) {
            ele.innerHTML = data;
            window.lazyLoadInstance.update();
            cardIndexCounter++;
        }
    );
}

function loadProjectCard(ele, projectName) {
    //console.log('loadProjectCard');
    postAjax('/home/projectcard',
        {
            cardName: projectName
        },
        function (data) {
            ele.innerHTML = data;
            window.lazyLoadInstance.update();
            cardIndexCounter++;
        }
    );
}

function checkHeaderAttachment() {
    var header = document.querySelectorAll('header')[0];
    var headerSpacing = document.querySelectorAll('.header__spacing')[0];
    if (header != undefined && headerSpacing != undefined) {
        var scrolled = document.scrollingElement.scrollTop;
        var position = header.offsetTop;
        var headerHeight = header.offsetHeight;
        
        if (scrolled > position) {
            if (!hasClass(header, 'header--fixed')) {
                headerSpacing.style.height = headerHeight + 'px';
            }
            addClass(header, 'header--fixed');
        }
        else {
            //headerSpacing.style.height = '0px';
            removeClass(header, 'header--fixed');
            //headerHeight = header.offsetHeight;
            //headerSpacing.style.height = headerHeight + 'px';
            setTimeout(function () {
                headerHeight = header.offsetHeight;
                headerSpacing.style.height = headerHeight + 'px';
            }, 200);
        }
    }
}

function checkToShowFooter() {
    var header = document.querySelectorAll('header')[0];
    var footer = document.querySelectorAll('footer')[0];
    if (header != undefined && footer != undefined) {
        if (hasClass(header, 'header--fixed')) {
            addClass(footer, 'footer--show');
        }
        else {
            removeClass(footer, 'footer--show');
        }
    }
}

var resizeTimer;
function initResizeListeners() {
    window.addEventListener('resize', function (event) {
        if (resizeTimer) {
            window.cancelAnimationFrame(resizeTimer);
        }
        timeout = window.requestAnimationFrame(function () {
            resizeProcesses();
        });
    }, false);
}

var scrollTimer
function initScrollListeners() {
    window.addEventListener('scroll', function (event) {
        if (scrollTimer) {
            window.cancelAnimationFrame(scrollTimer);
        }
        timeout = window.requestAnimationFrame(function () {
            scrollProcesses();
        });
    }, false);
}

function resizeProcesses() {
    //console.log('resizeProcesses');
    window.lazyLoadInstance.update();
    checkHeaderAttachment();
    checkToShowFooter();
}

function scrollProcesses() {
    //console.log('scrollProcesses');
    window.lazyLoadInstance.update();
    checkHeaderAttachment();
    checkToShowFooter();
}

(function () {
    initLazyLoad();
    //loadBio();

    initResizeListeners();
    initScrollListeners();

    setTimeout(function () {
        window.lazyLoadInstance.update();
    }, 1000);
    setTimeout(function () {
        window.lazyLoadInstance.update();
    }, 5000);
})();