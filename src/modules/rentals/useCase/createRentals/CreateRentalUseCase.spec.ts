
import { AppError } from "@errors/error";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsInMemory";
import { DayJsDateProvider } from "@shared/container/providers/Date/implementations/DayJsDateProvider";
import dayjs from "dayjs";
import { RentalRepositoryInMemory } from "../../repositories/repositoriesInMemory/RentalRepositoryInMemory"
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase
let rentalRepositoryInMemory: RentalRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryInMemory
let dayjsDateProviderInMemory: DayJsDateProvider

describe('Create Rental', () =>{
  const dayAdd24Hours = dayjs().add(1, 'day').toDate()
  beforeEach(() => {
    rentalRepositoryInMemory = new RentalRepositoryInMemory()
    carsRepositoryInMemory = new CarsRepositoryInMemory()
    dayjsDateProviderInMemory = new DayJsDateProvider()
    createRentalUseCase = new CreateRentalUseCase(rentalRepositoryInMemory, dayjsDateProviderInMemory, carsRepositoryInMemory);
  })

  it('Should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fusca',
      description: 'Carro de luxo',
      daily_rate: 200,
      license_plate: `ABC-1234`,
      fine_amount: 10,
      brand: 'VW',
      category_id: '1',
      specification: []
    })
      
    const rental = await createRentalUseCase.execute({
      user_id: '121212',
      car_id: car.id as string,
      expected_return_date: dayAdd24Hours
    });

    console.log(rental)

    expect(rental).toHaveProperty('id')
    expect(rental).toHaveProperty('start_date')
  })

  it('Should not be able to create a new rental if theres another open rental for the same user_id', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fusca',
      description: 'Carro de luxo',
      daily_rate: 200,
      license_plate: `ABC-1234`,
      fine_amount: 10,
      brand: 'VW',
      category_id: '1',
      specification: []
    })

    await createRentalUseCase.execute({
      user_id: '121212',
      car_id: car.id as string,
      expected_return_date: dayAdd24Hours
    });
    
    await expect(createRentalUseCase.execute({
        user_id: '121212',
        car_id: '131313',
        expected_return_date: dayAdd24Hours
      })
  
    ).rejects.toEqual(new AppError ('User already has a rental', 400))
  })

  it('Should not be able to create a new rental if theres another open rental for the same car_id', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fusca',
      description: 'Carro de luxo',
      daily_rate: 200,
      license_plate: `ABC-1234`,
      fine_amount: 10,
      brand: 'VW',
      category_id: '1',
      specification: []
    })
    
    await createRentalUseCase.execute({
      user_id: '121212',
      car_id: car.id as string,
      expected_return_date: dayAdd24Hours
    });
    
    await expect(createRentalUseCase.execute({
        user_id: '222222',
        car_id: car.id as string,
        expected_return_date: dayAdd24Hours
      })
  
    ).rejects.toEqual(new AppError('Car already rented', 400))
  })
  it('Should not be able to create a new rental if expected_return_date less than 24 hours', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Fusca',
      description: 'Carro de luxo',
      daily_rate: 200,
      license_plate: `ABC-1234`,
      fine_amount: 10,
      brand: 'VW',
      category_id: '1',
      specification: []
    })

    await expect(createRentalUseCase.execute({
        user_id: '222222',
        car_id: car.id as string,
        expected_return_date: new Date()
      })
    ).rejects.toEqual(new AppError('The expected return date has to be a lest 24h', 400))
  })
})
