import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {
    constructor(
        private userRepository: IUsersRepository,
        private mailProvider: IMailProvider,
    ) {}

    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExist = await this.userRepository.findByEmail(data.email);

        if(userAlreadyExist) {
            throw new Error('User Alread exist');
        }

        const user = new User(data);

        await this.userRepository.save(user);

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email
            },
            from: {
                name: "Equipe do meu app",
                email: "meuapp@app.com"
            },
            subject: 'Seja bem-vindo à plataforma!',
            body: '<p>Você já pode fazer login em nossa plataforma!</p>'
        });
    }
}