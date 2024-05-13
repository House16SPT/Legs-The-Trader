import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// New trader settings
import * as baseJson from "../db/base.json";
import { TraderHelper } from "./traderHelpers";
import { FluentAssortConstructor as FluentAssortCreator } from "./fluentTraderAssortCreator";
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

class Legs implements IPreAkiLoadMod, IPostDBLoadMod
{
    private mod: string
    private logger: ILogger
    private traderHelper: TraderHelper
    private fluentAssortCreator: FluentAssortCreator

    constructor()
    {
        this.mod = "house-legsthetrader-1.0.0"; // Set name of mod so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void
    {
        // Get a logger
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        // Get SPT code/data we need later
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new TraderHelper();
        this.fluentAssortCreator = new FluentAssortCreator(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "Legs.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 10000);

        // Add trader to trader enum
        Traders[baseJson._id] = baseJson._id;

        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;

        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);

        // Add milk
        /*
        const MILK_ID = "575146b724597720a27126d5"; // Can find item ids in `database\templates\items.json` or with https://db.sp-tarkov.com/search
        this.fluentAssortCreator.createSingleAssortItem(MILK_ID)
                                    .addStackCount(200)
                                    .addBuyRestriction(10)
                                    .addMoneyCost(Money.ROUBLES, 2000)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    */
        // Add 3x bitcoin + salewa for milk barter
        /*
        const BITCOIN_ID = "59faff1d86f7746c51718c9c"
        const SALEWA_ID = "544fb45d4bdc2dee738b4568";
        this.fluentAssortCreator.createSingleAssortItem(MILK_ID)
                                    .addStackCount(100)
                                    .addBarterCost(BITCOIN_ID, 3)
                                    .addBarterCost(SALEWA_ID, 1)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

                                    */
        // Add glock as money purchase
        /*
        this.fluentAssortCreator.createComplexAssortItem(this.traderHelper.createGlock())
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 20000)
                                    .addBuyRestriction(3)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    */
        // Add mp133 preset as mayo barter
        /*
        this.fluentAssortCreator.createComplexAssortItem(tables.globals.ItemPresets["584148f2245977598f1ad387"]._items)
                                    .addStackCount(200)
                                    .addBarterCost("5bc9b156d4351e00367fbce9", 1)
                                    .addBuyRestriction(3)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
			*/	
        //m4a1					
        this.fluentAssortCreator.createSingleAssortItem("5447a9cd4bdc2dbd208b4567")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 25423)
            .addLoyaltyLevel(2)
            .export(tables.traders[baseJson._id]);
        //ak104 7.62
        this.fluentAssortCreator.createSingleAssortItem("5ac66d725acfc43b321d4b60")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 35232)
            .addLoyaltyLevel(2)
            .export(tables.traders[baseJson._id]);
        //ak103 7.62
        this.fluentAssortCreator.createSingleAssortItem("5ac66d2e5acfc43b321d4b53")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 32300)
            .addLoyaltyLevel(2)
            .export(tables.traders[baseJson._id]);
        //ak105 5.45
        this.fluentAssortCreator.createSingleAssortItem("5ac66d9b5acfc4001633997a")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 28342)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        //ak74un 5.45
        this.fluentAssortCreator.createSingleAssortItem("583990e32459771419544dd2")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 23321)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);
        //ak74u 5.45         
                        
        this.fluentAssortCreator.createSingleAssortItem("57dc2fa62459775949412633")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 22341)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);                                    
        //ak74 5.45                           
        this.fluentAssortCreator.createSingleAssortItem("5bf3e03b0db834001d2c4a9c")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 22311)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]);  
        //ak12 5.45
        this.fluentAssortCreator.createSingleAssortItem("6499849fc93611967b034949")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 42345)
            .addLoyaltyLevel(2)
            .export(tables.traders[baseJson._id]); 
        //ADAR 5.56
        this.fluentAssortCreator.createSingleAssortItem("5c07c60e0db834002330051f")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 21423)
            .addLoyaltyLevel(1)
            .export(tables.traders[baseJson._id]); 
        //MCX SPEAR 6.8 
        this.fluentAssortCreator.createSingleAssortItem("65290f395ae2ae97b80fdf2d")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 56743)
            .addLoyaltyLevel(4)
            .export(tables.traders[baseJson._id]);
        
        //AK 545 5.45
        this.fluentAssortCreator.createSingleAssortItem("628b5638ad252a16da6dd245")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 50234)
            .addLoyaltyLevel(3)
            .export(tables.traders[baseJson._id]);

        //AK 545 short 5.45
        this.fluentAssortCreator.createSingleAssortItem("628b9c37a733087d0d7fe84b")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 51234)
            .addLoyaltyLevel(3)
            .export(tables.traders[baseJson._id]);
        //MUTANT  
        this.fluentAssortCreator.createSingleAssortItem("606587252535c57a13424cfd")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 57833)
            .addLoyaltyLevel(4)
            .export(tables.traders[baseJson._id]);
        //SVD
        this.fluentAssortCreator.createSingleAssortItem("5c46fbd72e2216398b5a8c9c")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 49506)
            .addLoyaltyLevel(2)
            .export(tables.traders[baseJson._id]);
        //VSS
        this.fluentAssortCreator.createSingleAssortItem("57838ad32459774a17445cd2")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 53203)
            .addLoyaltyLevel(2)
            .export(tables.traders[baseJson._id]);
        //RSASS
        this.fluentAssortCreator.createSingleAssortItem("5a367e5dc4a282000e49738f")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 64203)
            .addLoyaltyLevel(4)
            .export(tables.traders[baseJson._id]);
        //G28
        this.fluentAssortCreator.createSingleAssortItem("6176aca650224f204c1da3fb")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 67203)
            .addLoyaltyLevel(4)
            .export(tables.traders[baseJson._id]);
        //SR25
        this.fluentAssortCreator.createSingleAssortItem("5df8ce05b11454561e39243b")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 62203)
            .addLoyaltyLevel(4)
            .export(tables.traders[baseJson._id]);
        //KS-23
        this.fluentAssortCreator.createSingleAssortItem("5e848cc2988a8701445df1e8")
            .addUnlimitedStackCount()
            .addBuyRestriction(4)
            .addMoneyCost(Money.ROUBLES, 35302)
            .addLoyaltyLevel(4)
            .export(tables.traders[baseJson._id]);                         
            
        //AMX
        this.fluentAssortCreator.createSingleAssortItem("627e14b21713922ded6f2c15")
            .addUnlimitedStackCount()
            .addBuyRestriction(2)
            .addMoneyCost(Money.ROUBLES, 67003)
            .addLoyaltyLevel(4)
            .export(tables.traders[baseJson._id]);  
        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Legs", baseJson.nickname, baseJson.location, "Names legs, dont ask. Anyways I got lowers for ya.");

        this.logger.debug(`[${this.mod}] postDb Loaded`);
        this.logger.log("Get Building with Legs!",LogTextColor.BLUE)
    }
}

module.exports = { mod: new Legs() }