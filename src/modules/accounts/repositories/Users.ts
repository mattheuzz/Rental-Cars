import { getRepository, Repository } from "typeorm"
import { Users } from "../infra/typeorm/entities/Users"
import { ICreateUserDto, IUserRepository } from "../interfaces/IUser"

export class UsersRepositorys implements IUserRepository {
  private repository: Repository<Users>

  constructor(){
    this.repository = getRepository(Users)
  }

  async create({ name, password, email, driver_license, id, avatar }: ICreateUserDto): Promise<void> {
    const user = this.repository.create({
      name,
      password,
      email,
      driver_license,
      id,
      avatar
    })

    await this.repository.save(user)
    console.log(user)
  }

  async findByEmail(email: string): Promise<Users> {
    const user = await this.repository.findOne({ email })
    return user as Users
  }

  async findById(id: string): Promise<Users> {
    const user = await this.repository.findOne(id)
    return user as Users
  }

}

