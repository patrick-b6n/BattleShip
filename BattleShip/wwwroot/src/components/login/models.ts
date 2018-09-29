export interface LoginCallups {
    setPlayerName: (name: string) => any;
    changeView: (view: string) => any;
}

export class LoginState implements LoginCallups {
    setPlayerName: (name: string) => any;
    changeView: (view: string) => any;
}