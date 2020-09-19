class Spaceship {
    constructor(dom) {
        this.dom = dom;
        this._init();
    }
    dom;
    // left || center || right
    align = 'center'; 

    _init() {
        this._bindEvent();
    }
    _bindEvent() {
        this.dom.addEventListener('click', () => {
            this.dom.classList.add('start');
        });
    }
}

class Boom {
    constructor(
        tunnelList = [],
        radius = 10, // 爆炸半徑
        position = [] // [x, y]
    ) {
        this.tunnelList = tunnelList;;
        this.radius = radius;;
        this.position = position;;
    }
    tunnelList;
    radius;
    position;
};

class Tunnel {
    constructor(
        dom,
        size = [], // width, height
        position = [] // [x, y, z]
    ) {
        this.dom = dom;
        this.size = size;
        this.position = position;
        this._init();
    }
    dom;
    size;
    position;
    // shape || tunnel || button
    status = 'shape';
    // left || center || right
    dot;

    _init() {
        this.update();
        this._bindEvent();
    }

    setPosition(x, y, z) {
        this.position = [x, y, z];
    }

    setSize(x, y, z) {
        this.position = [x, y, z];
    }

    setShape(width, height) {
        this.size = [width, height];
    }

    update() {
        this._setDot();
        // 設定位置
        dom.style.transform = '';
        dom.style.width = `${this.size[0]}px`;
        dom.style.height = `${this.size[1]}px`;

        dom.classList.remove('shape', 'tunnel', 'button');
        dom.classList.add(this.status);

        dom.classList.remove('left', 'center', 'right');
        dom.classList.add(this.dot);
    }

    // 可能可以多加互動
    _bindEvent() { }

    _setDot() {
        this.dot = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
    }
};


class TunnelList {
    constructor(list) {
        this.list = list;
    }

    speed = 5;
    // 加速度
    acceleration = 5;

    list = [];

    advance() {}

    checkGetDot(spaceship) {}

    
}