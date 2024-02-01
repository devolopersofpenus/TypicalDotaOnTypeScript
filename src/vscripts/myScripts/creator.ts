class RGBcustom{
    useCustom: boolean = true
    r:number;
    g:number;
    b:number;
    constructor(_r:number=255,_g:number=0,_b:number=0){
        this.r=_r;
        this.g=_g;
        this.b=_b;
    }
}
interface NPC_Creator_Hero extends CDOTA_BaseNPC_Hero{
    creator:boolean
    customColorHealthBar:boolean
    customColorModel:boolean
    customColorPlayer:boolean
    //defaultColorPlayer: RGBcustom
}

export class Creator{
    private steamIDs = [
        "76561198126455179",//friendly spy

    ]
    private speedChange:number = 1/30
    private currentColor:RGBcustom = new RGBcustom()
    private unitsOfDevolopers:any[]=[]

    private changeCurrentColor(){
        if(this.currentColor.r==255 && this.currentColor.g<255 && this.currentColor.b == 0){
            this.currentColor.g+=5;
        }
        else if(this.currentColor.r>0 && this.currentColor.g==255 && this.currentColor.b == 0){
            this.currentColor.r-=5;
        }
        else if(this.currentColor.r==0 && this.currentColor.g==255 && this.currentColor.b < 255){
            this.currentColor.b+=5;
        }
        else if(this.currentColor.r==0 && this.currentColor.g>0 && this.currentColor.b == 255){
            this.currentColor.g-=5;
        }
        else if(this.currentColor.r<255 && this.currentColor.g==0 && this.currentColor.b == 255){
            this.currentColor.r+=5;
        }
        else if(this.currentColor.r==255 && this.currentColor.g==0 && this.currentColor.b >0){
            this.currentColor.b-=5;
        }
    }

    private isCreator(unit:CDOTA_BaseNPC_Hero):boolean{
        if((<NPC_Creator_Hero>unit).creator == void(0)){
            return false
        }
        return (<NPC_Creator_Hero>unit).creator
    }

    private OnNpcSpawned(event:NpcSpawnedEvent) {
        //print("Entity spawn")
        let unit = EntIndexToHScript(event.entindex)
        if(((<CDOTA_BaseNPC>unit).IsHero()) || (<CDOTA_BaseNPC>unit).IsIllusion()){
            if(this.isCreator(<CDOTA_BaseNPC_Hero>unit)){
                this.unitsOfDevolopers.push(unit)
            }
            else{
                let steamID_Unit = tostring(PlayerResource.GetSteamID((<CDOTA_BaseNPC>unit).GetPlayerOwnerID()))
                if(this.steamIDs.includes(steamID_Unit)){
                    (<NPC_Creator_Hero>unit).creator = true;
                    (<NPC_Creator_Hero>unit).customColorHealthBar = true;
                    (<NPC_Creator_Hero>unit).customColorModel = true;
                    (<NPC_Creator_Hero>unit).customColorPlayer = true;
                    //(<NPC_Creator_Hero>unit).defaultColorPlayer= PlayerResource.Color

                    this.unitsOfDevolopers.push(unit)

                }
            }
        }
    }
    private OnKilledEntity(event:EntityKilledEvent){
        //print("Entity killed")
        let unit = <CDOTA_BaseNPC_Hero>EntIndexToHScript(event.entindex_killed)
        if(this.isCreator(unit)){
            this.unitsOfDevolopers.splice(this.unitsOfDevolopers.indexOf(unit),1)
        }
    }
    public OnThink(){
        //print("think")
        this.changeCurrentColor()
        if(this.unitsOfDevolopers){
            if(this.unitsOfDevolopers.length>0){
                for(let i =0; i<this.unitsOfDevolopers.length;i++){
                    let unit = <NPC_Creator_Hero>this.unitsOfDevolopers[i]
                    if(unit.customColorHealthBar){
                        SetTeamCustomHealthbarColor(unit.GetTeam(),this.currentColor.r,this.currentColor.g,this.currentColor.b)
                    }
                    else{
                        ClearTeamCustomHealthbarColor(unit.GetTeam())
                    }
                    if(unit.customColorModel){
                        unit.SetRenderColor(this.currentColor.r,this.currentColor.g,this.currentColor.b)
                    }
                    else{
                        unit.SetRenderColor(255,255,255)
                    }
                    if(unit.customColorPlayer){
                        PlayerResource.SetCustomPlayerColor(unit.GetPlayerID(),this.currentColor.r,this.currentColor.g,this.currentColor.b)
                    }
                }
            }
        }
        return this.speedChange
    }
    public Init(){
        ListenToGameEvent("entity_killed",event => this.OnKilledEntity(event),undefined)
        ListenToGameEvent("npc_spawned",event =>this.OnNpcSpawned(event),undefined)
        GameRules.GetGameModeEntity().SetThink("OnThink",this,"CreatorTnihk",1)
    }

    public constructor(){
        
    }
}