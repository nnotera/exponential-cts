import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "ouo_spedup";
var name = "Basic Theory (speedup)";
var description = "x3600 speedup\nThis theory leads to a beautiful conclusion and is based off of the basic starter theory you get when making custom theories. It has a LOT of story chapters but you'll be satisfied in the end :) Gilles rejected this at the start but I want the true meaning of this theory to be known. How simple beginnings can lead to beautiful endings - how even the simplest things have meaning in them.";
var authors = "invalid-user\n(mod) notera";
var version = 5;

var currency;
var tai, rao, C;
var c1Exp, c2Exp;
theory.primaryEquationHeight=100;
//Custom cost (this was a frustration)
var myCustomCost = (level) => {
var cost;
var cat2;
switch(level) {
case 0: {cost=BigNumber.from("8e0");break}
case 1: {cost=BigNumber.from("1.6e1");break}
case 2: {cost=BigNumber.from("2.4e1");break}
case 3: {cost=BigNumber.from("4e1");break}
case 4: {cost=BigNumber.from("6e1");break}
case 5: {cost=BigNumber.from("1e2");break}
case 6: {cost=BigNumber.from("3e2");break}
case 7: {cost=BigNumber.from("3.4e2");break}
case 8: {cost=BigNumber.from("3.8e2");break}
case 9: {cost=BigNumber.from("4.2e2");break}
case 10: {cost=BigNumber.from("4.6e2");break}
case 11: {cost=BigNumber.from("5e2");break}
case 12: {cost=BigNumber.from("5.8e2");break}
}
return cost;
}

var achievement1;
var achievement2;
var achievement3;
var achievement4;
var achievement5;
var achievement6;
var achievement7;
var achievement8;
var achievement9;
var achievement10;
var achievement11;
var achievement12, achievement13, achievement14, achievement15, achievement16;
var achievement17;
var achievement18;
var achievement19;
var achievement20;
var chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9, chapter10, chapter11, chapter12, chapter13, chapter14;

