// Here we create a function that takes an async func and catches any errors and pass them through "next":
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}