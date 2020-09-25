class Spaceship {
    constructor(dom) {
        this.dom = dom;
        this._init();
    }
    canMove = false;
    dom;
    alignList = ['left', 'center', 'right'];
    align = 1;
    to = '' // left || right

    _eventData = {};

    _init() {
        this._bindEvent();
        this.updateClass();
    }

    _bindEvent() {
        this.dom.addEventListener('click', () => {
            this._eventData['click'].forEach(fn => fn());
        });
    }
    updateClass() {
        this.dom.classList.remove('to-left', 'to-right');
        if (this.to) {
            this.dom.classList.add(`to-${this.to}`);
        }
    }

    addEventListener(name, fn) {
        if (!this._eventData[name]) {
            this._eventData[name] = []
        }
        this._eventData[name].push(fn);
    }
    setAlign(align) {
        // 1 || -1 || center
        if (align === 'center') {
            this.align = 1;
            this.updatePosition();
            return;
        }
        if (
            this.align + align < 0 ||
            this.align + align > 2
        ) {
            return;
        }
        this.align += align;
        this.updatePosition();
    }
    setCanMove(bool) {
        this.canMove = bool;
        if (bool) {
            this.dom.classList.add('move');
        } else {
            this.dom.classList.remove('move');
        }
    }
    updatePosition() {
        this.dom.style.marginLeft =
            `${(this.align - 1) * WINDOWSIZE.height * 1.2 * 0.4}px`;
    }

    start() {
        this.dom.classList.add('start');
    }
    end() {
        this.dom.style.transition = '5s';
        this.setAlign(0);
    }
}

class Tunnel {
    constructor(
        dom,
        index = 0,
        size = 10,
        position = {} // {x, y, z}
    ) {
        this.dom = dom;
        this.size = size;
        this.position = position;

        this.dom.setAttribute('data-index', index);

        this.status = `type-${~~(Math.random() * 3)}`;
        this.transformOrigin = `transform-origin-${(~~(Math.random() * 10) + 1) * 10}`;
        this.turnType = `turn-${['right', 'left'][~~(Math.random() * 2)]}`;
        this.turnSpeed = `turn-speed-${~~(Math.random() * 11) + 10}`;
        this.opacity = Math.random() / 2;
        this.dom.classList.add(
            'tunnel',
            this.status,
            this.transformOrigin,
            this.turnType,
            this.turnSpeed
        )
        this.dom.style.opacity = this.opacity;
        this._init();
    }
    dom;
    size; // number
    position;
    dot; // left || center || right
    showDot = false;
    status = ''; // .type-(0 || 1 || 2) || .screen-center
    transformOrigin = ''; // .transform-origin-(10 ~ 100);
    turnType = ''; // .turn-(right || left)
    turnSpeed = ''; // .turn-speed-(10 ~ 20)
    opacity = 0; // 0 ~ 0.5

    _init() {
        this._setDot();
        this.updateClass();
        this.updateStyle();
        this._bindEvent();
    }

    setPosition(x, y, z) {
        this.position = { x, y, z };
    }

    setSize(size) {
        this.size = size;
    }
    setOpacity(opacity) {
        this.opacity = opacity;
    }

    setStatus(status) {
        // 'type-0', 'type-1', 'type-2', 'screen-center'
        this.status = status;
    }
    setShowDot(bool) {
        this.showDot = bool;
    }

    updateClass() {
        if (!this.dom.classList.contains(this.status)) {
            this.dom.classList.remove('type-0', 'type-1', 'type-2', 'screen-center');
        }
        this.dom.classList.add(this.status);

        if (!this.dom.classList.contains(this.dot)) {
            this.dom.classList.remove('left', 'center', 'right');
        }
        this.dom.classList.add(this.dot);

        if (this.showDot) {
            this.dom.classList.add('show-dot');
        } else {
            this.dom.classList.remove('show-dot');
        }
    }
    updateStyle(z = false) {
        if (z) {
            this.dom.style.transform = `translateZ(${this.position.z}px)`;
            return;
        }
        // 設定位置
        this.dom.style.transform = '';

        this.dom.style.left = `${this.position.x}%`;
        this.dom.style.top = `${this.position.y}%`;
        this.dom.style.transform = `translateZ(${this.position.z}px)`;

        this.dom.style.fontSize = `${this.size}px`;

        this.dom.style.opacity = this.opacity;
    }

