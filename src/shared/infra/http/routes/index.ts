import { Router } from "express"
import { authenticateRoutes } from "./authenticate.routes"
import { carsRoutes } from "./cars"
import { categoriesRoutes } from "./categories.routes"
import { forgottenRoutes } from "./forgottenPassword.routes"
import { rentalsRoutes } from "./rentals.routes"
import { specificationRoutes } from "./specification.routes"
import { usersRoutes } from "./users.routes"

const router = Router()

router.use('/cars', carsRoutes)
router.use('/categories', categoriesRoutes)
router.use('/specifications', specificationRoutes)
router.use('/users', usersRoutes)
router.use('/rentals', rentalsRoutes)
router.use(authenticateRoutes)
router.use('/password', forgottenRoutes)

export { router }
