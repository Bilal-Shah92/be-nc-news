exports.handleNotFoundError = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handleInvalidInputError = (err, req, res, next) => {
  if (err.code === "22P02") { 
    return res.status(400).send({ msg: "Bad request" });
  }
  next(err); 
};

exports.handleUnexpectedError = (err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }
  console.error(err); 
  res.status(500).send({ msg: "Internal Server Error" });
};
