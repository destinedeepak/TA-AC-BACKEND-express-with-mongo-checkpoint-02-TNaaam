var express = require('express');
var router = express.Router();

var Event = require('../model/event');
var Remark = require('../model/remark');
var lodash = require('lodash');
var moment = require('moment');
var {getUniqCategories, getUniqLocations} = require('../utils/event');

// GET new form
router.get('/new', async (req, res, next) => {
  await res.render('event');
});
// Post form
router.post('/', async (req, res, next) => {
  try {
    req.body.category = req.body.category.split(' ');
    const books = await Event.create(req.body);
    res.redirect('/event');
  } catch (err) {
    return next(err);
  }
});

// GET list of events
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find({});
    // sending uniq categories
    const uniqCategories = await getUniqCategories(events)
    // sending uniq location
    const uniqLocations = await getUniqLocations(events);
    res.render('events', { events, uniqCategories, uniqLocations });
  } catch (err) {
    return next(err);
  }
});

// GET event details
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id).lean().populate('remark').exec();
    console.log(event);
    const startDate = await moment(event.start_date).format('MMM Do YY');
    const endDate = await moment(event.end_date).format('MMM Do YY');
    res.render('eventDetails', { event, startDate, endDate });
  } catch (err) {
    return next(err);
  }
});

// GET likes
router.get('/:id/like', async (req, res, next) => {
  try {
    let id = req.params.id;
    const event = await Event.findByIdAndUpdate(id, { $inc: { like: 1 } });
    res.redirect('/event/' + id);
  } catch (err) {
    return next(err);
  }
});

// GET dislikes
router.get('/:id/dislike', async (req, res, next) => {
  try {
    let id = req.params.id;
    console.log(id);
    const event = await Event.findByIdAndUpdate(id, { $inc: { dislike: 1 } });
    res.redirect('/event/' + id);
  } catch (err) {
    return next(err);
  }
});

// Edit details
router.get('/:id/edit', async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id);
    const startDate = await moment(event.start_date).format('YYYY MM DD').replace(' ', '-').replace(' ', '-');
    const endDate = await moment(event.end_date).format('YYYY MM DD').replace(' ', '-').replace(' ', '-');
    const categories = await event.category.join(' ');
    res.render('editEvent', { event, startDate, endDate, categories});
  } catch (err) {
    return next(err);
  }
});

// Update details 
router.post('/:id/update', async(req, res, next) => {
  try {
    const id = req.params.id;
    req.body.category = req.body.category.split(' ');
    const event = await Event.findByIdAndUpdate(id, req.body);
    res.redirect('/event/' + id);
  } catch (err) {
    return next(err);
  }
})

// Delete details 
router.get('/:id/delete', async(req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Event.findByIdAndDelete(id);
    const remarks = await Remark.deleteMany({event:id});
    console.log(remarks);
    res.redirect('/event');
  } catch (err) {
    return next(err);
  }
})

// GET events sort by categories  
router.get('/:category/sortbycategory', async (req, res, next) =>{
  let category = req.params.category;
  try{
    const events = await Event.find({"category":category});
    // get uniq location and uniq category 
    const allEvents = await Event.find({});
    const uniqCategories = await getUniqCategories(allEvents)
    const uniqLocations = await getUniqLocations(allEvents);
    res.render('events', { events, uniqCategories, uniqLocations });
  }catch (err) {
    return next(err);
  }
})

// GET events sort by locations  
router.get('/:location/sortbylocation', async (req, res, next) =>{
  let location = req.params.location;
  try{
    const events = await Event.find({"location":location});
    // get uniq location and uniq category 
    const allEvents = await Event.find({});
    const uniqCategories = await getUniqCategories(allEvents)
    const uniqLocations = await getUniqLocations(allEvents);
    res.render('events', { events, uniqCategories, uniqLocations });
  }catch (err) {
    return next(err);
  }
})

// GET events sort by date  
router.get('/sortby/date', async (req, res, next) =>{
  try{
    // get uniq location and uniq category 
    const events = await Event.find({}).sort({'start_date':1});
    const uniqCategories = await getUniqCategories(events)
    const uniqLocations = await getUniqLocations(events);
    res.render('events', { events, uniqCategories, uniqLocations });
  }catch (err) {
    return next(err);
  }
})

module.exports = router;
