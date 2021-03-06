import { AppError } from "@errors/error";
import { ICarImageRequest } from "@modules/cars/interface/ICarImage";
import { CarImagesRepository } from "@modules/cars/repositories/CarsImageReository";
import { CarsRepository } from "@modules/cars/repositories/CarsRepository";
import { IStorageProvider } from "@shared/container/providers/Storage/IStorage";
import { inject, injectable } from "tsyringe";

@injectable()
export class UploadCarImageUseCase {
  constructor(
    @inject("CarImagesRepository")
    private readonly carImagesRepository: CarImagesRepository,
    @inject("CarsRepository")
    private readonly carRepository: CarsRepository,
    @inject("LocalStorageProvider")
    private readonly storageProvider: IStorageProvider
  ) {}

  async execute ({
    car_id,
    image_name
  }: ICarImageRequest): Promise<void> {
    
    const car = await this.carRepository.findById(car_id)

    if (!car) {
      throw new AppError("Car not found")
    }

    image_name.map(async (image) => {
      await this.carImagesRepository.create(car_id, image)
      await this.storageProvider.save(image, "cars")
    })
  }
}
