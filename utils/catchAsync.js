// used to wrap async functions instead of wrapping each function in try/catch block
module.exports = function(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};