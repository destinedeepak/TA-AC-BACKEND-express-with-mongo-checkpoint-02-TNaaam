var express = require('express');
var router = express.Router();

var Remark = require('../model/remark');
var Event = require('../model/event');

/* POST remarks */
router.post('/:id', async (req, res, next) => {
  try {
    const eventId = req.params.id;
    req.body.event = eventId;
    const remark = await Remark.create(req.body);
    const event = await Event.findByIdAndUpdate(eventId, 
      {$push: { remark: remark._id }});
    res.redirect('/event/'+ eventId)
  } catch (err) {
    return next(err);
  }
});
// edit remarks
router.get('/:id/edit', async (req, res, next) => {
  try {
    const id = req.params.id;
    const remark = await Remark.findById(id);
    // res.send(remark)
    res.render('editRemark', {remark})
  } catch (err) {
    return next(err);
  }
});

// GET likes
router.get('/:id/like', async (req, res, next) => {
  try {
    let id = req.params.id;
    const remark = await Remark.findByIdAndUpdate(id, { $inc: { like: 1 } });
    res.redirect('/event/'+remark.event);
  } catch (err) {
    return next(err);
  }
});

// GET dislikes
router.get('/:id/dislike', async (req, res, next) => {
  try {
    let id = req.params.id;
    console.log(id);
    const remark = await Remark.findByIdAndUpdate(id, { $inc: { dislike: 1 } });
    res.redirect('/event/'+remark.event);
  } catch (err) {
    return next(err);
  }
});

// Update remark
router.post('/:id/update', async (req, res, next) => {
  try{
    const id = req.params.id;
    const remark = await Remark.findByIdAndUpdate(id, req.body);
    res.redirect('/event/' + remark.event)
  }catch (err) {
    return next(err);
  }
})


// Delete remark
router.get('/:id/delete', async(req, res, next) => {
  try {
    const id = req.params.id;
    const remark = await Remark.findByIdAndDelete(id);
    const eventId = remark.event;
    let event = await Event.findByIdAndUpdate(eventId, {$pull:{"remark":id}})
    res.redirect('/event/'+ eventId);
    // res.send(event)
  } catch (err) {
    return next(err);
  }
})

module.exports = router;
