module.exports = function notFound({message} = { message :  "Объект не найден"}) {
  return this.res.status(404).json({message});
};
