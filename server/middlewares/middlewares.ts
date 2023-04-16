import { Request, Response, NextFunction } from "express";

function auth (req: Request, res: Response, next: NextFunction){
  if (req.isAuthenticated()) {
    next()
  }else{
    res.send({isAuth: false})
  }
}

export { auth };