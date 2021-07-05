import { baseUrls } from './http-constants';
import io from 'socket.io-client';

export default class Connection {
    private static socket = io(baseUrls.applicationManagerUrl)

    private constructor() {
    }

    public static getSocket(){
        return this.socket;
    }

    public static connect(){
        this.socket.on('connect', function () {
            console.log("connected")
        });
    }
}