interface Team{
    count:number                //Players on team
}
interface PreGameTiming{
    gameSetupTime:number        //How long should custom game setup last - the screen where players pick a team?
    heroSelectionTime:number    //How long should we let people select their hero? Should be at least 5 seconds.
    strategyTime:number         //How long should strategy time last? Bug: You can buy items during strategy time and it will not be spent!
    showCaseTime:number         //How long should show case time be?
    preGameTime:number          //How long after showcase time should the horn blow and the game start?
    postGAmeTime:number         //How long should we let people stay around before closing the server automatically?
}
interface Buyback{
    baybackEnabled:boolean
    baybackCooldown:number
}
interface Gold{
    startGold:number
    randomGold:number
    goldPerTick:number
    goldTickRate:number
}
interface CustopXP{
    USE_CUSTOM_XP_VALUES:boolean
    maxLevel:number
}
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
    constructor(){

    }
}
export let setting= new Settings();