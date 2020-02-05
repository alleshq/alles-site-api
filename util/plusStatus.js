module.exports = plus => {
    if (!plus) return false;
    if (new Date(plus.until).getTime() < new Date().getTime()) return false;
    return true;
};