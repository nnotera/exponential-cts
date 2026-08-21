import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "banana_battery_speedup";
var name = "Bananavoltaic Battery (speedup)";
var description = "x3600 speedup\nHumanity reaches unimaginable technological heights, and starts to conquer distant stars. But as their civilization grows, so does its hunger. To address this issue, they create Argi-Worlds, planets terraformed solely for food production. \n\nYou are a former scientist on one of those Agri Worlds, enjoying the vast field of gigantic banana trees that stretches beyond the elegant terrestrial curve. \n\nBut a toxic solar storm erupted and headed toward the planet, causing a planet-wide blackout. The scrambling planetary population, now surrounded in scorched electric grids, lives in underground darkness dotted with banana-oil lanterns. \n\nWith ancient technologies in your hand and banana fields in your sight, it is now your job to light the damned planet up again.";
var authors = "soup (Author). \nwensstt (Coder). \nSpecial thanks to Mathis S. for helping us \nwith the theory sim and balancing.\n (speed mod) notera";
var version = 2;

var currency;
var m, m40;

var b1Exp, b2Exp;

var achievement1, achievement2, achievement3;
var chapter1, chapter2, chapter3, chapter4, chapter5, chapter6;

var init = () => {
    currency = theory.createCurrency();
    calcium = theory.createCurrency("Ca", "\\Ca"); //theory.createCurrency("ρ", "\\rho")
    argon = theory.createCurrency("Ar", "\\Ar");
    if (m === undefined) m = BigNumber.ZERO;
    if (m40 === undefined) m40 = BigNumber.ZERO;
    ///////////////////
    // Regular Upgrades

    // b1
    {
        let getDesc = (level) => "b_1=" + getB1(level).toString(0);
        b1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(1.5))));
        b1.getDescription = (_) => Utils.getMath(getDesc(b1.level));
        b1.getInfo = (amount) => Utils.getMathTo(getDesc(b1.level), getDesc(b1.level + amount));
    }

    // b2
    {
        let getDesc = (level) => "b_2=2^{" + level + "}";
        let getInfo = (level) => "b_2=" + getB2(level).toString(0);
        b2 = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(10)));
        b2.getDescription = (_) => Utils.getMath(getDesc(b2.level));
        b2.getInfo = (amount) => Utils.getMathTo(getInfo(b2.level), getInfo(b2.level + amount));
    }
    
    
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0);
        c1 = theory.createUpgrade(2, calcium, new ExponentialCost(0.1, Math.log2(1.5)));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level + 1));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level + 1), getDesc(c1.level + amount + 1));
    }

    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0);
        c2 = theory.createUpgrade(3, argon, new ExponentialCost((1e15), Math.log2(100000)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    {
        let getDesc = (level) => "c_3=3^{" + level + "}";
        let getInfo = (level) => "c_3=" + getC3(level).toString(0);
        c3 = theory.createUpgrade(4, calcium, new ExponentialCost((1e250), Math.log2(1000000000000000000)));
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level));
        c3.getInfo = (amount) => Utils.getMathTo(getInfo(c3.level), getInfo(c3.level + amount));
    }

    {
        let getDesc = (level) => "c_4=4^{" + level + "}";
        let getInfo = (level) => "c_4=" + getC4(level).toString(0);
        c4 = theory.createUpgrade(5, argon, new ExponentialCost(BigNumber.from("1e420"), Math.log2(1e30)));
        c4.getDescription = (_) => Utils.getMath(getDesc(c4.level));
        c4.getInfo = (amount) => Utils.getMathTo(getInfo(c4.level), getInfo(c4.level + amount));
        c4.maxLevel = 6; 
    }
    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e15);

    ///////////////////////
    //// Milestone Upgrades
    

    const milestoneCost = new CustomCost((level) =>
        {
            if(level == 0) return BigNumber.from(14 * 0.6);
            if(level == 1) return BigNumber.from(30 * 0.6);
            if(level == 2) return BigNumber.from(35 * 0.6);
            if(level == 3) return BigNumber.from(40 * 0.6);
            if(level == 4) return BigNumber.from(50 * 0.6);
            if(level == 5) return BigNumber.from(75 * 0.6);
            if(level == 6) return BigNumber.from(100 * 0.6);
            if(level == 7) return BigNumber.from(150 * 0.6);
            if(level == 8) return BigNumber.from(350 * 0.6);
            if(level == 9) return BigNumber.from(700 * 0.6);
            return BigNumber.from(-1);
        });

    theory.setMilestoneCost(milestoneCost);



    {
        calciumms = theory.createMilestoneUpgrade(0, 1);
        calciumms.description = Localization.getUpgradeUnlockDesc("c_1");
        calciumms.info = Localization.getUpgradeUnlockInfo("c_1");
        calciumms.canBeRefunded = () => etams.level == 0;
        calciumms.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }

        etams = theory.createMilestoneUpgrade(1,3);
        etams.description = Localization.getUpgradeMultCustomDesc(" {\\eta}", "2");
        etams.info = Localization.getUpgradeMultCustomInfo(" {\\eta}", "2");
        etams.canBeRefunded = () => argonms.level == 0;
        etams.boughtOrRefunded = (_) => { theory.invalidateTertiaryEquation(); updateAvailability(); }


        argonms = theory.createMilestoneUpgrade(2, 1);
        argonms.description = Localization.getUpgradeUnlockDesc("c_2");
        argonms.info = Localization.getUpgradeUnlockInfo("c_2");
        argonms.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }

        b1Exp = theory.createMilestoneUpgrade(3,3);
        b1Exp.description = Localization.getUpgradeIncCustomExpDesc("b_1", "0.050");
        b1Exp.info = Localization.getUpgradeIncCustomExpInfo("b_1", "0.050");
        b1Exp.boughtOrRefunded = (_) => { theory.invalidateSecondaryEquation(); updateAvailability(); }

        c3ms = theory.createMilestoneUpgrade(4,1);
        c3ms.description = Localization.getUpgradeUnlockDesc("c_3");
        c3ms.info = Localization.getUpgradeUnlockInfo("c_3");
        c3ms.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }

        c4ms = theory.createMilestoneUpgrade(5,1);
        c4ms.description = Localization.getUpgradeUnlockDesc("c_4");
        c4ms.info = Localization.getUpgradeUnlockInfo("c_4");
        c4ms.boughtOrRefunded = (_) => { theory.invalidatePrimaryEquation(); updateAvailability(); }
        

    }
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "Banana Grind", "Start your farm with one tree!", () => b1.level > 0);
    achievement2 = theory.createAchievement(1, "Useless Byproduct? Nvm...", "Buy your first c1 upgrade with some calcium!", () => c1.level > 0);
    achievement3 = theory.createAchievement(2,"80% effiency!", "You cannot seem to make anymore improvements on the beta battery, and the effiency is stuck at 80%. You decide to move", () => etams.level > 2);
    achievement4 = theory.createAchievement(3, "Another Byproduct of k40!", "Alot of argon starts to build up, you decide to do something with it by buying an upgrade of c2", () => c2.level > 0);
    achievement5 = theory.createAchievement(4, "Another use for calcium!", "You find a second use for calcium, unlock c3 milestone", () => c3ms.level > 0);
    achievement6 = theory.createAchievement(5, "Argon gains are crazy!", "The equation slowly slows after progressing this far, unlock c4 milestone", () => c4ms.level > 0);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "A Desperate Attempt ", "The moment the storm hit, the world erupted in chaos; exploding transformers and fried transistors were all that could be seen and smelled.\nAfter everyone hurried to the underground shelters, the government assembled scientists with a goal - to find a way to restore energy. You did not heed the call.\nYou hold a secret underground stash, or a garbage pile, of old technology.\nA while of digging later, signs of decay appeared on your augmented scanner. The signal matches those when you stand near a banana farm.\nRadioisotope-powered beta-batteries, powered by potassium-40. And there are stacks of them. \nWith a banana-oil lantern, hand-cranked magneto-optical separator, and twenty thousand beta-batteries, you travel up to the surface…", () => b1.level > 0);
    chapter2 = theory.createStoryChapter(1, "Xeno Encounter", "You have hit a roadblock: creating new beta-batteries. One array of twenty thousand batteries is not enough, and some of the materials are not native to this world. \nAnother problem arises: Calcium-40, the byproduct of K-40 decay, piling up in crates with no way to utilize.\nAs yous slowly falls into desperation, a strange, massive fleshy space vessel appears in low orbit. Your radio-receiver buzzes with a familiarly alien language: \n“Might I inquire if thou dost possess any calcium? We find ourselves in need thereof to mend our vessel, in exchange for the utilization of 'our' esteemed technology: the atomic replicator.” \nYou answer the question with an affirmative tone, then hastily load the orbital cargo railgun with crates of no-longer-useless Ca-40…", () => calciumms.level > 0);
    chapter3 = theory.createStoryChapter(2, "Archeotechno Heresy", "You take time to delve deeper into the techno stash.\nThe xenos' help was undeniable, but the battery itself was flawed in the first place.\nThe semiconductor part was of poor quality, and this has to be improved. If fellow scientists know you think about the archeotech like this, your life will be over.\nYou remember a section of the stash that contains material samples you have stolen over the last two centuries.\nThere are libraries of shelves, full of dusty boxes and crates. It took some time, but eventually you found them. \nWith boxes of different semiconductors in hand, you resurface and resume your work…", () => etams.level > 0);
    chapter4 = theory.createStoryChapter(3, "Second Xeno Encounter", "You continue your trade with the strange xenos.\nIt has been highly beneficial, but you need more, as powering the entire planet is a monumental task. \nAnother problem arises: Argon-40, another byproduct, floating idly in pressurized tanks. \nYou launch another shipment, as usual.\nSuddenly, almost frantically, the flesh ship starts to move, causing the calcium-40 crates to fly out into the cold deep space.\nA massive black ship, or fragments of it, appears in high orbit. It communicates using the same language as the flesh ship:\n“Cursed knaves! They plundered our vessel and laid waste to all in their wake! Fortuitously, we delivered them a sound thrashing ere they fled like cravens. Should this planet possess copious amounts of argon, we may barter such for the restoration of our ship in exchange for recompense.” \nYou respond with affirmation, and load up the orbital cargo railgun with Ar-40 tanks…", () => argonms.level > 0);
    chapter5 = theory.createStoryChapter(4, "Handy Extras","You take time to explore further from your place of operation, into the deep, mutated jungle of banana. \nEven with bio-augments and equipment on full power, it is still difficult to navigate the claustrophobic overgrown maze. \nThe banana itself seems to love the solar storm; its cluster now consists of individual fruits at a far more ludicrous amount than your mechanical mind can recall.\nYou go back to your usual working area, now surrounded by newly-surfaced inhabitants. They seem hopeful, and brimming with eagerness to help.\nThe two xenos are multiplying in high orbit, thanks to you being their unusual trader. Now fully prepared, the war began…", () => b1Exp.level > 0);
    chapter6 = theory.createStoryChapter(5, "???", "Finally, after all the hard work (plus some xenos’ violation of physics), the planet is now purged of darkness.\nPeople start moving on to planting other types of crops, but still allow the banana to stay as the electric grid is now dependent on it.\nWith the final countdown, you start broadcasting the message, calling the wider civilization to announce the Agri World’s return.\nBut before you can celebrate, a moon-sized object of flesh and steel begins to spearhead toward the planet.\nThe two xenos species locked in war for so long, oblivious to their exponential growth, began to collapse under their gravity.\n“This is absolutely bananas,” you think to yourself.\nBecause it is.\nThe End.", () => currency.value > BigNumber.from("1e1000"));

    updateAvailability();
}
    
