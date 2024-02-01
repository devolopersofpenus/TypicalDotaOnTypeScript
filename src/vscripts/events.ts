import { setting } from "./settings"

export class Events{
    public OnEntityKilled(event:EntityKilledEvent){
        let killed_unit = EntIndexToHScript(event.entindex_killed)
        if(killed_unit?.IsBaseNPC()){
            if((<CDOTA_BaseNPC>killed_unit).IsClone()){
                killed_unit = (<CDOTA_BaseNPC>killed_unit).GetCloneSource()
            }
        }
        if((<CDOTA_BaseNPC>killed_unit).IsRealHero() && (!(<CDOTA_BaseNPC>killed_unit).IsReincarnating())){
            print("Not Reincor and Real hero")
            let respawn_time
            let killed_unit_level = (<CDOTA_BaseNPC>killed_unit).GetLevel()
            if(setting.respawnTime.useCustomRespawnTime==true){
                respawn_time = setting.respawnTime.respawnTimeLevels[killed_unit_level-1]
                print(respawn_time)
                DeepPrintTable(setting.respawnTime.respawnTimeLevels)
            }
            else{
                respawn_time = (<CDOTA_BaseNPC_Hero>killed_unit).GetRespawnTime()
            }

            (<CDOTA_BaseNPC_Hero>killed_unit).SetTimeUntilRespawn(respawn_time)
        }
    }
    public OnNpcSpawned(event: NpcSpawnedEvent) {
        // After a hero unit spawns, apply modifier_panic for 8 seconds
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
        // Give all real heroes (not illusions) the meepo_earthbind_ts_example spell
        if (unit.IsRealHero()) {
        }
    }
    public OnStateChange(event:any): void {
        DeepPrintTable(event)
        const state = GameRules.State_Get();

        // Add 4 bots to lobby in tools
        /*if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
            for (let i = 0; i < 4; i++) {
                Tutorial.AddBot("npc_dota_hero_lina", "", "easy", false);
            }
        }//*/

        /*if (state === GameState.CUSTOM_GAME_SETUP) {
            // Automatically skip setup in tools
            if (IsInToolsMode()) {
                Timers.CreateTimer(3, () => {
                    GameRules.FinishCustomGameSetup();
                });
            }
        }//*/

        // Start game once pregame hits
        if (state === GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
        if(state === GameState.STRATEGY_TIME){
            for(let i=0;i<19;i++){
                if (PlayerResource.IsValidPlayerID(i)){
                    if(!PlayerResource.HasSelectedHero(i)){
                        PlayerResource.GetPlayer(i)?.MakeRandomHeroSelection()
                        PlayerResource.SetHasRandomed(i)
                        print("Player "+i+" ramdom with gamemode")
                    }
                }
            }
        }
    }
    private StartGame(): void {
        print("Game starting!");

        // Do some stuff here
    }
}