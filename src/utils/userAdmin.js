// Middleware para verificar si el usuario es admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        // Si es admin, puede seguir adelante
        next();
    } else {
        // Si no es admin
        res.render('noAdmin');
    }
};

// Middleware para verificar si el usuario es usuario regular
function isUser(req, res, next) {
    console.log(req.session.user)
    if (req.session.user && req.session.user.role === 'user') {
        // Si es usuario regular, puede seguir adelante
        next();
    } else {
        // Si no es usuario regular
        res.render('noAdmin');
    }
};

function gotAuth(req, res, next) {
    if (req.user) {
        // Si es usuario 
        next();
    } else {
        // Si no es usuario regular
        res.render('noAdmin');
    }
};

function getRole(req) {
    return req.user ? req.user.role : null;
};

function isPremium(req, res, next) {
    if (req.user && req.user.role === 'premium') {
        // Si es usuario regular, puede seguir adelante
        next();
    } else {
        // Si no es usuario regular
        res.render('noAdmin');
    }
};


module.exports = { isAdmin, isUser, getRole, gotAuth, isPremium};