var updateAvailability = () => {

    c1.isAvailable = calciumms.level > 0;
    c2.isAvailable = argonms.level > 0;
    etams.isAvailable = calciumms.level > 0;
    calcium.isAvailable = calciumms.level > 0;
    argonms.isAvailable = etams.level > 2;
    argon.isAvailable = argonms.level > 0;
    b1Exp.isAvailable = argonms.level > 0;
    c3ms.isAvailable = b1Exp.level > 2;
    c3.isAvailable = c3ms.level > 0;
    c4.isAvailable = c4ms.level > 0;
    c4ms.isAvailable = c3ms.level > 0;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier * 3600);
    let bonus = theory.publicationMultiplier;

    m += getB1(b1.level).pow(getB1Exponent(b1Exp.level)) * (3.5e-3) * getB2(b2.level) * dt;
    m40 = 0.0117 * m                                
    currency.value += dt * bonus * m40 * (getC1(c1.level) + 1) * 20000 * (0.1 * BigNumber.TWO.pow(etams.level)) * (getC2(c2.level)) * (getC3(c3.level)) * (getC4(c4.level));
    if (calciumms.level > 0) calcium.value += dt * m40 / 10000;
    if (argonms.level > 0) argon.value += dt * m40 / 100000;

    theory.invalidateTertiaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidatePrimaryEquation()
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = 20000{\\eta}m_k_{40}"; 
    if (calciumms.level == 1) result = "\\dot{\\rho} = 20000{\\eta}c_1m_k_{40}";
    if (argonms.level == 1) result = "\\dot{\\rho} = 20000{\\eta}c_1c_2m_k_{40}";
    return result;
}
var getTertiaryEquation = () => {
    let result = "m_k = " + m;
    result += " \\ \\ m_{k_{40}} = " + m40;
    result += " \\ \\ {\\eta} = "; 
    if (etams.level == 0) result += "10\\%";
    if (etams.level == 1) result += "20\\%";
    if (etams.level == 2) result += "40\\%";
    if (etams.level == 3) result += "80\\%";

    return result;
}

