import { Router } from "express";
import US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.js";
import { updateProfileSchema } from "./user.validation.js";
import validation from "../../common/middleware/validation.js";
const userRouter = Router();
userRouter.get("/profile", authentication, US.getProfile);
userRouter.patch(
    "/update-profile",
    validation(updateProfileSchema),
    authentication,
    US.updateProfile,
);
userRouter.patch("/follow-user", authentication, US.followUser);
userRouter.patch("/unfollow-user", authentication, US.unfollowUser);
userRouter.patch("/search-user", authentication, US.searchUser);

export default userRouter;
