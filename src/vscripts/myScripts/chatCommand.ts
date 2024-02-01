export class ChatCommandModule{
    private checkChat(event:ChatNewMessageEvent){
        DeepPrintTable(event)
        let textLow=string.lower(event.channel.toString())
    }
    public Init(){
        print("ChatCommantModule activete!")
        ListenToGameEvent("chat_new_message",event => this.checkChat(event),undefined)
    }
}
class ChatCommand{
    private _command:string="";
    private _PrayerResource:CDOTA_PlayerResource|undefined=undefined;

}