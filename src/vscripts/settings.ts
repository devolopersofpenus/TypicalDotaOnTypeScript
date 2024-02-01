class Settings{
    GOODTEAM:Team ={
        count:5
    }
    BADTEAM:Team ={
        count:5
    }
    PREGAMETIMING:PreGameTiming={
        gameSetupTime: 25,
        heroSelectionTime: 80,
        strategyTime: 30,
        showCaseTime: 12,
        preGameTime: 50,
        postGAmeTime: 60
    }
    BUYBACK:Buyback={
        baybackEnabled: true,
        baybackCooldown: 480
    }
    goldSettings:Gold={
        startGold: 800,
        randomGold: 1050,
        goldPerTick: 2,
        goldTickRate: 0.9
    }
    respawnTime:RespawnTime={
        fixedRespawn: -1,
        maxRespawn: 120,
        useCustomRespawnTime: true,
        respawnTimeLevels: []
    }
    maxLevel=30
    private levelCalculate(){
        this.respawnTime.respawnTimeLevels[0]=5
        for(let i =1;i<this.maxLevel;i++){
            if(i<11){
                this.respawnTime.respawnTimeLevels[i]=this.respawnTime.respawnTimeLevels[i-1]+1
            }else if(i<26){
                this.respawnTime.respawnTimeLevels[i]=this.respawnTime.respawnTimeLevels[i-1]+2
            }else{
                this.respawnTime.respawnTimeLevels[i]=this.respawnTime.respawnTimeLevels[i-1]+5
            }
        }
    }
    constructor(){
        this.levelCalculate()
    }
}
export let setting= new Settings();