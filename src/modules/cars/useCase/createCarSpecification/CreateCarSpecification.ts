
import { AppError } from "@errors/error";
import { Car } from "@modules/cars/infra/typeorm/entities/Cars";
import { ICarsRepository } from "@modules/cars/interface/ICars";
import { SpecificationRepository } from "@modules/cars/repositories/Specification";
import { inject, injectable } from "tsyringe";

interface IRequest {
  car_id: string;
  specification_id: string[];
}

@injectable()
export class CreateCarSpecificationUseCase {
  constructor(
    @inject('CarsRepository')
    private readonly carRepository: ICarsRepository,

    @inject('SpecificationRepository')
    private readonly specificationRepository: SpecificationRepository,
  ) {}


  async execute({ car_id, specification_id }: IRequest): Promise<Car> {
    const carExists = await this.carRepository.findById(car_id)


    if (!carExists) {
      throw new AppError('Car not found', 404)
    }

    const specificationExists = await this.specificationRepository.findById(specification_id)
    carExists.specification = specificationExists
    await this.carRepository.create(carExists)  
    
    return carExists
  }
}
