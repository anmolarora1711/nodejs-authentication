module.exports.home = function(req, res){
    res.render('home', {
        title: 'Nodejs Authentication System',
    });
}

module.exports.dashboard = function(req, res){
    res.render('dashboard', {
        title: 'Dashboard',
        user: req.user,
    });
}