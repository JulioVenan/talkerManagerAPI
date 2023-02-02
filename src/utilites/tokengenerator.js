const STRING = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const size = 16;

const random = () => Math.floor(Math.random() * STRING.length - 0);

const tokenGen = () => {
    let token = '';
    for (let i = 0; i < size; i += 1) {
        token += STRING[random()];
    }
    return token;
};
module.exports = tokenGen;