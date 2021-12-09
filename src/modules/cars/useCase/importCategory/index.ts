import { CategoryRepository } from "../../repositories/Category"
import { ImportCategoryController } from "./ImportCategoryController"
import { ImportCategoryUseCase } from "./ImportCategoryUseCase"

const categoryRepository = null

const importCategoryUseCase = new ImportCategoryUseCase(categoryRepository)

const importCategoryController = new ImportCategoryController(importCategoryUseCase)

export { importCategoryController }