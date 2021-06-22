import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  const { authorization } = req.headers;

  if(!authorization){
    return res.status(401).json({
      errors: ['Necessário fazer login'],
    })
  }

  const [, token] = authorization.split(' ');
  
  try{
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, login } = data;
    req.userId = id;
    req.userLogin = login;
    return next();
  } catch(e){
    console.log(e);
      return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    })
  }

};