var getSecondaryEquation = () => {
    let result = "\\dot{m_k} = 100b_1 b_2(3.5e-7) \\ ";
    if (b1Exp.level == 1) result = "\\dot{m_k} = 100{b_1}^{1.05}b_2(3.5e-7) \\ ";
    if (b1Exp.level == 2) result = "\\dot{m_k} = 100b_1^{1.10}b_2(3.5e-7) \\ ";
    if (b1Exp.level == 3) result = "\\dot{m_k} = 100b_1^{1.15}b_2(3.5e-7) \\ ";
    result += "\\ {m_{k_{40}}} = 0.0117m_k";
    return result;
}

var getPublicationMultiplier = (tau) => tau.pow(0.300) / BigNumber.FOUR;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.300}}{4}";
var getTau = () => (currency.value).pow(0.6);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();
var getCurrencyFromTau = (tau) => [tau.pow(10/6), currency.symbol];

var getB1 = (level) => Utils.getStepwisePowerSum(level, 2, 6, 0);
var getB2 = (level) => BigNumber.TWO.pow(level);
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 8, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC3 = (level) => BigNumber.THREE.pow(level);
var getC4 = (level) => BigNumber.FOUR.pow(level);
var getB1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getB2Exponent = (level) => BigNumber.from(1 + 0.05 * level);

var postPublish = () => {
    m = BigNumber.ZERO;
    m40 = BigNumber.ZERO;

    updateAvailability();
};
init();
