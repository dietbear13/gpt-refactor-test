module.exports = function serverError({message} = { message :  "Ошибка сервера"}) {
  return this.res.status(500).json({message});
};
