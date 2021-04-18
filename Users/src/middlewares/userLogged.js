import User from "../models/user";

export default async (req, res, next) => {
  const { userlogged } = req.headers;

  if(!userlogged){
    return res.status(401).json({
      errors: ['Necessário fazer login'],
    })
  }
  
  try{
    
    const user = await User.findOne({ where: { login: userlogged } });
    const { id }  = user;
    console.log(id)
    req.userId = id;
    console.log(userId)
    return next();
  } catch(e){
    console.log(e);
      return res.status(401).json({
      errors: ['Usuário inválido inválido'],
    })
  }

};