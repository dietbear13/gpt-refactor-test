module.exports = function forbidden({message} = { message : "Доступно только авторизованным пользователям"}) {
  return this.res.status(403).json({message});
};