cat = theory.createAchievementCategory(0, "Basic Theory");
cat2 = theory.createAchievementCategory(1, "Secrets");
var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "tai=" + getC1(level).toString(0);
        tai = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
        tai.getDescription = (_) => Utils.getMath(getDesc(tai.level));
        tai.getInfo = (amount) => Utils.getMathTo(getDesc(tai.level), getDesc(tai.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "rao=2^{" + level + "}";
        let getInfo = (level) => "rao=" + getC2(level).toString(0);
        rao = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(10)));
        rao.getDescription = (_) => Utils.getMath(getDesc(rao.level));
        rao.getInfo = (amount) => Utils.getMathTo(getInfo(rao.level), getInfo(rao.level + amount));
    }
    // c3
    {
        if (1 == 1) {
            let getDesc = (level) => "C=10^{" + level + "}";
            let getInfo = (level) => "C=" + getC3(level).toString(0);
            C = theory.createUpgrade(2, currency, new ExponentialCost(BigNumber.from("1e10"), 10));
            C.getDescription = (_) => Utils.getMath(getDesc(C.level));
            C.getInfo = (amount) => Utils.getMathTo(getInfo(C.level), getInfo(C.level + amount));
        }

    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e7);
    theory.createBuyAllUpgrade(1, currency, 1e8);
    theory.createAutoBuyerUpgrade(2, currency, 1e10);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new CustomCost(myCustomCost));

    {
        c1Exp = theory.createMilestoneUpgrade(0, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("tai", "0.08");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("tai", "0.08");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c2Exp = theory.createMilestoneUpgrade(1, 3);
        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("rao", "0.077");
        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("rao", "0.077");
        c2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    {
        m4Exp = theory.createMilestoneUpgrade(2, 6);
        m4Exp.description = "Increase Tay Exponent";
        m4Exp.info = "Increases Tay exponent by (level + 1)/1000";
        m4Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    {
        m5 = theory.createMilestoneUpgrade(3, 1);
        m5.description = "Unleash C";
        m5.info = "Unleash C (C exponent is greatly increased)";
        m5.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, cat, "The Beginnings", "Started!", () => currency.value == 0);
    achievement2 = theory.createAchievement(1, cat, "gogogo!", "Reach 1e5 rho", () => currency.value > BigNumber.from("1e5"));
    achievement3 = theory.createAchievement(2, cat, "Nostalgia", "Reach 1e7 rho, enough to unlock publications", () => currency.value > BigNumber.from("1e7"));
    achievement4 = theory.createAchievement(3, cat, "A Stone's Throw Away", "Reach 1e20 rho, enough to unlock the first milestone", () => currency.value > BigNumber.from("1e20"));
    achievement5 = theory.createAchievement(4, cat, "haha funny number", "No description needed", () => currency.value > BigNumber.from("4.2e69"));
    achievement6 = theory.createAchievement(5, cat, "Century", "Reach ee100 rho", () => currency.value > BigNumber.from("1e100"));
    achievement7 = theory.createAchievement(6, cat, "A fourth of the way", "Reach e250 rho", () => currency.value > BigNumber.from("1e250"));
    achievement8 = theory.createAchievement(7, cat, "funny number again", "ouo", () => currency.value > BigNumber.from("6.9e420"));
    achievement9 = theory.createAchievement(8, cat, "Increasing Existential Crisis", "Read the story", () => currency.value > BigNumber.from("1e500"));
    achievement10 = theory.createAchievement(9, cat, "Typos for a Snack", "Reach e750 rho", () => currency.value > BigNumber.from("1e750"));
    achievement11 = theory.createAchievement(10, cat, "ouo", "456789", () => currency.value > BigNumber.from("4.56e789"));
    achievement12 = theory.createAchievement(11, cat, "Almost there", "Reach ee900 rho", () => currency.value > BigNumber.from("1e900"));
    achievement13 = theory.createAchievement(12, cat, "Solution to Life", "Reach e1000 rho", () => currency.value > BigNumber.from("1e1000"));
    achievement14 = theory.createAchievement(13, cat, "Max C?", "Reach e1250 rho", () => currency.value > BigNumber.from("1e1250"));
    achievement15 = theory.createAchievement(14, cat, "Max C", "Reach e1450 rho", () => currency.value > BigNumber.from("1e1450"));
    achievement16 = theory.createAchievement(15, cat, "End", "Reach e1500 rho", () => currency.value >= BigNumber.from("1e1500"));
    achievement17 = theory.createSecretAchievement(16, cat2, "Get Trolled", "C actually does nothing LOL", "no hint for this", () => C.level > 5);
    achievement18 = theory.createSecretAchievement(17, cat2, "1111", "Reach 1.11e1111 tho", "11111111111111111", () => currency.value > BigNumber.from("1.11e1111"));
    achievement19 = theory.createSecretAchievement(18, cat2, "Weierstra🅱️", "hi im xli🅱️ and i liek weierstra🅱️ (C level > 143)", "you C...", () => C.level > 143);
    achievement20 = theory.createSecretAchievement(19, cat2, "Did you really think I wouldn't include another funny number achievment here?", "69 levels of c1 and 420 levels of C2", "something else is funny", () => tai.level === 420 && rao.level === 69);

    ///////////////////
    chapter1 = theory.createStoryChapter(0, "An Existential Crisis", "You have had this same dream every day for your life. \nThere's a function, and all you see is c1 and c2, along with a graph. Nothing else.\nAs you reach e1000 rho, however, the function just disappears. You wake up. \nAs you question this, you also wonder: why did I go through all this theorywork to discover such a simple way to solve whether the function you were handed to exists? Why you? Why do you exist? Why do these theories exist? Why does everything exist? Is there ever an answer to existence? \nWhoa. You've gone too far. Besides, how would you have an existential crisis at the ripe age of 82? \nYou think: perhaps I just follow my dreams and make a simple theory with just c1 and c2, as well as exponents. And rho as the currency, as expected. Besides, would it really hurt? You also embellish the theory with a few extra equations that make it more appealing to the scientific community by adding some seemingly random (but mathematically sensible) equations. \nYou name the variables Tai and Rao after your best friends.", () => currency.value == 0);
    chapter2 = theory.createStoryChapter(1, "Pain", "You see that your theory is progressing so slowly. It's painstaking, doing such slow calculations and watching. You wish it would be quicker and you'd get better tools by publication. But you decide to wait until you can publish and not give up. You need an answer.", () => currency.value > BigNumber.from("1e5"));
    chapter3 = theory.createStoryChapter(2, "Start of Speed", "Finally, you get to publish your theory. You call it \"The Theory of Simplicity\". \nMost people laugh at you, but others think you're on to something.", () => currency.value > BigNumber.from("1e7"));
    chapter4 = theory.createStoryChapter(3, "More Speed, Please", "You have achieved your first e20 of currency! \nYou celebrate by buying a milestone, making you faster. ", () => currency.value > BigNumber.from("1e20"));
    chapter5 = theory.createStoryChapter(4, "Century", "100. Why 100? Why is this number so special? What if the number system was different? How would it be different? Why does this exist? Why do we exist? Why does life exist? And why is my function so simple? \nThoughts attack your head like hornets, but you push on.", () => currency.value > BigNumber.from("1e100"));
    chapter6 = theory.createStoryChapter(5, "Halfway through", "You're halfway through your goal. Your questions have all taken you to this question: what is life? And why does life involve death and sadness? Why not just immortality? \nAnd yet again, your dreams have started to recur, getting more and more intense, so your philosophical thoughts also get stronger. But you push on.", () => currency.value > BigNumber.from("1e500"));
    chapter7 = theory.createStoryChapter(6, "Tay", "You get a bit more motivation again for a final push to reach your goal of e1000. But you notice - all your equations for C... it does nothing? \n (If you didn't get the Get Trolled achievement then, you get it now)\n C is useless?\n You ponder as to why this is the case when your other friend Tay knocks at the door. You respond, and he, seeing you looking troubled, asks what's going on. You explain it - and Tay realizes exactly what you must do.\n \"You see, C-power is a universal mathematical power that few know of, but it is very fundamental. While you cannot release all of the power at once, as it will be catastrophic, I will show you how to slowly channel the power, so that you can improve your progress. Maybe if you go far enough, I can show you the true power of C.\"", 
        () => {
        let result = currency.value >= BigNumber.from("1e750");
        if (result) {
            theory.invalidatePrimaryEquation();
            d(C)
        }
        return result});
    chapter8 = theory.createStoryChapter(7, "So close, yet so far", "You're almost there! gogogo, you can do it! Isn't that what your students said to you when you were so close to achieving the goal of seeing if e^bxdt converges or diverges?", () => currency.value > BigNumber.from("1e900"));
    chapter9 = theory.createStoryChapter(8, "Finality Pt 1", "And you reached it. All of a sudden, you see a sight in your eyes: \nAll the equations come together to form a scarily complex one, but then you see something hopping on the side. \nIt's e^(pi*i)+1. And it multiplies the rest of the equation. \nA lot of things appear all of a sudden. You as a child, looking at calculus equations back in 5th grade, then going to high school, becoming an undergraduate student, getting your students, solving the equation, being a professor, retiring, moving to Montreal, seeing your children grow up, and even your grandson, Gilles-Philippe. \nYou then see the Earth forming, the universe expanding from the big bang. But then the future comes into view: \nHumanity dies after a huge disaster shakes them and only a small group of people escape on a ship known as Seedship. They settle down with another civilization. But eventually, both civilizations die. The Sun dies. The sky grows darker as galaxies disappear beyond reach. And the last stars die. The universe grows dark. The last burst of Hawking Radiation from a black hole resonates through the universe, the last light in the universe.", () => currency.value >= BigNumber.from("1e1000"));
    chapter10 = theory.createStoryChapter(9, "Finality Pt 2", "But was that the culmination of all black holes in the universe? What would happen on the other side? Another big bang? And you realize.\n Life is a culmination of careful factors in the universe that combined together at just the right time. And it's a cycle, and so is everything inside and outside. One mustn't mess with the cycle because the universe will try to return back to the cycle. This is partly why people fear overpopulation if everyone was immortal, but also partly why humanity died in the future. We are here because of all these factors, and we must continue peacefully, as we are made of the same thing: atoms, quarks, gluons, etc. Even dark matter and dark energy came from the same big bang. We shouldn't be afraid of what life has in store for us and control it. We should instead realize our personal legends, and then live in peace with life. \nThe universe is a cycle because without it, things would quickly get our of control, just as the theories you did would diverge. \nAs your vision ends, you realize that you've realized your Personal Legend. You go on to chronicle your story in a book and pass it down to your grandchild (Gilles-Philippe), who makes a game based off of it: Exponential Idle.", () => currency.value >= BigNumber.from("1e1000"));
    chapter11 = theory.createStoryChapter(10, "But wait... there's more?", "However, one thought still remains in your head.\n You still haven't unleashed the power of C fully. Your friend tay has helped you along the way, but you still aren't anywhere near far enough to unleash the full power of C. \n You decide to continue in hopes that maybe one day you're worthy.", () => currency.value >= BigNumber.from("1e1000"));
    chapter12 = theory.createStoryChapter(11, "Almost There... again", "You have pushed your theory to new limits, reaching e1250 out of your goal of e1000. And you seem to have reached a maximum in the C power. \n This doesn't feel unleashed at all, you think. \n Your friend Tay comes along and lets you know - you are almost there. \n Just wait e200 more, and I will show you the TRUE power of C. You will be ready then. \n You push on.", () => currency.value >= BigNumber.from("1e1250"));
    chapter13 = theory.createStoryChapter(12, "Explosion", "\"You're ready\", Tay says. Your heart races as you await this final moment, one which you have waited for so long. \n \"Just press this button\" he says. \n And you do.", () => currency.value >= BigNumber.from("1e1450"));
    chapter14 = theory.createStoryChapter(13, "The True Finality", "Everything explodes in front of you. You have reached 1500 in no time. \n But the rates slow down. \n \"And for good reason too, you were about to faint\", says Tay. \n \"This is what true C power does to a man. It's too much for any man to handle, mind you, even gods of the universe find it too hard to handle - and yes, I am one of them. So are tai and rao. They wanted you to realize your destiny and you have. And as a reward, you get to keep some of the C power you had, but remember - with great power comes great responsibility.\", continued Tay\n And just behind you, a silver platter pops up with a title \"Solution to the Riemann Hypothesis - Reveal only when the world is ready\".\n You take it and realize that similar to C-power, some things are too much for the world to handle at the moment, such as the mathematical explosion from the proof. So, you hide it in one of your drawers, hope that people will take ages to find it. \n 42 years later, someone finds it. \n Their name is propfeds. \n Anyway, a quick thank you from the author of this CT (invalid-user) for playing this, I really enjoyed making the story. This is the end of the theory but you can continue playing this for the fun of it even after the end :)", () => {
        
        let result = m5.level == 1
        if (result) {
            if (theory.tau < BigNumber.from("9e599")){
                currency.value = BigNumber.from("1.05e1500")
                theory.invalidatePrimaryEquation();
            }
            
        }
        return result});

    //// Story chapters

    updateAvailability();
}

function d(C){
    let getDesc2 = (level) => "tay=10^{" + level + "}";
    let getInfo2 = (level) => "tay=" + getC3(level).toString(0);
    C.getDescription = (_) => Utils.getMath(getDesc2(C.level));
    C.getInfo = (amount) => Utils.getMathTo(getInfo2(C.level), getInfo2(C.level + amount));
}

function d2(C){
    let getDesc2 = (level) => "C=10^{" + level + "}";
    let getInfo2 = (level) => "C=" + getC3(level).toString(0);
    C.getDescription = (_) => Utils.getMath(getDesc2(C.level));
    C.getInfo = (amount) => Utils.getMathTo(getInfo2(C.level), getInfo2(C.level + amount));
}

var updateAvailability = () => {
    c2Exp.isAvailable = c1Exp.level >= 0;
    m4Exp.isAvailable = theory.tau >= BigNumber.from("1e300");
    m5.isAvailable = m4Exp.level == 6
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier * 3600);
    let bonus = theory.publicationMultiplier;
    if (m5.level == 0) {
        currency.value += dt * bonus * getC1(tai.level).pow(getC1Exponent(c1Exp.level)) *
                                   getC2(rao.level).pow(getC2Exponent(c2Exp.level)) * getC3(C.level).pow(getM4Exponent(m4Exp.level));
    }
    else {
        currency.value += dt * bonus * getC1(tai.level).pow(getC1Exponent(c1Exp.level)) *
            getC2(rao.level).pow(getC2Exponent(c2Exp.level)) * getC3(C.level).pow(0.015);
        
    }

    
    if (theory.tau > BigNumber.from("1e300")) {
        d(C)
    }
    else {
        d2(C)
    }
    updateAvailability();
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = (tai)";

    if (c1Exp.level == 1) result += "^{1.08}";
    if (c1Exp.level == 2) result += "^{1.16}";
    if (c1Exp.level == 3) result += "^{1.24}";
 
    result += "(rao)";
    if (c2Exp.level == 1) result += "^{1.077}";
    if (c2Exp.level == 2) result += "^{1.154}";
    if (c2Exp.level == 3) result += "^{1.231}";

    if (theory.tau <= BigNumber.from("1e300"))
        result+="+(\\frac{\\int_{0}^{tai*(e^{\\pi  i}+1)} x^{0.01C}dx}{\\frac{d}{dx}(1.71C^{1.7x}|x=rao)})"
    else {
        result+="(tay)^"
        
        if (m5.level == 0){
            result+="{"
            result+= getM4Exponent(m4Exp.level).toString(4)
            result+="}"
        }
        if (m5.level == 1){
            let num = 0.015
            result+="{"
            result+= num.toString()
            result+="}"
        }
    }    
    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho^{0.4}";
var getPublicationMultiplier = (tau) => tau.pow(1.25);
var getPublicationMultiplierFormula = (symbol) => symbol + "^{1.25}";
var getTau = () => currency.value.pow(0.4);
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getC2 = (level) => BigNumber.TWO.pow(level);
var getC3 = (level) => BigNumber.TEN.pow(level);
var getC1Exponent = (level) => BigNumber.from(1 + 0.08 * level);
var getC2Exponent = (level) => BigNumber.from(1 + 0.077 * level);
var getM4Exponent = (level) => BigNumber.from( ((level + 1) * (level + 2)/2 - 1) * 0.0003);

init();
//innit?
