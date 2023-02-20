require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
var { devErrorHandler } = require("./helper/catchHandler");

var indexRouter = require("./routes/index");
var faqRouter = require("./routes/faq");
var descRouter = require("./routes/homeDesc");
var regionRouter = require("./routes/region");
var teamRouter = require("./routes/team");
var serviceRouter = require("./routes/social-service");
var subRegionRouter = require("./routes/subRegion");
var otherRouter = require("./routes/other");

var app = express();
app.use(cors({ origin: "*" }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connection successfull"))
  .catch((err) => console.log(err));

app.use("/", indexRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/descs", descRouter);
app.use("/api/regions", regionRouter);
app.use("/api/teams", teamRouter);
app.use("/api/services", serviceRouter);
app.use("/api/subRegions", subRegionRouter);
app.use("/api/others", otherRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

/**
 * @Displaying error message for undefined Api's
 */
app.use("*", (req, res, next) => {
  return res.json({
    status: "fail",
    data: { url: "api not found" },
  });
});

app.use(devErrorHandler);

module.exports = app;
