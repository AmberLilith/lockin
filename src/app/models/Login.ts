export class Login{
    id: string
    plataformName: string
    password: string
    user: string

    constructor(id: string, plataformName: string, password: string, user: string){
        this.id = id
        this.plataformName = plataformName
        this.password = password
        this.user = user
    }
}