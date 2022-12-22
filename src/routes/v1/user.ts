
'../../middlewares/authFacebook'
'../../middlewares/authGoogle'

import {Request,Response,NextFunction,Router} from 'express'
import passport from 'passport';

import { check } from 'express-validator'

import { isLoggedIn } from '../../middlewares/isLogged';
import { validateFields } from '../../middlewares/validateFields';
import { validateJwt } from '../../middlewares/validateJwt';
import { login } from '../../controllers/auth'
import { existEmail } from '../../helpers/existEmailUser';
import { validPass } from '../../helpers/regexPass';
import { userAdmin } from '../../middlewares/validateRoles';
import { storage } from '../../middlewares/multerConfig';
import {
    addUser,
    deleteAllUsers,
    deleteUser,
    getUser,
    getUsers,
    googleSuccess,
    googleFailure,
    facebookSuccess,
    noAuth,
    updateDoc,
    updateUser,
    logoutFacebook,
    logoutGoogle,
} from '../../controllers/userController';
import { changePassword, restorePassword } from '../../helpers/restorePass';

const router: Router = Router();

/** 
 * validateJwt - Verify that a token is included in the request.  
 * validateFields - validates errors generated by express-validator
 */
/** ruta base API
 * http:localhost:3000/v1/
 */

router.get('/users',validateJwt,userAdmin,getUsers)
router.get('/user/:id',/* validateJwt ,userAdmin,*/getUser)

router.post('/user',storage.single('img'),[
  check('email')
    .custom(existEmail),
  check('email','Email is not valid')
    .isEmail(),
  check('password')
    .custom(validPass)
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long'),
  validateFields
],addUser)

/** ruta login */
router.post('/user/login',login)
router.put('/user/:id', storage.single('img'),updateUser)

/** This route is use to send one link to email user to restore password */
router.post('/restore-password',restorePassword) 
/** This route is use to add new password */
router.post('/password-reset/:idUser',changePassword)

router.delete('/user/:id',
  validateJwt,
  /* userAdmin, */
  validateFields,
  deleteUser)
router.delete('/all-users',/* validateJwt, validateFields, */deleteAllUsers)

/* Test queries findOne */
// router.get('/only-doc',validPass)
router.put('/update-doc',updateDoc)


/** Facebook */
router.get('/auth/facebook',passport.authenticate('sign-up-facebook',{scope:['email']}));
router.get('/auth/facebook/login',
  passport.authenticate('sign-up-facebook', {failureRedirect: '/v1/login' }),
  (req:Request, res:Response)=>{
    res.redirect('/v1/facebook-ok')
  });

router.get('/login',noAuth)
router.get('/facebook-ok',isLoggedIn,facebookSuccess) 

/** google  */
router.get('/auth/google',passport.authenticate('sign-up-google',{scope:['email','profile']}));
router.get('/auth/google/login',passport.authenticate('sign-up-google',{failureRedirect:'/v1/auth/google/failure'}),
(req:Request,res:Response)=>{
  res.redirect('/v1/google-ok')
})

router.get('/google-ok',isLoggedIn,googleSuccess)
router.get('/auth/google/failure',googleFailure);

/** logout google */
router.get('/logout/google',logoutGoogle)
/** logout facebook */
router.get('/logout/facebook',logoutFacebook);

/** No loggedIn google & facebook*/
router.get('/home',(req:Request,res:Response)=>{
  res.send('You are not logged in');
})


export default router;
