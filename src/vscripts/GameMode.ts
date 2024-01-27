import { reloadable } from "./lib/tstl-utils";
import { modifier_panic } from "./modifiers/modifier_panic";
import { setting } from "./settings";


declare global {
    interface freeCourier{
        (gamemode:any,bool:any):void
    }
    interface CDOTAGameRules{
        Addon: GameMode;
        SetFreeCourierModeEnabled: freeCourier
    }
    //interface CDOTABaseGameMode extends CDOTAGameRules{}
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
    }

    public static Activate(this: void) {
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        // Register event listeners for dota engine events
        ListenToGameEvent("game_rules_state_change", event => this.OnStateChange(event), undefined);
        ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);
        //ListenToGameEvent("dota_player_pick_hero",event => this.OnPlayerPickHero(event),undefined)

        // Register event listeners for events from the UI
        /*
        CustomGameEventManager.RegisterListener("ui_panel_closed", (_, data) => {
            print(`Player ${data.PlayerID} has closed their UI panel.`);

            // Respond by sending back an example event
            const player = PlayerResource.GetPlayer(data.PlayerID)!;
            CustomGameEventManager.Send_ServerToPlayer(player, "example_event", {
                myNumber: 42,
                myBoolean: true,
                myString: "Hello!",
                myArrayOfNumbers: [1.414, 2.718, 3.142]
            });

            // Also apply the panic modifier to the sending player's hero
            const hero = player.GetAssignedHero();
            hero.AddNewModifier(hero, undefined, modifier_panic.name, { duration: 5 });
        });
        //*/
    }

    private configure(): void {
        let gamemode = GameRules.GetGameModeEntity()
        gamemode.SetFreeCourierModeEnabled(true)
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, setting.GOODTEAM.count);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, setting.BADTEAM.count);

        GameRules.SetShowcaseTime(0);
        GameRules.SetHeroSelectionTime(setting.PREGAMETIMING.heroSelectionTime);

        GameRules.SetGoldTickTime(setting.goldSettings.goldTickRate)
        GameRules.SetGoldPerTick(setting.goldSettings.goldPerTick)
        GameRules.SetStartingGold(setting.goldSettings.startGold)
        print(setting.goldSettings.goldPerTick, setting.goldSettings.goldTickRate)
        GameRules.SetSafeToLeave(true)
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

    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }

    private OnNpcSpawned(event: NpcSpawnedEvent) {
        // After a hero unit spawns, apply modifier_panic for 8 seconds
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
        // Give all real heroes (not illusions) the meepo_earthbind_ts_example spell
        if (unit.IsRealHero()) {
        }
    }
    private OnPlayerPickHero(event:DotaPlayerPickHeroEvent){
        print("SASSASSASS")
        print(PlayerResource.HasRandomed(event.player as PlayerID))
    }
}
