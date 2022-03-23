const Racetrack = require('../models/racetrack');

module.exports.index = async (req, res) => {
    const racetracks = await Racetrack.find({});
    res.render('racetracks/index', { racetracks });
}

module.exports.renderNewForm = (req, res) => {
    res.render('racetracks/new');
}

module.exports.createRacetrack = async (req, res, next) => {
    const newRacetrack = new Racetrack(req.body.racetrack);
    console.log(req.files);
    newRacetrack.author = req.user._id;
    newRacetrack.img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newRacetrack.save();
    req.flash('success', 'Successfully created a new race track');
    return res.redirect(`/racetracks/${newRacetrack.id}`);
}
module.exports.deleteRacetrack = async (req, res, next) => {
    const {id} = req.params;
    await Racetrack.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the race track');
    res.redirect('/racetracks');
}
module.exports.renderEditForm = async (req, res, next) => {
    const racetrack = await Racetrack.findById(req.params.id);
    if (!racetrack) {
        req.flash('error', 'Cannot find this race track');
        res.redirect('/racetracks');
    }
    res.render('racetracks/edit', { racetrack });
}
module.exports.renderShowPage = async (req, res, next) => {
    const { id } = req.params;
    // nested populate to populate reviews inside of racetrack
    const racetrack = await Racetrack.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); 
    if (!racetrack) {
        req.flash('error', 'Cannot find this race track');
        res.redirect('/racetracks');
    }
    res.render('racetracks/show', { racetrack });
}

module.exports.updateRacetrack = async (req, res, next) => {
    const { id } = req.params;

    const racetrack = await Racetrack.findById(id, req.body.racetrack);
    req.flash('success', 'Successfully updated race track data');
    res.redirect(`/racetracks/${racetrack.id}`)
}