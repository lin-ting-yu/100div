const WINDOWSIZE = {
    width: window.innerWidth,
    height: window.innerHeight
};
let GameType = 'init'; // init || start || end

const SPACESHIP = new Spaceship(document.querySelector('.spaceship'));
const TUNNELLIST = new TunnelList(
    [...('.'.repeat(98))].map((_, i) => {
        const size = ~~(Math.random() * 1 + 8);
        const tunnel = new Tunnel(
            document.createElement('div'),
            i + 1,
            size,
            { x: ~~(Math.random() * 100), y: ~~(Math.random() * 100), z: 0 }
        )
        tunnel.appendTo(document.body);
        return tunnel;
    }),
    document.querySelector('.msg')
);



const animation = () => {
    if (GameType !== 'start') {
        return;
    }
    requestAnimationFrame(animation);
    if (TUNNELLIST.canMove) {
        TUNNELLIST.go(SPACESHIP);
    }
    TUNNELLIST.list.forEach(tunnel => {
        tunnel.updateStyle();
    })
}

SPACESHIP.addEventListener('click', () => {
    if (GameType === 'init') {
        GameType = 'start';
        animation();
        SPACESHIP.start();
        TUNNELLIST.start();
    } else if (GameType === 'end') {

    }
});
document.body.addEventListener('keydown', (e) => {
    if (SPACESHIP.canMove && GameType === 'start') {
        if (
            e.key === 'ArrowRight' ||
            e.key === 'ArrowLeft'
        ) {
            SPACESHIP.setAlign(e.key === 'ArrowRight' ? 1 : -1);
            SPACESHIP.to = e.key === 'ArrowRight' ? 'right' : 'left';
            SPACESHIP.updateClass();
        }
    }
});
document.body.addEventListener('keyup', (e) => {
    if (SPACESHIP.canMove) {
        if (
            e.key === 'ArrowRight' ||
            e.key === 'ArrowLeft'
        ) {
            SPACESHIP.to = '';
            SPACESHIP.updateClass();
        }
    }
});