    appendTo(parentDom) {
        parentDom.appendChild(this.dom);
    }
    getDot() {
        this.dom.classList.add('get-dot')
    }

    // 可能可以多加互動
    _bindEvent() { }

    _setDot() {
        this.dot = ['left', 'center', 'right'][Math.floor(Math.random() * 3)];
        // this.dot = 'center';
    }
};

class TunnelList {
    constructor(list, msg) {
        this.list = list;
        this.msg = msg;
        this._init();
    }

    speed = 1;
    canMove = false;

    point = 0;
    msg;
    list = [];
    msgData = {
        init: '100 Divs Challenge !',
        info: 'Use Key: \'←\' And \'→\' Operation',
    }
    nowPos = 0;
    tunnelGap = 832;
    allTunnelLangth = 0;
    keyLangthList = [];
    bodySeeIndex = 0;

    _init() {
        this.allTunnelLangth = this.tunnelGap * (this.list.length - 1)
        const oneGap = this.allTunnelLangth / 5;
        this.keyLangthList = [
            oneGap, oneGap * 2, oneGap * 3, oneGap * 4
        ]
    }
    start() {
        let i = 0;
        const size = WINDOWSIZE.height * 1.2;
        const transformFn = (min, max, _, i, arr) => {
            if (i < min || i > max) {
                return false;
            };
            const tunnel = this.list[i];
            tunnel.setStatus('screen-center');
            tunnel.updateClass();
            tunnel.setSize(size);
            tunnel.setOpacity(1);
            tunnel.setPosition(50, 50, (-i - 1) * this.tunnelGap);
            tunnel.dom.style.display = '';
        }
        this.list.forEach((tunnel) => {
            tunnel.dom.style.display = 'none';
        })
        this.list.forEach(transformFn.bind(this, 0, 20));

        setTimeout(() => {
            this.list.forEach(transformFn.bind(this, 21, 60));
            this.bodySee(0);
            this.setMsgPos(0);
        }, 1000);
        setTimeout(() => {
            this.list.forEach(transformFn.bind(this, 61, 100));
        }, 2000);
        setTimeout(() => {
            this.setMsgPos(1);
            let time = 3

            const innerInterval = setInterval(() => {
                this.setMsg(time);
                time--
                if (time === -1) {
                    this.canMove = true;
                    clearInterval(innerInterval);
                }
            }, 1000);

            this.list.forEach(tunnel2 => {
                tunnel2.setShowDot(true);
                tunnel2.updateClass();
            });

        }, 5000);
    }
    end() {
        document.body.style.transition = '10s';
        GameType = 'end';
    }
    go(spaceship) {
        this._move(this.speed, spaceship);
        if (this.speed < 32) {
            this.speed += this.speed;
        }
        this.setMsg(`POINT: ${this.point}`);
        if (this.nowPos > this.keyLangthList[0] && this.keyLangthList.length) {
            this.keyLangthList.shift();
            this.bodySee(++this.bodySeeIndex);
        }
        if (this.list[this.list.length - 1].position.z > 500) {
            this.bodySee(0);
            setTimeout(() => {
                spaceship.setAlign('center');
                spaceship.end();
                this.end();
            }, 1000);
        }
    }
    setMsg(msg) {
        this.msg.innerHTML = msg;
    }
    setMsgPos(index) {
        this.msg.classList.remove('pos-0', 'pos-1');
        this.msg.classList.add(`pos-${index}`);
    }
    bodySee(index) {
        PauseAnimation = true;
        const list = ['see-top', 'see-top-left', 'see-bottom-left', 'see-bottom-right', 'see-top-right'];
        document.body.classList.remove(...list);
        document.body.classList.add(list[index]);
        setTimeout(() => {
            PauseAnimation = false;
        }, 1000);
    }
    _move(number, spaceship) {
        this.nowPos += number;
        this.list.forEach((tunnel, i) => {
            tunnel.setPosition(
                tunnel.position.x,
                tunnel.position.y,
                tunnel.position.z + number
            );
            if (Math.abs(tunnel.position.z) < 10) {
                this._checkGetDot(tunnel, spaceship);
            }
            tunnel.updateStyle(true);
        })
    }
    _checkGetDot(tunnel, spaceship) {
        if (tunnel.dot === spaceship.alignList[spaceship.align]) {
            this.point++;
            tunnel.getDot();
        }
    }

}