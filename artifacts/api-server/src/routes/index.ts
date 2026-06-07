import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import articlesRouter from "./articles";
import projectsRouter from "./projects";
import experienceRouter from "./experience";
import educationRouter from "./education";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(articlesRouter);
router.use(projectsRouter);
router.use(experienceRouter);
router.use(educationRouter);

export default router;
