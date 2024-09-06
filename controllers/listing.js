const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
        .populate({     
            path: "reviews",    
            populate: {        
                path: "author",
            },
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
    
        await updatedListing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;

    let result = await Listing.findByIdAndDelete(id);
    console.log(result);

    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
}

module.exports.processImageData = (req, res, next) => {
    if (!req.file) {
        return next(new ExpressError(400, '"listing.image" is required')); 
    }

    const { path: url, filename } = req.file;
    req.body.listing = req.body.listing || {};
    req.body.listing.image = { url, filename };

    next();
};

module.exports.processImageDataUpdate = async (req, res, next) => {
    if (req.file) {
        const { path: url, filename } = req.file;
        req.body.listing = req.body.listing || {}; 
        req.body.listing.image = { url, filename }; 
    } else {

        const existingListing = await Listing.findById(req.params.id);

        if (existingListing) {
            req.body.listing = req.body.listing || {}; 
            req.body.listing.image = existingListing.image; 
        }
    }

    next();
};

