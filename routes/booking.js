
const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { bookingHandeler, getAllBookingHandeler, getBookingHandeler } = require("../controllers/booking");



router.post("/", auth , bookingHandeler);
router.get("/", auth, getAllBookingHandeler);
router.get("/:bookingId", auth, getBookingHandeler);


module.exports = router;
