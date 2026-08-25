import { Router } from 'express';
import {
  changePasswordController,
  getSessionController,
  loginController,
  logoutController,
  patchProfileController,
  putProfilePhotoController,
  registerController,
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

router.patch('/profile', patchProfileController);
router.put('/profile/photo', putProfilePhotoController);

router.post('/change-password', changePasswordController);

router.get('/google/start', googleStartController);
router.get('/google/callback', googleCallbackController);
router.get('/google/link', googleLinkStartController);
router.post('/google/unlink', googleUnlinkController);

export default router;
