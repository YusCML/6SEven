import { Router } from 'express';
import {
  changePasswordController,
  forgotPasswordController,
  getProfileController,
  getSessionController,
  listUsersController,
  loginController,
  logoutController,
  patchProfileController,
  putProfilePhotoController,
  registerController,
  resetPasswordController,
} from '@/controllers/auth.controller';
import {
  googleCallbackController,
  googleLinkStartController,
  googleStartController,
  googleUnlinkController,
} from '@/controllers/google.controller';

const router = Router();

router.get('/session', getSessionController);
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController);

router.get('/profile', getProfileController);
router.patch('/profile', patchProfileController);
router.put('/profile/photo', putProfilePhotoController);

router.post('/change-password', changePasswordController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);

router.get('/users', listUsersController);

router.get('/google/start', googleStartController);
router.get('/google/callback', googleCallbackController);
router.get('/google/link', googleLinkStartController);
router.post('/google/unlink', googleUnlinkController);

export default router;
