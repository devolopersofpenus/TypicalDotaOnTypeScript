import { reloadable } from "./lib/tstl-utils";
import { modifier_panic } from "./modifiers/modifier_panic";
import { setting } from "./settings";
import { Events } from "./events"
import { Creator } from "./myScripts/creator";
import { ChatCommandModule } from "./myScripts/chatCommand";
//print("Real Hero? ",(!(<CDOTA_BaseNPC>killed_unit).IsReincarnating()))


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
let eventModule = new Events();
let creatorModule = new Creator();
let chatCommandModule = new ChatCommandModule();
@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
    }

    public static Activate(this: void) {
        print("Active customgame")
        // When the addon activates, create a new instance of this GameMode class.
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        // Register event listeners for dota engine events
        
        ListenToGameEvent("game_rules_state_change", event => eventModule.OnStateChange(event), undefined);
        ListenToGameEvent("npc_spawned", event => eventModule.OnNpcSpawned(event), undefined);
        ListenToGameEvent("entity_killed", event => eventModule.OnEntityKilled(event), undefined);
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
        this.initModule()
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
    initModule(){
        print("Init modules")
        creatorModule.Init()
        chatCommandModule.Init()
    }
    



    // Called on script_reload
    public Reload() {
        print("Script reloaded!");

        // Do some stuff here
    }

    
    private OnPlayerPickHero(event:DotaPlayerPickHeroEvent){
        print("SASSASSASS")
        print(PlayerResource.HasRandomed(event.player as PlayerID))
    }
}
