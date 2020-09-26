
const playAnmation = (list /*(() => (Promise<any> | void))[]*/) => {
    if (list.length && list[0]) {
        const next = list[0]();
        if (next) {
            next.then(() => {
                const nextList = list.slice(1);
                playAnmation(nextList);
            });
        }
    }
}


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

    start(isEnd = false) {
        const isReplay = GameType === 'replay';
        this.dom.classList.remove('end');
        setTimeout(() => {
            if (!isEnd) {
                this.dom.classList.add('start');
            } else {
                this.dom.classList.add('step-end');
                this.setAlign(0);
            }
        }, 0);
    }
    end() {
        this.dom.classList.remove('start', 'step-end', 'add-point');
        this.dom.classList.add('end');
    }


    showDataIndex() {
        this.dom.classList.add('add-point');
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
        this.init();
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
    needUpdate = true;

    init() {
        this.showDot = false;
        this.needUpdate = true;
        this.dom.classList.remove('get-dot');
        this._setDot();
        this.updateClass();
        this.updateStyle();
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
        if (!this.needUpdate) {
            return;
        }
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
        if (!this.needUpdate) {
            return;
        }
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
    _reset() {
        this.bodySeeIndex = 0;
        this.speed = 1;
        this.canMove = false;
        const oneGap = this.allTunnelLangth / 5;
        this.keyLangthList = [
            oneGap, oneGap * 2, oneGap * 3, oneGap * 4
        ]
        this.point = 0;
        this.nowPos = 0;
        this.bodySeeIndex = 0;
    }
    start() {
        const isReplay = GameType === 'replay';
        let i = 0;
        const size = WINDOWSIZE.height * 1.2;
        const transformFn = (min, max, opacity, _, i, arr) => {
            if (i < min || i > max) {
                return false;
            };
            const tunnel = this.list[i];
            tunnel.setStatus('screen-center');
            tunnel.updateClass();
            tunnel.setSize(size);
            tunnel.setOpacity(opacity);
            tunnel.setPosition(50, 50, (-i - 1) * this.tunnelGap);
        }
        const playAnmationList = [];
        this.list.forEach((tunnel) => {
            tunnel.setOpacity(0);
        })
        
        if (isReplay) {
            this.showDataIndex(false);
            this._reset();
            playAnmationList.push(
                () => new Promise(next => {
                    this.list.forEach(transformFn.bind(this, 0, 10, 1));
                    this.bodySee(0);
                    this.setMsg(this.msgData.info);
                    next();
                }),
                () => new Promise(next => {
                    setTimeout(() => {
                        this.list.forEach(transformFn.bind(this, 11, 100, 0));
                        if (!isReplay) {
                            this.setMsg(this.msgData.info);
                        }
                        next();
                    }, 2000);
                })
            );
        } else {
            this.list.forEach(transformFn.bind(this, 0, 5, 1));
            playAnmationList.push(
                () => new Promise(next => {
                    setTimeout(() => {
                        this.list.forEach(transformFn.bind(this, 6, 10, 1));
                        this.bodySee(0);
                        this.setMsgPos(0);
                        next();
                    }, 1000);
                }),
                () => new Promise(next => {
                    setTimeout(() => {
                        next();
                    }, 2000);
                }),
                () => new Promise(next => {
                    setTimeout(() => {
                        this.list.forEach(transformFn.bind(this, 11, 100, 0));
                        this.setMsg(this.msgData.info);
                        next();
                    }, 2000);
                })
            );
        }
        playAnmationList.push(
            () => {
                setTimeout(() => {
                    if (!isReplay) {
                        this.setMsgPos(1);
                    }
                    let time = 3
                    SPACESHIP.setCanMove(true);

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

                }, 1000);
            }
        )
        playAnmation(playAnmationList);



    }
    end(spaceship) {
        document.body.style.transition = '10s';
        GameType = 'end';

        playAnmation([
            () => new Promise(next => {
                setTimeout(() => {
                    spaceship.setAlign('center');
                    spaceship.start(true);
                    next();
                }, 1000);
            }),
            () => new Promise(next => {
                setTimeout(() => {
                    this.showDataIndex();
                    this.setMsg(`POINT: ${++this.point}`);
                    next();
                }, 5000);
            }),
            () => new Promise(next => {
                setTimeout(() => {
                    spaceship.showDataIndex();
                    this.setMsg(`POINT: ${++this.point}`);
                    next();
                }, 1000);
            }),
            () => {
                document.body.style.transition = '';
                this.list.forEach((tunnel) => {
                    tunnel.setSize(10);
                    tunnel.init();
                })
                setTimeout(() => {
                    spaceship.end();
                    GameType = 'replay';
                }, 2000);
            },
        ])
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

            this.end(spaceship);
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
        const innerSpeed = this.speed;
        this.speed = 0;
        const list = ['see-top', 'see-top-left', 'see-bottom-left', 'see-bottom-right', 'see-top-right'];
        document.body.classList.remove(...list);
        document.body.classList.add(list[index]);
        setTimeout(() => {
            this.speed = innerSpeed;
        }, 1000);
    }
    showDataIndex(bool = true) {
        if (bool) {
            this.msg.classList.add('add-point');
        } else {
            this.msg.classList.remove('add-point');
        }
    }
    _move(number, spaceship) {
        this.nowPos += number;
        this.list.forEach((tunnel, i) => {
            tunnel.setPosition(
                tunnel.position.x,
                tunnel.position.y,
                tunnel.position.z + number
            );
            if (Math.abs(tunnel.position.z) < 15) {
                this._checkGetDot(tunnel, spaceship);
            } else if (tunnel.needUpdate) {
                if (tunnel.position.z > 300) {
                    tunnel.setOpacity(0);
                    tunnel.updateStyle();
                    tunnel.needUpdate = false;
                } else if (tunnel.position.z > this.tunnelGap * -10) {
                    tunnel.setOpacity(1);
                    tunnel.updateStyle();
                }
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