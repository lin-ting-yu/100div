const oldWindowSize = {};
const windowSize = {
    width: oldWindowSize.width = window.innerWidth,
    height: oldWindowSize.height = window.innerHeight
};

const spaceship = new Spaceship(document.querySelector('.spaceship'));
const tunnel = document.querySelector('.tunnel');
